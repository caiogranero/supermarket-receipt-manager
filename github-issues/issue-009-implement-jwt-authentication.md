# Issue #9: Implement NextAuth.js Authentication System

**Status:** OPEN
**Created:** 2025-09-14T17:25:30Z
**Updated:** 2025-09-14T17:25:30Z
**Author:** caiogranero
**Comments:** 0

## Labels
- phase-1
- backend
- feature
- priority-high
- size-l

## Description
Implement NextAuth.js authentication system for the SuperMarket Receipt Manager to secure pages and API routes with session management.

## Acceptance Criteria
- [ ] NextAuth.js configured with credentials provider
- [ ] User registration API route (`POST /api/auth/register`)
- [ ] Login/logout functionality with NextAuth.js
- [ ] Session management with JWT tokens
- [ ] Protected pages require authentication
- [ ] Password hashing implemented securely (bcryptjs)
- [ ] Session persistence and expiration configured
- [ ] TypeScript types configured for NextAuth.js

## Technical Requirements
- **Authentication**: NextAuth.js v4+ with credentials provider
- **Security**: bcryptjs for password hashing
- **Session**: JWT-based session strategy
- **Database**: Prisma adapter for session storage
- **Middleware**: Next.js middleware for route protection
- **Validation**: Zod for input validation

## API Routes & Configuration
```typescript
// app/api/auth/[...nextauth]/route.ts - NextAuth.js configuration
// app/api/auth/register/route.ts - User registration

// Registration endpoint
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword"
}

// NextAuth.js handles:
// POST /api/auth/signin - Login
// POST /api/auth/signout - Logout
// GET /api/auth/session - Get current session
```

## Authentication Flow
```typescript
// Login response (handled by NextAuth.js)
{
  "user": {
    "id": "cuid",
    "email": "user@example.com"
  },
  "expires": "2024-01-01T00:00:00.000Z"
}
```

## Security Considerations
- Password minimum 8 characters with validation
- NEXTAUTH_SECRET in environment variables
- Session expires in 30 days (configurable)
- Password hashed with bcryptjs (12+ rounds)
- CSRF protection built into NextAuth.js
- Secure cookies in production

## Protected Routes
- Use Next.js middleware to protect pages
- API routes protected with getServerSession
- Redirect unauthenticated users to login

## Validation
- [ ] User can register with valid email/password
- [ ] User can login with NextAuth.js signin
- [ ] Invalid credentials show appropriate error
- [ ] Protected pages redirect to login when unauthenticated
- [ ] Session persists across browser sessions
- [ ] Password properly hashed in database
- [ ] Logout clears session properly

## Dependencies
- Issue #7: Next.js project structure
- Issue #8: Prisma database with User model

## Definition of Done
- [ ] NextAuth.js configuration complete and working
- [ ] Registration endpoint functional
- [ ] Login/logout flow working
- [ ] Session management implemented
- [ ] Protected routes configured
- [ ] Password security implemented
- [ ] TypeScript types configured
- [ ] Ready for frontend integration