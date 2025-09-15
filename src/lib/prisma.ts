import { PrismaClient } from '../../generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect()
}