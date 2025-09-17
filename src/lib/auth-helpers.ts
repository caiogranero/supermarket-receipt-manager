import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Auth guard for API routes - checks if user is authenticated
 * @param request NextRequest object
 * @returns Session object if authenticated, null if not
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    return session?.user || null
  } catch (error) {
    console.error('Auth check error:', error)
    return null
  }
}

/**
 * Auth guard wrapper for API routes
 * @param handler The actual API route handler
 * @returns Protected API route handler
 */
export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required to access this resource',
        },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

/**
 * Check if current session is valid (client-side utility)
 * @param session Session object from useSession hook
 * @returns boolean indicating if session is valid
 */
export function isValidSession(session: any): boolean {
  return !!(session?.user?.id && session?.user?.email)
}

/**
 * Format user object for safe serialization
 * @param user User object from database
 * @returns Sanitized user object
 */
export function formatUserForSession(user: any) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt?.toISOString() || null,
  }
}

/**
 * Error response helper for authentication failures
 * @param message Custom error message
 * @param status HTTP status code (default 401)
 * @returns NextResponse with error
 */
export function authErrorResponse(message: string = 'Authentication required', status: number = 401) {
  return NextResponse.json(
    {
      error: 'Authentication Error',
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Validation helper for protected client components
 * @param session Session object
 * @param redirectTo Where to redirect if not authenticated
 * @returns Object with validation result and redirect info
 */
export function validateClientAuth(session: any, redirectTo: string = '/auth/signin') {
  const isAuthenticated = isValidSession(session)

  return {
    isAuthenticated,
    user: isAuthenticated ? session.user : null,
    redirectTo: isAuthenticated ? null : redirectTo,
    loading: session === undefined, // Session is loading
  }
}