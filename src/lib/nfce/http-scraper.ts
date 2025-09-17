import { parseNFCeUrl, type NFCeUrlParams } from './url-parser'
import { extractReceiptInfo, isValidNFCeResponse, extractErrorMessage } from './html-parser'

/**
 * NFCe Receipt Data Structure
 */
export interface NFCeReceiptData {
  chaveAcesso: string
  numeroNota: string
  dataEmissao: Date
  valorTotal: number
  estabelecimento: {
    razaoSocial: string
    cnpj: string
    endereco: string
  }
  itens: Array<{
    descricao: string
    quantidade: number
    valorUnitario: number
    valorTotal: number
  }>
  qrCodeUrl: string
}

/**
 * Scraping Result
 */
export interface NFCeScrapingResult {
  success: boolean
  data: NFCeReceiptData | null
  error?: string
  scrapedAt: Date
}

/**
 * Simple NFCe HTTP Scraper
 */
export class NFCeHttpScraper {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  private readonly timeout = 10000

  /**
   * Scrape NFCe data from URL
   */
  async scrapeNFCe(url: string): Promise<NFCeScrapingResult> {
    try {
      // Parse and validate URL
      const urlResult = parseNFCeUrl(url)
      if (!urlResult.isValid) {
        return {
          success: false,
          data: null,
          error: urlResult.error,
          scrapedAt: new Date(),
        }
      }

      // Make HTTP request
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        return {
          success: false,
          data: null,
          error: `NFCe site unavailable (HTTP ${response.status}). Try again later.`,
          scrapedAt: new Date(),
        }
      }

      const html = await response.text()
      const receiptData = this.extractReceiptData(html, url, urlResult.params!)

      return {
        success: true,
        data: receiptData,
        scrapedAt: new Date(),
      }

    } catch (error) {
      return {
        success: false,
        data: null,
        error: `NFCe service not available. Try again later.`,
        scrapedAt: new Date(),
      }
    }
  }

  /**
   * Extract receipt data from HTML using pattern-based parsing
   */
  private extractReceiptData(html: string, originalUrl: string, params: NFCeUrlParams): NFCeReceiptData {
    // Check if HTML contains valid NFCe data
    if (!isValidNFCeResponse(html)) {
      const errorMsg = extractErrorMessage(html)
      throw new Error(errorMsg || 'Invalid NFCe response - receipt not found')
    }

    // Extract data using HTML patterns
    const extracted = extractReceiptInfo(html)

    return {
      chaveAcesso: params.chave,
      numeroNota: extracted.numeroNota || '',
      dataEmissao: extracted.dataEmissao || new Date(),
      valorTotal: extracted.valorTotal || 0,
      estabelecimento: {
        razaoSocial: extracted.estabelecimento || '',
        cnpj: extracted.cnpj || '',
        endereco: extracted.endereco || '',
      },
      itens: extracted.itens || [],
      qrCodeUrl: originalUrl,
    }
  }
}