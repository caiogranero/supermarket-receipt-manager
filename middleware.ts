import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Allow access to public routes
    if (
      pathname.startsWith('/auth') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname === '/'
    ) {
      return NextResponse.next()
    }

    // Redirect to signin if no token for protected routes
    if (!token && (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/receipts') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/api/receipts') ||
      pathname.startsWith('/api/user')
    )) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow public routes
        if (
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico') ||
          pathname === '/'
        ) {
          return true
        }

        // Require authentication for protected routes
        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/receipts') ||
          pathname.startsWith('/profile') ||
          pathname.startsWith('/api/receipts') ||
          pathname.startsWith('/api/user')
        ) {
          return !!token
        }

        // Default: allow
        return true
      },
    },
  }
)

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (you can add more as needed)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}