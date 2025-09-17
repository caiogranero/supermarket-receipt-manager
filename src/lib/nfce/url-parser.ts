import { z } from 'zod'

/**
 * NFCe URL Parameter Structure (São Paulo)
 * Based on analysis of the sample URL format
 */

// Validation schema for NFCe URL parameters
const NFCeParamsSchema = z.object({
  chave: z.string().length(44, 'NFCe key must be exactly 44 characters'),
  versao: z.string().regex(/^[0-9]$/, 'Version must be a single digit'),
  ambiente: z.string().regex(/^[12]$/, 'Environment must be 1 (production) or 2 (homolog)'),
  identificacao: z.string().regex(/^[0-9]$/, 'Identification must be a single digit'),
  verificacao: z.string().length(32, 'Verification hash must be 32 characters'),
})

export interface NFCeUrlParams {
  chave: string // 44-digit receipt identification key
  versao: string // Version (usually "2")
  ambiente: string // Environment: 1=production, 2=homolog
  identificacao: string // Identification (usually "1")
  verificacao: string // 32-character verification hash
}

export interface NFCeUrlParseResult {
  isValid: boolean
  url: string
  params: NFCeUrlParams | null
  error?: string
  metadata: {
    uf: string // State code (extracted from key)
    cnpj: string // CNPJ (extracted from key)
    modelo: string // Document model (extracted from key)
    serie: string // Series (extracted from key)
    numero: string // Document number (extracted from key)
    codigoVerificador: string // Verification code (extracted from key)
  } | null
}

/**
 * Parse NFCe URL from QR Code
 */
export function parseNFCeUrl(url: string): NFCeUrlParseResult {
  try {
    const urlObj = new URL(url)

    // Validate base URL structure
    if (!url.includes('nfce.fazenda.sp.gov.br')) {
      return {
        isValid: false,
        url,
        params: null,
        metadata: null,
        error: 'Invalid NFCe URL domain. Must be from fazenda.sp.gov.br',
      }
    }

    // Extract parameter string
    const paramString = urlObj.searchParams.get('p')
    if (!paramString) {
      return {
        isValid: false,
        url,
        params: null,
        metadata: null,
        error: 'Missing parameter "p" in URL',
      }
    }

    // Parse pipe-delimited parameters
    const parts = paramString.split('|')
    if (parts.length !== 5) {
      return {
        isValid: false,
        url,
        params: null,
        metadata: null,
        error: `Expected 5 pipe-delimited parameters, got ${parts.length}`,
      }
    }

    const [chave, versao, ambiente, identificacao, verificacao] = parts

    // Create params object
    const params: NFCeUrlParams = {
      chave,
      versao,
      ambiente,
      identificacao,
      verificacao,
    }

    // Validate parameters
    const validation = NFCeParamsSchema.safeParse(params)
    if (!validation.success) {
      return {
        isValid: false,
        url,
        params: null,
        metadata: null,
        error: `Invalid parameters: ${validation.error.issues.map(i => i.message).join(', ')}`,
      }
    }

    // Extract metadata from the 44-digit key
    const metadata = extractNFCeKeyMetadata(chave)

    return {
      isValid: true,
      url,
      params,
      metadata,
    }
  } catch (error) {
    return {
      isValid: false,
      url,
      params: null,
      metadata: null,
      error: `URL parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Extract metadata from the 44-digit NFCe key
 * Format: UF(2) + CNPJ(14) + Modelo(2) + Serie(3) + Numero(9) + Código(8) + DV(1) + Ano/Mês(4) + CNPJ(1)
 */
function extractNFCeKeyMetadata(chave: string): NFCeUrlParseResult['metadata'] {
  if (chave.length !== 44) {
    return null
  }

  try {
    return {
      uf: chave.substring(0, 2), // State code (35 = São Paulo)
      cnpj: chave.substring(2, 16), // CNPJ of the issuer
      modelo: chave.substring(16, 18), // Document model (65 = NFCe)
      serie: chave.substring(18, 21), // Document series
      numero: chave.substring(21, 30), // Document number
      codigoVerificador: chave.substring(30, 38), // Verification code
      // Remaining positions contain DV and additional data
    }
  } catch {
    return null
  }
}

/**
 * Validate if a string looks like an NFCe URL
 */
export function isNFCeUrl(url: string): boolean {
  return url.includes('nfce.fazenda.sp.gov.br') && url.includes('ConsultaQRCode.aspx?p=')
}

/**
 * Build NFCe URL from parameters
 */
export function buildNFCeUrl(params: NFCeUrlParams): string {
  const baseUrl = 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx'
  const paramString = [params.chave, params.versao, params.ambiente, params.identificacao, params.verificacao].join('|')
  return `${baseUrl}?p=${paramString}`
}

/**
 * Extract QR code parameter string from NFCe URL
 */
export function extractQRCodeParam(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('p')
  } catch {
    return null
  }
}