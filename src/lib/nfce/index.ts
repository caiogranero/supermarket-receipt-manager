/**
 * NFCe (Nota Fiscal de Consumidor Eletrônica) Processing Library
 *
 * This module provides utilities for parsing and scraping NFCe receipts
 * from São Paulo government websites using HTTP requests.
 */

// URL Parser
export {
  parseNFCeUrl,
  isNFCeUrl,
  buildNFCeUrl,
  extractQRCodeParam,
  type NFCeUrlParams,
  type NFCeUrlParseResult,
} from './url-parser'

// HTTP Scraper
export {
  NFCeHttpScraper,
  type NFCeReceiptData,
  type NFCeScrapingResult,
} from './http-scraper'

// DOM Parser
export {
  NFCeDOMParser,
} from './dom-parser'

// Types
export type {
  NFCeEstablishment,
  NFCeItem,
  NFCePayment,
  NFCeTotals,
  NFCeTaxes,
  NFCeConsumer,
  NFCeMetadata,
  NFCeParserOptions,
  NFCeError,
  NFCeErrorType,
} from './types'

// Selectors and utilities
export {
  NFCeSelectors,
  NFCePatterns,
  SelectorHelpers,
} from './selectors'

// Import for internal usage
import { NFCeHttpScraper } from './http-scraper'

/**
 * Quick utility to scrape an NFCe URL
 */
export async function scrapeNFCeQuick(url: string) {
  const scraper = new NFCeHttpScraper()
  return await scraper.scrapeNFCe(url)
}

/**
 * Constants for NFCe processing
 */
export const NFCE_CONSTANTS = {
  BASE_URL: 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx',
  STATE_CODE: '35', // São Paulo
  DOCUMENT_MODEL: '65', // NFCe model code
  ENVIRONMENTS: {
    PRODUCTION: '1',
    HOMOLOG: '2',
  } as const,
}