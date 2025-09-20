/**
 * DOM-based NFCe HTML Parser
 * Uses node-html-parser for robust HTML parsing
 */

import { parse, HTMLElement } from 'node-html-parser'
import {
  NFCeReceiptData,
  NFCeEstablishment,
  NFCeItem,
  NFCePayment,
  NFCeTotals,
  NFCeMetadata,
  NFCeConsumer,
  NFCeTaxes,
  NFCeError,
  NFCeErrorType,
  NFCeParserOptions,
} from './types'
import { NFCeSelectors, NFCePatterns, SelectorHelpers } from './selectors'

/**
 * Main NFCe DOM Parser class
 */
export class NFCeDOMParser {
  private root: HTMLElement | null = null
  private options: NFCeParserOptions

  constructor(options: NFCeParserOptions = {}) {
    this.options = {
      strictMode: false,
      includeRawHtml: false,
      timeout: 10000,
      retryOnError: false,
      maxRetries: 3,
      ...options
    }
  }

  /**
   * Parse NFCe HTML and extract all data
   */
  public parseHTML(html: string): NFCeReceiptData {
    const startTime = Date.now()

    try {
      // Parse HTML into DOM
      this.root = parse(html, {
        lowerCaseTagName: false,
        comment: false,
        blockTextElements: {
          script: false,
          noscript: false,
          style: false,
        }
      })

      if (!this.root) {
        throw new NFCeError(
          NFCeErrorType.PARSING_ERROR,
          'Failed to parse HTML document'
        )
      }

      // Check if it's a valid NFCe page
      this.validateNFCePage()

      // Extract all sections
      const estabelecimento = this.parseEstablishment()
      const itens = this.parseItems()
      const totais = this.parseTotals()
      const pagamentos = this.parsePayments()
      const metadata = this.parseMetadata()
      const consumidor = this.parseConsumer()
      const tributos = this.parseTaxes()

      const parseTime = Date.now() - startTime

      return {
        estabelecimento,
        itens,
        pagamentos,
        totais,
        metadata,
        consumidor,
        tributos,
        scrapedAt: new Date()
      }
    } catch (error) {
      if (error instanceof NFCeError) {
        throw error
      }
      throw new NFCeError(
        NFCeErrorType.PARSING_ERROR,
        `Failed to parse NFCe HTML: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      )
    }
  }

  /**
   * Validate that this is a valid NFCe page
   */
  private validateNFCePage(): void {
    if (!this.root) return

    // Check for NFCe indicators
    const hasNFCeTitle = this.root.querySelector('h1.tit')?.text?.includes('NFC')
    const hasItemsTable = !!this.root.querySelector(NFCeSelectors.items.table)
    const hasTotals = !!this.root.querySelector(NFCeSelectors.totals.container)

    if (!hasNFCeTitle && !hasItemsTable) {
      // Check for error indicators
      const errorDiv = this.root.querySelector('#erro')
      if (errorDiv) {
        throw new NFCeError(
          NFCeErrorType.NOT_FOUND,
          'NFCe not found or has been canceled/denied'
        )
      }
      throw new NFCeError(
        NFCeErrorType.VALIDATION_ERROR,
        'This does not appear to be a valid NFCe page'
      )
    }
  }

  /**
   * Parse establishment/store information
   */
  private parseEstablishment(): NFCeEstablishment {
    if (!this.root) {
      throw new NFCeError(NFCeErrorType.PARSING_ERROR, 'No DOM root available')
    }

    // Get store name
    const nameElement = this.root.querySelector(NFCeSelectors.establishment.name)
    const razaoSocial = nameElement?.text?.trim() || ''

    // Get CNPJ and address from text divs
    const textDivs = this.root.querySelectorAll('div.text')
    let cnpj = ''
    let endereco = {
      logradouro: '',
      numero: '',
      bairro: '',
      municipio: '',
      uf: ''
    }

    for (const div of textDivs) {
      const text = div.text.trim()

      // Check for CNPJ
      const cnpjMatch = text.match(NFCePatterns.cnpj)
      if (cnpjMatch) {
        cnpj = cnpjMatch[1].replace(/[^\d]/g, '')
      }

      // Check for address (usually has comma-separated values)
      if (text.includes(',') && !text.includes('CNPJ')) {
        const parts = text.split(',').map(p => p.trim())
        if (parts.length >= 3) {
          endereco.logradouro = parts[0]
          endereco.numero = parts[1] || ''
          endereco.bairro = parts[3] || ''
          endereco.municipio = parts[4] || ''
          endereco.uf = parts[5] || ''
        }
      }
    }

    if (!razaoSocial && this.options.strictMode) {
      throw new NFCeError(
        NFCeErrorType.VALIDATION_ERROR,
        'Establishment name not found'
      )
    }

    return {
      razaoSocial,
      cnpj,
      endereco
    }
  }

  /**
   * Parse items/products table
   */
  private parseItems(): NFCeItem[] {
    if (!this.root) return []

    const items: NFCeItem[] = []
    const itemRows = this.root.querySelectorAll(NFCeSelectors.items.rows)

    for (const row of itemRows) {
      try {
        // Get item number from row ID
        const rowId = row.getAttribute('id') || ''
        const itemNumber = parseInt(rowId.replace('Item + ', '')) || items.length + 1

        // Product name
        const descricao = row.querySelector(NFCeSelectors.items.productName)?.text?.trim() || ''

        // Product code - it's in the innerHTML, not just text
        const codeElement = row.querySelector(NFCeSelectors.items.productCode)
        const codeText = codeElement ? codeElement.innerHTML || codeElement.text : ''
        const codeMatch = codeText.match(/Código:\s*(\d+)/i)
        const codigo = codeMatch ? codeMatch[1] : ''

        // Quantity
        const qtyElement = row.querySelector(NFCeSelectors.items.quantity)?.text || ''
        const qtyMatch = qtyElement.match(NFCePatterns.quantity)
        const quantidade = qtyMatch ? SelectorHelpers.parseQuantity(qtyMatch[1]) : 0

        // Unit
        const unitElement = row.querySelector(NFCeSelectors.items.unit)?.text || ''
        const unitMatch = unitElement.match(NFCePatterns.unit)
        const unidadeComercial = unitMatch ? unitMatch[1] : 'UN'

        // Unit price
        const priceElement = row.querySelector(NFCeSelectors.items.unitPrice)?.text || ''
        const priceMatch = priceElement.match(NFCePatterns.unitPrice)
        const valorUnitario = priceMatch ? SelectorHelpers.parseMoney(priceMatch[1]) : 0

        // Total value
        const totalElement = row.querySelector(NFCeSelectors.items.totalValue)?.text || ''
        const valorTotal = SelectorHelpers.parseMoney(totalElement)

        items.push({
          numero: itemNumber,
          codigo,
          descricao,
          unidadeComercial,
          quantidade,
          valorUnitario,
          valorTotal
        })
      } catch (error) {
        console.error('Error parsing item:', error)
        // Continue with next item
      }
    }

    if (items.length === 0 && this.options.strictMode) {
      throw new NFCeError(
        NFCeErrorType.VALIDATION_ERROR,
        'No items found in NFCe'
      )
    }

    return items
  }

  /**
   * Parse totals section
   */
  private parseTotals(): NFCeTotals {
    if (!this.root) {
      return {
        quantidadeItens: 0,
        valorProdutos: 0,
        valorTotal: 0,
        valorPago: 0
      }
    }

    const totalsContainer = this.root.querySelector(NFCeSelectors.totals.container)
    if (!totalsContainer) {
      return {
        quantidadeItens: 0,
        valorProdutos: 0,
        valorTotal: 0,
        valorPago: 0
      }
    }

    // Parse each total line
    const totalLines = totalsContainer.querySelectorAll('div#linhaTotal')
    let quantidadeItens = 0
    let valorProdutos = 0
    let valorDesconto = 0
    let valorTotal = 0
    let valorPago = 0
    let troco = 0

    for (const line of totalLines) {
      const label = line.querySelector('label')?.text?.trim() || ''
      const value = line.querySelector('span.totalNumb')?.text?.trim() || ''

      if (label.includes('Qtd. total de itens')) {
        quantidadeItens = parseInt(value) || 0
      } else if (label.includes('Valor total R$')) {
        valorProdutos = SelectorHelpers.parseMoney(value)
      } else if (label.includes('Descontos')) {
        valorDesconto = SelectorHelpers.parseMoney(value)
      } else if (label.includes('Valor a pagar')) {
        valorTotal = SelectorHelpers.parseMoney(value)
      } else if (label.includes('Troco')) {
        const trocoValue = value === 'NaN' ? 0 : SelectorHelpers.parseMoney(value)
        troco = trocoValue
      }
    }

    // Get payment value (valor pago)
    const paymentLines = totalsContainer.querySelectorAll('div#linhaTotal:has(label.tx)')
    for (const line of paymentLines) {
      const label = line.querySelector('label.tx')?.text?.trim() || ''
      const value = line.querySelector('span.totalNumb')?.text?.trim() || ''
      if (!label.includes('Troco')) {
        valorPago += SelectorHelpers.parseMoney(value)
      }
    }

    return {
      quantidadeItens,
      valorProdutos,
      valorDesconto: valorDesconto > 0 ? valorDesconto : undefined,
      valorTotal,
      valorPago,
      troco: troco > 0 ? troco : undefined
    }
  }

  /**
   * Parse payment methods
   */
  private parsePayments(): NFCePayment[] {
    if (!this.root) return []

    const payments: NFCePayment[] = []
    const totalsContainer = this.root.querySelector(NFCeSelectors.totals.container)

    if (!totalsContainer) return payments

    // Find payment lines (they have label.tx)
    const paymentLines = totalsContainer.querySelectorAll('div#linhaTotal:has(label.tx)')

    for (const line of paymentLines) {
      const label = line.querySelector('label.tx')?.text?.trim() || ''
      const value = line.querySelector('span.totalNumb')?.text?.trim() || ''

      // Skip troco line
      if (label.includes('Troco')) continue

      const paymentValue = SelectorHelpers.parseMoney(value)
      if (paymentValue > 0) {
        // Determine payment type
        let tipo: NFCePayment['tipo'] = 'outros'
        const labelLower = label.toLowerCase()
        if (labelLower.includes('dinheiro')) {
          tipo = 'dinheiro'
        } else if (labelLower.includes('crédito')) {
          tipo = 'cartao_credito'
        } else if (labelLower.includes('débito')) {
          tipo = 'cartao_debito'
        } else if (labelLower.includes('pix')) {
          tipo = 'pix'
        }

        payments.push({
          forma: label,
          valor: paymentValue,
          tipo
        })
      }
    }

    return payments
  }

  /**
   * Parse invoice metadata
   */
  private parseMetadata(): NFCeMetadata {
    if (!this.root) {
      throw new NFCeError(NFCeErrorType.PARSING_ERROR, 'No DOM root available')
    }

    // Get general info section
    const infoSection = this.root.querySelector('div#infos')

    // Find the specific list item with invoice details
    const listItems = infoSection?.querySelectorAll('ul[data-role="listview"] li') || []
    let generalInfo = ''

    for (const item of listItems) {
      const itemText = item.text || ''
      // Look for the item that contains invoice information
      if (itemText.includes('Número:') || itemText.includes('Série:') || itemText.includes('Emissão:')) {
        generalInfo = item.text
        break
      }
    }

    // Parse invoice number, series, emission
    const numeroMatch = generalInfo.match(NFCePatterns.invoiceNumber)
    const serieMatch = generalInfo.match(NFCePatterns.series)
    const emissionMatch = generalInfo.match(NFCePatterns.emission)
    const protocolMatch = generalInfo.match(NFCePatterns.protocol)

    const numero = numeroMatch ? numeroMatch[1] : ''
    const serie = serieMatch ? serieMatch[1] : ''
    const dataEmissao = emissionMatch ? SelectorHelpers.parseDate(emissionMatch[1]) : new Date()

    // Get access key
    const accessKeyElement = this.root.querySelector(NFCeSelectors.info.accessKeyContainer)
    const chaveAcesso = accessKeyElement ?
      SelectorHelpers.cleanAccessKey(accessKeyElement.text) : ''

    // Get emission type
    const emissionTypeElement = this.root.querySelector('div#infos strong')
    const emissionTypeText = emissionTypeElement?.text?.trim() || 'EMISSÃO NORMAL'
    let tipoEmissao: NFCeMetadata['tipoEmissao'] = 'normal'
    if (emissionTypeText.includes('CONTINGÊNCIA')) {
      tipoEmissao = 'contingencia'
    } else if (emissionTypeText.includes('OFFLINE')) {
      tipoEmissao = 'offline'
    }

    // Determine environment
    const tipoAmbiente = generalInfo.includes('Ambiente de Produção') ? 'producao' : 'homologacao'

    // Get XML versions
    const versaoXmlMatch = generalInfo.match(/Versão XML:\s*([\d.]+)/)
    const versaoXsltMatch = generalInfo.match(/Versão XSLT:\s*([\d.]+)/)

    return {
      numero,
      serie,
      dataEmissao: dataEmissao || new Date(),
      chaveAcesso,
      protocolo: protocolMatch ? protocolMatch[1].trim() : undefined,
      tipoEmissao,
      tipoAmbiente,
      versaoXml: versaoXmlMatch ? versaoXmlMatch[1] : undefined,
      versaoXslt: versaoXsltMatch ? versaoXsltMatch[1] : undefined,
    }
  }

  /**
   * Parse consumer information
   */
  private parseConsumer(): NFCeConsumer | undefined {
    if (!this.root) return undefined

    const consumerSection = this.root.querySelector('div[data-role="collapsible"]:has(h4:contains("Consumidor"))')
    if (!consumerSection) return undefined

    const listItems = consumerSection.querySelectorAll('ul li')
    let documento = ''
    let nome = ''

    for (const item of listItems) {
      const text = item.text.trim()

      // Check for CPF
      const cpfMatch = text.match(NFCePatterns.cpf)
      if (cpfMatch) {
        documento = cpfMatch[1].replace(/[^\d]/g, '')
      }

      // Check for name (after Nome: label)
      if (text.includes('Nome:')) {
        const nameMatch = text.match(/Nome:\s*(.+)/)
        if (nameMatch) {
          nome = nameMatch[1].trim()
        }
      }
    }

    if (!documento) return undefined

    return {
      documento,
      tipoDocumento: documento.length === 11 ? 'cpf' : 'cnpj',
      nome: nome || undefined
    }
  }

  /**
   * Parse tax information
   */
  private parseTaxes(): NFCeTaxes | undefined {
    if (!this.root) return undefined

    const totalsContainer = this.root.querySelector(NFCeSelectors.totals.container)
    if (!totalsContainer) return undefined

    // Look for tax information line
    const taxLine = totalsContainer.querySelector('div#linhaTotal.spcTop span.totalNumb.txtObs')
    if (!taxLine) return undefined

    const valorTotalTributos = SelectorHelpers.parseMoney(taxLine.text)

    if (valorTotalTributos === 0) return undefined

    return {
      valorTotalTributos,
      fonte: 'Lei Federal 12.741/2012'
    }
  }
}