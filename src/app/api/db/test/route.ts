import { NextResponse } from 'next/server'
import { prisma, testDatabaseConnection } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'ERROR',
          message: 'Database connection failed',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Test user operations (if database is connected)
    try {
      // Count users
      const userCount = await prisma.user.count()

      return NextResponse.json({
        status: 'OK',
        database: {
          connected: true,
          provider: 'postgresql',
          userCount,
        },
        schema: {
          models: ['User'],
          migrations: 'Ready for first migration',
        },
        timestamp: new Date().toISOString(),
      })
    } catch (dbError) {
      // If database operations fail (e.g., no migrations yet)
      return NextResponse.json({
        status: 'PARTIAL',
        database: {
          connected: true,
          provider: 'postgresql',
          note: 'Connection successful but no migrations applied yet',
        },
        nextSteps: [
          'Run: npm run db:migrate',
          'Or set up actual PostgreSQL database connection',
        ],
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}