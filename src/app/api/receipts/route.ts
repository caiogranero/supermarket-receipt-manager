import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { ReceiptPostRequest } from '@/types/receipt';

const EnderecoSchema = z.object({
  logradouro: z.string(),
  numero: z.string(),
  bairro: z.string(),
  municipio: z.string(),
  uf: z.string(),
});

const EstabelecimentoSchema = z.object({
  razaoSocial: z.string(),
  cnpj: z.string(),
  endereco: EnderecoSchema,
});

const ItemSchema = z.object({
  numero: z.number(),
  codigo: z.string(),
  descricao: z.string(),
  unidadeComercial: z.string(),
  quantidade: z.number(),
  valorUnitario: z.number(),
  valorTotal: z.number(),
});

const PagamentoSchema = z.object({
  forma: z.string(),
  valor: z.number(),
  tipo: z.string(),
});

const TotaisSchema = z.object({
  quantidadeItens: z.number(),
  valorProdutos: z.number(),
  valorDesconto: z.number(),
  valorTotal: z.number(),
  valorPago: z.number(),
});

const MetadataSchema = z.object({
  numero: z.string(),
  serie: z.string(),
  dataEmissao: z.string(),
  chaveAcesso: z.string(),
  protocolo: z.string(),
  tipoEmissao: z.string(),
  tipoAmbiente: z.string(),
  versaoXml: z.string(),
  versaoXslt: z.string(),
  qrCode: z.string(),
});

const ConsumidorSchema = z.object({
  documento: z.string(),
  tipoDocumento: z.string(),
}).optional();

const TributosSchema = z.object({
  valorTotalTributos: z.number(),
  fonte: z.string(),
});

const ReceiptDataSchema = z.object({
  estabelecimento: EstabelecimentoSchema,
  itens: z.array(ItemSchema),
  pagamentos: z.array(PagamentoSchema),
  totais: TotaisSchema,
  metadata: MetadataSchema,
  consumidor: ConsumidorSchema,
  tributos: TributosSchema,
  scrapedAt: z.string(),
});

const ScrapedReceiptSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ReceiptDataSchema,
  scrapedAt: z.string(),
});

const ReceiptPostRequestSchema = z.object({
    nfceUrl: z.string().url(),
    receiptData: ScrapedReceiptSchema,
    scrapedAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be signed in to perform this action',
        },
        { status: 401 }
      );
    }

    const body: ReceiptPostRequest = await req.json();
    console.log('Received receipt data:', JSON.stringify(body, null, 2));

    // Validate the request body against the schema
    const parsedReceipt = ReceiptPostRequestSchema.safeParse(body);

    if (!parsedReceipt.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: parsedReceipt.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // For now, we just log the data and return a success message.
    // In the future, this is where we would save the data to the database.
    const { nfceUrl, receiptData } = parsedReceipt.data;

    return NextResponse.json({ message: 'Receipt received successfully', nfceUrl, receiptData: receiptData.data.estabelecimento }, { status: 200 });
  } catch (error) {
    console.error('Error processing receipt:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET method for testing endpoint availability
export async function GET() {
  return NextResponse.json(
    {
      service: 'Receipts API',
      status: 'available',
      description: 'POST receipt data to be processed and stored.',
      example: {
        method: 'POST',
        body: {
          nfceUrl: 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=...',
          receiptData: { /* ... receipt data object ... */ },
          scrapedAt: new Date().toISOString(),
        }
      }
    },
    { status: 200 }
  );
}


