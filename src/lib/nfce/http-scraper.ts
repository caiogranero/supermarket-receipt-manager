import { parseNFCeUrl } from './url-parser'
import { NFCeDOMParser } from './dom-parser'
import {
  NFCeReceiptData,
  NFCeScrapingResult,
  NFCeError,
  NFCeErrorType,
  NFCeParserOptions
} from './types'

// Re-export types for backward compatibility
export type { NFCeReceiptData, NFCeScrapingResult } from './types'

/**
 * Enhanced NFCe HTTP Scraper with DOM parsing
 */
export class NFCeHttpScraper {
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  private readonly timeout = 10000
  private readonly parser: NFCeDOMParser
  private readonly options: NFCeParserOptions

  constructor(options: NFCeParserOptions = {}) {
    this.options = {
      strictMode: false,
      retryOnError: true,
      maxRetries: 3,
      ...options
    }
    this.parser = new NFCeDOMParser(this.options)
  }

  /**
   * Scrape NFCe data from URL with retry logic
   */
  async scrapeNFCe(url: string): Promise<NFCeScrapingResult> {
    const startTime = Date.now()
    let lastError: Error | null = null
    let attempts = 0

    // Retry logic
    while (attempts < (this.options.maxRetries || 1)) {
      attempts++

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

        // Make HTTP request with better headers
        const response = await this.fetchWithRetry(url)
        const html = await response.text()

        // Parse HTML using DOM parser
        const receiptData = await this.parseReceiptData(html, url)

        const parseTime = Date.now() - startTime

        return {
          success: true,
          data: receiptData,
          scrapedAt: new Date(),
          parseTime,
        }

      } catch (error) {
        lastError = error as Error

        // If it's a network error and we have retries left, continue
        if (error instanceof NFCeError &&
            error.type === NFCeErrorType.NETWORK_ERROR &&
            attempts < (this.options.maxRetries || 1)) {
          await this.delay(1000 * attempts) // Exponential backoff
          continue
        }

        // For other errors or last attempt, break
        break
      }
    }

    // Return error result
    return {
      success: false,
      data: null,
      error: lastError?.message || 'NFCe service not available. Try again later.',
      errorDetails: lastError instanceof NFCeError && lastError.details ?
        [{ message: lastError.message, ...lastError.details }] : undefined,
      scrapedAt: new Date(),
      parseTime: Date.now() - startTime,
    }
  }

  /**
   * Fetch with retry and better error handling
   */
  private async fetchWithRetry(url: string): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        throw new NFCeError(
          NFCeErrorType.NETWORK_ERROR,
          `NFCe site unavailable (HTTP ${response.status}). Try again later.`,
          { statusCode: response.status }
        )
      }

      return response
    } catch (error) {
      if (error instanceof NFCeError) {
        throw error
      }

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NFCeError(
          NFCeErrorType.TIMEOUT_ERROR,
          'Request timed out. The NFCe service is taking too long to respond.'
        )
      }

      // Handle network errors
      throw new NFCeError(
        NFCeErrorType.NETWORK_ERROR,
        'Failed to connect to NFCe service. Check your internet connection.',
        error
      )
    }
  }

  /**
   * Parse receipt data from HTML
   */
  private async parseReceiptData(html: string, originalUrl: string): Promise<NFCeReceiptData> {
    try {
      // Use the new DOM parser
      const data = this.parser.parseHTML(html)

      // Add QR code URL to metadata
      if (data.metadata) {
        data.metadata.qrCode = originalUrl
      }

      return data
    } catch (error) {
      if (error instanceof NFCeError) {
        throw error
      }

      throw new NFCeError(
        NFCeErrorType.PARSING_ERROR,
        'Failed to parse NFCe receipt data',
        error
      )
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}