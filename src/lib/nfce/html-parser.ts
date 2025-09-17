/**
 * HTML Parser for NFCe Receipt Data
 * Simple HTML parsing without external dependencies
 */

/**
 * Extract text content between HTML tags
 */
function extractTextBetweenTags(html: string, startTag: string, endTag: string): string | null {
  const startIndex = html.indexOf(startTag)
  if (startIndex === -1) return null

  const contentStart = startIndex + startTag.length
  const endIndex = html.indexOf(endTag, contentStart)
  if (endIndex === -1) return null

  return html.substring(contentStart, endIndex).trim()
}

/**
 * Extract text from HTML by looking for patterns commonly used in NFCe pages
 */
export function extractReceiptInfo(html: string): {
  estabelecimento?: string
  cnpj?: string
  endereco?: string
  valorTotal?: number
  dataEmissao?: Date
  numeroNota?: string
  itens?: Array<{
    descricao: string
    quantidade: number
    valorUnitario: number
    valorTotal: number
  }>
} {
  const result: any = {}

  try {
    // Common patterns for NFCe data extraction
    // These patterns are based on typical government site HTML structures

    // Extract establishment name (common patterns)
    const estabelecimentoPatterns = [
      /<strong[^>]*>([^<]*(?:LTDA|S\.A\.|EIRELI|ME)[^<]*)<\/strong>/i,
      /<b[^>]*>([^<]*(?:LTDA|S\.A\.|EIRELI|ME)[^<]*)<\/b>/i,
      /Razão Social[^:]*:([^<\n]+)/i,
    ]

    for (const pattern of estabelecimentoPatterns) {
      const match = html.match(pattern)
      if (match) {
        result.estabelecimento = match[1].trim()
        break
      }
    }

    // Extract CNPJ
    const cnpjMatch = html.match(/CNPJ[^:]*:?\s*(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})/i)
    if (cnpjMatch) {
      result.cnpj = cnpjMatch[1].replace(/[^\d]/g, '')
    }

    // Extract total value
    const valorPatterns = [
      /Valor Total[^:]*:?\s*R\$\s*([\d.,]+)/i,
      /Total[^:]*:?\s*R\$\s*([\d.,]+)/i,
      /TOTAL.*R\$\s*([\d.,]+)/i,
    ]

    for (const pattern of valorPatterns) {
      const match = html.match(pattern)
      if (match) {
        const valorStr = match[1].replace(/[^\d,]/g, '').replace(',', '.')
        result.valorTotal = parseFloat(valorStr)
        break
      }
    }

    // Extract emission date
    const dataPatterns = [
      /Data[^:]*:?\s*(\d{2}\/\d{2}\/\d{4})/i,
      /Emissão[^:]*:?\s*(\d{2}\/\d{2}\/\d{4})/i,
      /(\d{2}\/\d{2}\/\d{4})/,
    ]

    for (const pattern of dataPatterns) {
      const match = html.match(pattern)
      if (match) {
        const [day, month, year] = match[1].split('/')
        result.dataEmissao = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        break
      }
    }

    // Extract document number
    const numeroMatch = html.match(/N[úu]mero[^:]*:?\s*(\d+)/i)
    if (numeroMatch) {
      result.numeroNota = numeroMatch[1]
    }

    // Extract address (simplified)
    const enderecoPatterns = [
      /Endere[çc]o[^:]*:?\s*([^<\n]+)/i,
      /<.*>([^<]*(?:Rua|Av|Avenida|Alameda)[^<]*)<.*/i,
    ]

    for (const pattern of enderecoPatterns) {
      const match = html.match(pattern)
      if (match) {
        result.endereco = match[1].trim()
        break
      }
    }

    return result
  } catch (error) {
    console.error('Error parsing NFCe HTML:', error)
    return {}
  }
}

/**
 * Check if HTML contains NFCe receipt data
 */
export function isValidNFCeResponse(html: string): boolean {
  // Check for common indicators that the page loaded successfully
  const indicators = [
    /nota fiscal/i,
    /cupom fiscal/i,
    /nfce/i,
    /fazenda/i,
    /consulta.*p[uú]blica/i,
  ]

  return indicators.some(pattern => pattern.test(html))
}

/**
 * Check for error messages in HTML
 */
export function extractErrorMessage(html: string): string | null {
  const errorPatterns = [
    /erro[^:]*:?\s*([^<\n]+)/i,
    /n[aã]o encontrad[oa][^<\n]*/i,
    /inv[aá]lid[oa][^<\n]*/i,
    /indispon[ií]vel[^<\n]*/i,
  ]

  for (const pattern of errorPatterns) {
    const match = html.match(pattern)
    if (match) {
      return match[0].trim()
    }
  }

  return null
}