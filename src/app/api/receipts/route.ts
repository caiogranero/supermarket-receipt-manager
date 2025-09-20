import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { ReceiptPostRequest } from '@/types/receipt';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
//   scrapedAt: z.string(),
});

const ScrapedReceiptSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: ReceiptDataSchema,
//   scrapedAt: z.string(),
});

const ReceiptPostRequestSchema = z.object({
    nfceUrl: z.string().url(),
    receiptData: ScrapedReceiptSchema,
    // scrapedAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || !user.id) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be signed in to perform this action',
        },
        { status: 401 }
      );
    }

    const body: ReceiptPostRequest = await req.json();
    const parsedReceipt = ReceiptPostRequestSchema.safeParse(body);

    if (!parsedReceipt.success) {
        console.log('Validation errors:', parsedReceipt.error.issues);
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

    const { nfceUrl, receiptData } = parsedReceipt.data;
    const { estabelecimento, itens, pagamentos, totais, metadata, consumidor, tributos } = receiptData.data;

    const savedReceipt = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const establishment = await tx.establishment.upsert({
        where: { cnpj: estabelecimento.cnpj },
        update: {
          name: estabelecimento.razaoSocial,
          street: estabelecimento.endereco.logradouro,
          number: estabelecimento.endereco.numero,
          neighborhood: estabelecimento.endereco.bairro,
          city: estabelecimento.endereco.municipio,
          state: estabelecimento.endereco.uf,
        },
        create: {
          name: estabelecimento.razaoSocial,
          cnpj: estabelecimento.cnpj,
          street: estabelecimento.endereco.logradouro,
          number: estabelecimento.endereco.numero,
          neighborhood: estabelecimento.endereco.bairro,
          city: estabelecimento.endereco.municipio,
          state: estabelecimento.endereco.uf,
        },
      });

      const receipt = await tx.receipt.create({
        data: {
          nfceUrl,
          scrapedAt: new Date().toISOString(),
          itemQuantity: totais.quantidadeItens,
          productsValue: totais.valorProdutos,
          discountValue: totais.valorDesconto,
          totalValue: totais.valorTotal,
          paidValue: totais.valorPago,
          emissionDate: new Date(metadata.dataEmissao),
          accessKey: metadata.chaveAcesso,
          protocol: metadata.protocolo,
          consumerDocument: consumidor?.documento,
          totalTaxesValue: tributos.valorTotalTributos,
          userId: user.id,
          establishmentId: establishment.id,
        },
      });

      await tx.receiptItem.createMany({
        data: itens.map(item => ({
          receiptId: receipt.id,
          itemNumber: item.numero,
          code: item.codigo,
          description: item.descricao,
          unit: item.unidadeComercial,
          quantity: item.quantidade,
          unitPrice: item.valorUnitario,
          totalPrice: item.valorTotal,
        })),
      });

      await tx.payment.createMany({
        data: pagamentos.map(payment => ({
          receiptId: receipt.id,
          method: payment.forma,
          amount: payment.valor,
          type: payment.tipo,
        })),
      });

      return receipt;
    });

    return NextResponse.json({ message: 'Receipt saved successfully', receiptId: savedReceipt.id }, { status: 201 });

  } catch (error) {
    console.error('Error processing receipt:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const target = (error.meta?.target as string[]) || [];
            if (target.includes('accessKey')) {
                return NextResponse.json({ error: 'This receipt has already been saved.' }, { status: 409 });
            }
        }
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




