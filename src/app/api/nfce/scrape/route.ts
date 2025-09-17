import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { NFCeHttpScraper } from '@/lib/nfce/http-scraper'
import { isNFCeUrl } from '@/lib/nfce/url-parser'

// Request validation schema
const ScrapeRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
})

// Initialize scraper instance
const scraper = new NFCeHttpScraper()

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be signed in to scrape NFCe receipts',
        },
        { status: 401 }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validation = ScrapeRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'URL is required and must be valid',
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const { url } = validation.data

    // Validate NFCe URL format
    if (!isNFCeUrl(url)) {
      return NextResponse.json(
        {
          error: 'Invalid NFCe URL',
          message: 'URL must be from NFCe São Paulo government site',
        },
        { status: 400 }
      )
    }

    // Scrape NFCe data
    const result = await scraper.scrapeNFCe(url)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Scraping failed',
          message: result.error || 'Unable to extract receipt data',
          scrapedAt: result.scrapedAt,
        },
        { status: 422 }
      )
    }

    // Return successful result
    return NextResponse.json(
      {
        success: true,
        message: 'Receipt data extracted successfully',
        data: result.data,
        scrapedAt: result.scrapedAt,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('NFCe scraping error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing the receipt',
      },
      { status: 500 }
    )
  }
}

// GET method for testing endpoint availability
export async function GET() {
  return NextResponse.json(
    {
      service: 'NFCe Scraping API',
      status: 'available',
      description: 'POST a URL to extract NFCe receipt data',
      example: {
        method: 'POST',
        body: {
          url: 'https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=...'
        }
      }
    },
    { status: 200 }
  )
}