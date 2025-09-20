/**
 * CSS Selectors for NFCe HTML parsing
 * Organized by section for easy maintenance
 */

export const NFCeSelectors = {
  /**
   * Establishment/Store Information
   */
  establishment: {
    name: 'div#u20.txtTopo', // Store name
    cnpjContainer: 'div.text', // Contains CNPJ text
    addressContainer: 'div.text', // Contains address text
    // These will need text parsing as they're in the same div
  },

  /**
   * Items Table
   */
  items: {
    table: 'table#tabResult', // Main items table
    rows: 'table#tabResult tr[id^="Item"]', // Item rows
    // Within each row:
    productName: 'span.txtTit', // Product description
    productCode: 'span.RCod', // Product code (inside parentheses)
    quantity: 'span.Rqtd', // Quantity with label
    unit: 'span.RUN', // Unit type with label
    unitPrice: 'span.RvlUnit', // Unit price with label
    totalValue: 'span.valor', // Total value for item
  },

  /**
   * Totals Section
   */
  totals: {
    container: 'div#totalNota',
    // Each total is in a div#linhaTotal with label and span.totalNumb
    itemCount: 'div#linhaTotal:has(label:contains("Qtd. total de itens")) span.totalNumb',
    totalValue: 'div#linhaTotal:has(label:contains("Valor total")) span.totalNumb',
    discount: 'div#linhaTotal:has(label:contains("Descontos")) span.totalNumb',
    totalToPay: 'div#linhaTotal.linhaShade span.totalNumb.txtMax',
    // Payment methods are in div#linhaTotal with label.tx
    paymentMethod: 'div#linhaTotal label.tx',
    paymentValue: 'div#linhaTotal:has(label.tx) span.totalNumb',
    change: 'div#linhaTotal:has(label.tx:contains("Troco")) span.totalNumb',
    // Tax information
    totalTaxes: 'div#linhaTotal.spcTop span.totalNumb.txtObs',
  },

  /**
   * General Information (collapsible sections)
   */
  info: {
    container: 'div#infos',
    // Invoice details section
    generalInfo: 'div[data-role="collapsible"] ul[data-role="listview"] li',
    // Access key section
    accessKeyContainer: 'span.chave',
    consultUrl: 'div[data-role="collapsible"] ul li',
    // Consumer section
    consumerCPF: 'div[data-role="collapsible"]:has(h4:contains("Consumidor")) ul li:has(strong:contains("CPF"))',
    consumerName: 'div[data-role="collapsible"]:has(h4:contains("Consumidor")) ul li:has(strong:contains("Nome"))',
  },

  /**
   * Status indicators
   */
  status: {
    emissionType: 'div#infos strong:first-of-type', // EMISSÃO NORMAL, etc
    canceledImage: 'img#imgInvalido1',
    deniedImage: 'img#imgInvalido2',
    epecIndicator: '#hdfSomenteEPEC',
  },

  /**
   * Footer/Timestamp
   */
  footer: {
    consultTimestamp: 'span.timestampConsulta',
  }
}

/**
 * Regex patterns for extracting data from text
 */
export const NFCePatterns = {
  cnpj: /CNPJ:\s*([\d./-]+)/i,
  cpf: /CPF:\s*([\d.-]+)/i,
  invoiceNumber: /Número:\s*(\d+)/i,
  series: /Série:\s*(\d+)/i,
  emission: /Emissão:\s*([\d/:\s-]+)/i,
  protocol: /Protocolo de Autorização:\s*([\d\s]+)/i,
  productCode: /\(Código:\s*(\d+)\)/,
  quantity: /Qtde\.:\s*([\d,.]+)/,
  unit: /UN:\s*(\w+)/,
  unitPrice: /Vl\.\s*Unit\.:\s*([\d,.]+)/,
  address: {
    // Parse full address from text
    street: /^([^,]+)/,
    number: /,\s*(\d+)/,
    neighborhood: /,\s*([^,]+),\s*([^,]+),\s*([A-Z]{2})$/,
  },
  money: /R?\$?\s*([\d.,]+)/,
  date: /(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/,
  accessKey: /([\d\s]+)/,
}

/**
 * Helper to build selector with contains text
 */
export const containsText = (selector: string, text: string): string => {
  return `${selector}:contains("${text}")`
}

/**
 * Selector validation helpers
 */
export const SelectorHelpers = {
  /**
   * Get text content from element, handling strong tags
   */
  getTextAfterLabel: (element: any, label: string): string | null => {
    const text = element?.text || ''
    const regex = new RegExp(`${label}[:\s]*([^<\n]+)`)
    const match = text.match(regex)
    return match ? match[1].trim() : null
  },

  /**
   * Parse money value from Brazilian format
   */
  parseMoney: (text: string): number => {
    if (!text) return 0
    // Remove R$, spaces, and convert Brazilian format to number
    const cleaned = text
      .replace(/R\$/, '')
      .replace(/\s/g, '')
      .replace(/\./g, '') // Remove thousand separators
      .replace(',', '.') // Convert decimal separator
    return parseFloat(cleaned) || 0
  },

  /**
   * Parse quantity with Brazilian format
   */
  parseQuantity: (text: string): number => {
    if (!text) return 0
    // Handle both integer and decimal quantities
    const cleaned = text
      .replace(/\s/g, '')
      .replace(/\./g, '') // Remove thousand separators
      .replace(',', '.') // Convert decimal separator
    return parseFloat(cleaned) || 0
  },

  /**
   * Parse Brazilian date format
   */
  parseDate: (text: string): Date | null => {
    if (!text) return null
    // Format: DD/MM/YYYY HH:MM:SS
    const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2}):(\d{2}):(\d{2})/)
    if (match) {
      const [_, day, month, year, hour, minute, second] = match
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      )
    }
    return null
  },

  /**
   * Clean access key (remove spaces)
   */
  cleanAccessKey: (text: string): string => {
    return text.replace(/\s/g, '')
  }
}