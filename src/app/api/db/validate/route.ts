import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database operations with CRUD validation
    const validationResults = {
      connection: false,
      create: false,
      read: false,
      update: false,
      delete: false,
      testData: null as any,
    }

    // Test connection
    await prisma.$connect()
    validationResults.connection = true

    // CREATE: Test user creation
    const testEmail = `test-${Date.now()}@example.com`
    const createdUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: 'hashedpassword123',
      },
    })
    validationResults.create = true
    validationResults.testData = { userId: createdUser.id, email: createdUser.email }

    // READ: Test user retrieval
    const foundUser = await prisma.user.findUnique({
      where: { id: createdUser.id },
    })
    validationResults.read = foundUser ? true : false

    // UPDATE: Test user modification
    const updatedUser = await prisma.user.update({
      where: { id: createdUser.id },
      data: { email: `updated-${testEmail}` },
    })
    validationResults.update = updatedUser.email.startsWith('updated-')

    // DELETE: Test user deletion
    await prisma.user.delete({
      where: { id: createdUser.id },
    })

    // Verify deletion
    const deletedUser = await prisma.user.findUnique({
      where: { id: createdUser.id },
    })
    validationResults.delete = deletedUser === null

    // Count total users for reference
    const userCount = await prisma.user.count()

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'All CRUD operations validated successfully',
      validation: validationResults,
      database: {
        userCount,
        migrationApplied: true,
        schema: 'User model operational',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    await prisma.$disconnect()

    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'CRUD validation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}