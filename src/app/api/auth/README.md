# Authentication API Documentation

## Overview
The SuperMarket Receipt Manager uses NextAuth.js v4 with JWT session strategy for authentication. This provides secure user registration, login, logout, and session management capabilities.

## Configuration
- **Framework**: NextAuth.js v4.24.11
- **Session Strategy**: JWT with 30-day expiration
- **Password Hashing**: bcryptjs with 12 rounds
- **Validation**: Zod for input validation
- **Database**: PostgreSQL with Prisma ORM

## Environment Variables
```bash
NEXTAUTH_SECRET=supersecretkey2024supermarketreceipts
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supermarket_receipts?schema=public"
```

## API Endpoints

### User Registration
**Endpoint**: `POST /api/auth/register`

**Description**: Create a new user account with email and password

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Validation Rules**:
- **Email**: Must be valid email format
- **Password**:
  - Minimum 8 characters
  - Must contain at least one lowercase letter
  - Must contain at least one uppercase letter
  - Must contain at least one number

**Success Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "cmfl66ndz0000w2bo1e1f3zis",
    "email": "user@example.com",
    "createdAt": "2025-09-15T13:38:42.792Z"
  }
}
```

**Error Responses**:

*Validation Error (400)*:
```json
{
  "error": "Validation error",
  "message": "Invalid input data",
  "details": []
}
```

*User Exists (409)*:
```json
{
  "error": "User already exists",
  "message": "A user with this email address already exists"
}
```

*Server Error (500)*:
```json
{
  "error": "Internal server error",
  "message": "An error occurred during registration"
}
```

### User Authentication (NextAuth.js Endpoints)

#### Sign In
**Endpoint**: `POST /api/auth/signin`
**Description**: Authenticate user and create session
**Handler**: NextAuth.js credentials provider

#### Sign Out
**Endpoint**: `POST /api/auth/signout`
**Description**: Terminate user session
**Handler**: NextAuth.js

#### Session
**Endpoint**: `GET /api/auth/session`
**Description**: Get current user session
**Handler**: NextAuth.js

**Success Response**:
```json
{
  "user": {
    "id": "cmfl66ndz0000w2bo1e1f3zis",
    "email": "user@example.com"
  },
  "expires": "2025-10-15T13:38:42.792Z"
}
```

## Security Features

### Password Security
- **Hashing**: bcryptjs with 12 rounds (recommended for 2024)
- **Minimum Requirements**: 8+ characters, mixed case, numbers
- **Storage**: Only hashed passwords stored in database

### Session Security
- **JWT Strategy**: Signed tokens with NEXTAUTH_SECRET
- **Expiration**: 30-day session lifetime
- **CSRF Protection**: Built into NextAuth.js
- **Secure Cookies**: Automatic in production environment

### Route Protection
Middleware configured to protect routes:
- `/dashboard/*` - Dashboard pages
- `/receipts/*` - Receipt management
- `/profile/*` - User profile
- `/api/receipts/*` - Receipt API endpoints
- `/api/user/*` - User API endpoints

## Usage Examples

### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "SecurePass123"}'
```

### Sign In (Browser)
```javascript
import { signIn } from 'next-auth/react'

const handleSignIn = async () => {
  const result = await signIn('credentials', {
    email: 'user@example.com',
    password: 'SecurePass123',
    redirect: false
  })

  if (result?.ok) {
    console.log('Signed in successfully')
  }
}
```

### Get Session (Component)
```javascript
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') return <p>Please sign in</p>

  return <p>Welcome, {session.user.email}!</p>
}
```

### Protected API Route
```javascript
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Protected logic here
}
```

## Error Handling

### Common Error Codes
- **400**: Validation error (invalid input)
- **401**: Unauthorized (no session)
- **409**: Conflict (user already exists)
- **500**: Internal server error

### Debug Mode
Set `NODE_ENV=development` to enable NextAuth.js debug logging.

## Testing
Authentication endpoints tested and verified:
- ✅ User registration with valid credentials
- ✅ Duplicate email detection (409 error)
- ✅ Password validation (weak passwords rejected)
- ✅ Email validation (invalid emails rejected)
- ✅ NextAuth.js signin functionality
- ✅ Session management

## Integration Notes
- Prisma User model includes required fields: id, email, password, createdAt, updatedAt
- Database connection pooling handled by Prisma
- Compatible with PostgreSQL 15+ via Docker
- Ready for production deployment with proper environment variables