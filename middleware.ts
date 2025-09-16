import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
    console.log('Middleware executed for:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true if the user is authenticated
        return !!token
      },
    },
  }
)

// Configure which routes require authentication
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/receipts/:path*',
    '/profile/:path*',
    '/api/receipts/:path*',
    '/api/user/:path*',
    // Exclude auth-related routes from protection
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)',
  ],
}