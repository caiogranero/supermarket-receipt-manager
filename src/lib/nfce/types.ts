/**
 * NFCe Data Types and Interfaces
 * Complete type definitions for NFCe receipt data
 */

/**
 * Establishment (store) information
 */
export interface NFCeEstablishment {
  razaoSocial: string
  nomeFantasia?: string
  cnpj: string
  inscricaoEstadual?: string
  endereco: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    municipio: string
    uf: string
    cep?: string
  }
  telefone?: string
}

/**
 * Product/Item information
 */
export interface NFCeItem {
  numero: number // Item sequence number
  codigo: string // Product code
  descricao: string // Product description
  ncm?: string // NCM code
  cfop?: string // CFOP code
  unidadeComercial: string // Commercial unit (UN, KG, etc)
  quantidade: number
  valorUnitario: number
  valorTotal: number
  valorDesconto?: number
  informacoesAdicionais?: string
}

/**
 * Payment method information
 */
export interface NFCePayment {
  forma: string // Payment method description
  valor: number
  tipo?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'outros'
}

/**
 * Tax information
 */
export interface NFCeTaxes {
  valorTotalTributos: number
  valorAproximadoTributosFederais?: number
  valorAproximadoTributosEstaduais?: number
  valorAproximadoTributosMunicipais?: number
  fonte?: string // Source of tax info (e.g., "IBPT")
}

/**
 * Invoice totals
 */
export interface NFCeTotals {
  quantidadeItens: number
  valorProdutos: number
  valorDesconto?: number
  valorAcrescimo?: number
  valorFrete?: number
  valorSeguro?: number
  valorOutros?: number
  valorTotal: number
  valorPago: number
  troco?: number
}

/**
 * Consumer information
 */
export interface NFCeConsumer {
  nome?: string
  documento?: string // CPF or CNPJ
  tipoDocumento?: 'cpf' | 'cnpj'
  endereco?: {
    logradouro?: string
    numero?: string
    bairro?: string
    municipio?: string
    uf?: string
    cep?: string
  }
}

/**
 * Invoice metadata
 */
export interface NFCeMetadata {
  numero: string // Invoice number
  serie: string // Invoice series
  modelo?: string // Model (usually "65" for NFCe)
  dataEmissao: Date
  dataAutorizacao?: Date
  chaveAcesso: string // 44-digit access key
  protocolo?: string // Authorization protocol
  tipoEmissao: 'normal' | 'contingencia' | 'offline'
  tipoAmbiente: 'producao' | 'homologacao'
  versaoXml?: string
  versaoXslt?: string
  urlConsulta?: string // URL to check invoice
  qrCode?: string // QR code data
  digestValue?: string // Digital signature
}

/**
 * Complete NFCe receipt data structure
 */
export interface NFCeReceiptData {
  estabelecimento: NFCeEstablishment
  itens: NFCeItem[]
  pagamentos: NFCePayment[]
  totais: NFCeTotals
  tributos?: NFCeTaxes
  consumidor?: NFCeConsumer
  metadata: NFCeMetadata
  informacoesComplementares?: string
  observacoesFisco?: string
  scrapedAt?: Date
}

/**
 * Scraping result wrapper
 */
export interface NFCeScrapingResult {
  success: boolean
  data: NFCeReceiptData | null
  error?: string
  errorDetails?: {
    code?: string
    field?: string
    message: string
  }[]
  scrapedAt: Date
  parseTime?: number // Time taken to parse in ms
}

/**
 * Parser options
 */
export interface NFCeParserOptions {
  strictMode?: boolean // Fail on any missing required field
  includeRawHtml?: boolean // Include raw HTML in response
  timeout?: number // Parsing timeout in ms
  retryOnError?: boolean // Retry parsing on failure
  maxRetries?: number // Maximum number of retries
}

/**
 * Error types for better error handling
 */
export enum NFCeErrorType {
  INVALID_URL = 'INVALID_URL',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  SERVER_ERROR = 'SERVER_ERROR'
}

/**
 * Custom error class for NFCe operations
 */
export class NFCeError extends Error {
  constructor(
    public type: NFCeErrorType,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'NFCeError'
  }
}

/**
 * Validation schemas using type guards
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/[^\d]/g, '')
  return cleaned.length === 14
}

export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/[^\d]/g, '')
  return cleaned.length === 11
}

export const isValidChaveAcesso = (chave: string): boolean => {
  const cleaned = chave.replace(/[^\d]/g, '')
  return cleaned.length === 44
}

/**
 * Utility type for partial updates
 */
export type PartialNFCeData = Partial<NFCeReceiptData>

/**
 * Type guards
 */
export const isNFCeReceiptData = (data: any): data is NFCeReceiptData => {
  return (
    data &&
    typeof data === 'object' &&
    'estabelecimento' in data &&
    'itens' in data &&
    Array.isArray(data.itens) &&
    'totais' in data &&
    'metadata' in data
  )
}