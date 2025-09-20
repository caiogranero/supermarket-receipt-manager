# Database Configuration Documentation

## Overview

The SuperMarket Receipt Manager uses **PostgreSQL** with **Prisma ORM** for data persistence and type-safe database operations.

## Technology Stack

- **Database**: PostgreSQL (Vercel/Neon compatible)
- **ORM**: Prisma 6.16+
- **Type Safety**: Prisma Client with TypeScript
- **Migration Strategy**: Prisma Migrate
- **Connection Management**: Prisma connection pooling

## Database Schema

### Current Models

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcryptjs hashed password
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**Fields:**
- `id`: Primary key using CUID for uniqueness
- `email`: Unique user identifier for authentication
- `password`: Hashed password using bcryptjs
- `createdAt`: Account creation timestamp
- `updatedAt`: Last modification timestamp

## Environment Configuration

### Required Environment Variables

```bash
# Database connection string
POSTGRES_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

### Local Development
- Update `.env.local` with your PostgreSQL connection string
- For Vercel/Neon: Use the connection string from your database provider

### Production
- Set `POSTGRES_URL` in Vercel environment variables
- Enable connection pooling for production workloads

## Database Commands

### Development Workflow

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema to database without migrations (development only)
npm run db:push

# Reset database and apply all migrations
npm run db:reset

# Open Prisma Studio for database GUI
npm run db:studio
```

### Initial Setup

1. **Install dependencies** (already done):
   ```bash
   npm install prisma @prisma/client
   ```

2. **Configure database connection**:
   - Update `POSTGRES_URL` in `.env.local`
   - Ensure PostgreSQL instance is accessible

3. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

4. **Create initial migration**:
   ```bash
   npm run db:migrate
   ```

## Database Client Usage

### Import and Connection

```typescript
import { prisma } from '@/lib/prisma'

// Test connection
import { testDatabaseConnection } from '@/lib/prisma'
const isConnected = await testDatabaseConnection()
```

### Example Operations

```typescript
// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
  },
})

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
})

// Update user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { email: 'newemail@example.com' },
})

// Delete user
await prisma.user.delete({
  where: { id: userId },
})
```

## API Endpoints

### Database Health Check

**GET** `/api/db/test`
- Tests database connection
- Returns schema information
- Validates Prisma client functionality

Response:
```json
{
  "status": "OK",
  "database": {
    "connected": true,
    "provider": "postgresql",
    "userCount": 0
  },
  "schema": {
    "models": ["User"],
    "migrations": "Ready for first migration"
  }
}
```

### Health Check with Database Status

**GET** `/api/health`
- Includes database connection status
- System-wide health monitoring

## Connection Management

### Development
- Single connection instance with global reuse
- Connection logging enabled for debugging
- Automatic disconnection on process termination

### Production
- Connection pooling via Prisma
- Graceful connection handling
- Error recovery and retry logic

## Migration Strategy

### Development Migrations
```bash
# Create migration after schema changes
npm run db:migrate

# Reset and reapply all migrations
npm run db:reset
```

### Production Deployment
- Migrations run automatically on deployment
- Use `prisma migrate deploy` in production
- Always backup database before major migrations

## Security Considerations

### Password Security
- Passwords hashed with bcryptjs (12+ rounds)
- Never store plain text passwords
- Use secure password validation

### Connection Security
- SSL/TLS enabled with `sslmode=require`
- Connection strings in environment variables only
- No database credentials in code

### Data Validation
- Prisma schema validation
- Input sanitization at API level
- Email uniqueness constraints

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify `POSTGRES_URL` format
   - Check database server accessibility
   - Validate SSL/TLS requirements

2. **Migration Errors**
   - Ensure database is accessible
   - Check for schema conflicts
   - Use `npm run db:reset` for clean slate

3. **Type Errors**
   - Run `npm run db:generate` after schema changes
   - Restart TypeScript server
   - Clear Next.js cache with `rm -rf .next`

### Debug Commands
```bash
# Check Prisma client generation
npx prisma generate --schema=prisma/schema.prisma

# Validate schema syntax
npx prisma validate

# View migration status
npx prisma migrate status
```

## Future Enhancements

### Planned Models
- **Receipt**: NFCe receipt data
- **Item**: Individual purchase items
- **Store**: Supermarket information
- **Category**: Item categorization
- **ShoppingList**: Generated shopping lists

### Performance Optimizations
- Database indexing strategy
- Query optimization with Prisma
- Connection pooling configuration
- Caching layer implementation

## Docker PostgreSQL Setup

### Quick Start with Docker

The project includes a Docker Compose configuration for local PostgreSQL development:

```bash
# Start PostgreSQL container
npm run docker:up

# Run database migration
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Optional: Stop containers
npm run docker:down
```

### Docker Configuration

The `docker-compose.yml` includes:
- **PostgreSQL 15**: Main database on port 5432
- **pgAdmin 4**: Web UI for database management on port 5050
- **Persistent volumes**: Data survives container restarts
- **Health checks**: Ensures database is ready before dependent services

### Docker Commands

```bash
# Container management
npm run docker:up          # Start containers in background
npm run docker:down        # Stop and remove containers
npm run docker:logs        # View PostgreSQL logs
npm run docker:reset       # Reset database with fresh data

# Database operations
npm run db:migrate          # Create and apply migrations
npm run db:push            # Push schema without migration
npm run db:studio          # Open Prisma Studio (GUI)
```

### Access pgAdmin (Optional)
- URL: http://localhost:5050
- Email: admin@supermarket.local
- Password: admin

## Development Status

✅ **Completed:**
- Prisma ORM configuration with PostgreSQL provider
- User model implementation and migration
- Database client with connection management
- Docker PostgreSQL container setup
- CRUD operations validation
- Health check endpoints with database status
- TypeScript integration
- API endpoints: `/api/health`, `/api/db/test`, `/api/db/validate`

✅ **Validated:**
- Database connection working
- User model CRUD operations (Create, Read, Update, Delete)
- Migration system functional
- Docker container healthy and persistent

⏳ **Next Steps:**
- Implement NextAuth.js authentication (Issue #9)
- Add receipt and item models
- Set up database seeding for development
- Production deployment configuration