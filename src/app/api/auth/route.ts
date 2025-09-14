import { NextRequest, NextResponse } from 'next/server'

// Placeholder authentication endpoints
// TODO: Implement JWT authentication system

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Authentication endpoints placeholder',
      available: [
        'POST /api/auth/login',
        'POST /api/auth/register',
        'POST /api/auth/logout',
        'GET /api/auth/me',
      ],
      status: 'not_implemented',
    },
    { status: 200 }
  )
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url)

  return NextResponse.json(
    {
      message: `${pathname} endpoint not yet implemented`,
      todo: 'Implement JWT-based authentication system',
      expected_body: {
        login: { email: 'string', password: 'string' },
        register: { email: 'string', password: 'string', name: 'string' },
      },
    },
    { status: 501 }
  )
}