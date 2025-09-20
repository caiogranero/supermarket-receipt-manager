export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
}

export interface Estabelecimento {
  razaoSocial: string;
  cnpj: string;
  endereco: Endereco;
}

export interface Item {
  numero: number;
  codigo: string;
  descricao: string;
  unidadeComercial: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Pagamento {
  forma: string;
  valor: number;
  tipo: string;
}

export interface Totais {
  quantidadeItens: number;
  valorProdutos: number;
  valorDesconto: number;
  valorTotal: number;
  valorPago: number;
}

export interface Metadata {
  numero: string;
  serie: string;
  dataEmissao: string;
  chaveAcesso: string;
  protocolo: string;
  tipoEmissao: string;
  tipoAmbiente: string;
  versaoXml: string;
  versaoXslt: string;
  qrCode: string;
}

export interface Consumidor {
  documento: string;
  tipoDocumento: string;
}

export interface Tributos {
  valorTotalTributos: number;
  fonte: string;
}

export interface ReceiptData {
  estabelecimento: Estabelecimento;
  itens: Item[];
  pagamentos: Pagamento[];
  totais: Totais;
  metadata: Metadata;
  consumidor?: Consumidor;
  tributos: Tributos;
  scrapedAt: string;
}

export interface ScrapedReceipt {
  success: boolean;
  message: string;
  data: ReceiptData;
  scrapedAt: string;
}

export interface ReceiptPostRequest {
    nfceUrl: string;
    receiptData: ScrapedReceipt;
    scrapedAt: string;
}
