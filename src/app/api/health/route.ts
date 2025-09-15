import { NextResponse } from 'next/server'
import { testDatabaseConnection } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const isDatabaseConnected = await testDatabaseConnection()

    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
      api: {
        status: 'operational',
        endpoints: [
          '/api/health',
          '/api/auth (placeholder)',
          '/api/db/test',
        ],
      },
      database: {
        connected: isDatabaseConnected,
        provider: 'postgresql',
        orm: 'prisma',
      },
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}