# Next.js API Setup Documentation

## Project Structure

```
supermarket-receipt-manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check endpoint
│   │   │   └── auth/route.ts        # Authentication placeholder
│   │   ├── layout.tsx               # Root layout with PWA config
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles with Tailwind
│   ├── components/                  # React components (future)
│   └── lib/                        # Utility functions (future)
├── public/
│   └── manifest.json               # PWA manifest
├── package.json                    # Dependencies and scripts
├── next.config.js                  # Next.js config with PWA & CORS
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── .eslintrc.json                  # ESLint configuration
└── .env.local                      # Environment variables
```

## Technology Stack

- **Framework**: Next.js 14.2+ with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+
- **PWA**: next-pwa 5.6+ for Progressive Web App features
- **Linting**: ESLint with Next.js configuration

## API Endpoints

### Health Check - `/api/health`
- **Method**: GET, HEAD
- **Purpose**: System health monitoring and uptime validation
- **Response**: JSON with system status, uptime, and API information

```json
{
  "status": "OK",
  "timestamp": "2025-09-14T22:09:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "0.1.0",
  "api": {
    "status": "operational",
    "endpoints": ["/api/health", "/api/auth (placeholder)"]
  }
}
```

### Authentication - `/api/auth` (Placeholder)
- **Status**: Not implemented - returns 501
- **Purpose**: Future JWT-based authentication system
- **Planned endpoints**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# TypeScript type checking
npm run typecheck
```

## Environment Configuration

Environment variables are configured in `.env.local`:

```bash
NODE_ENV=development
APP_NAME="SuperMarket Receipt Manager"
API_BASE_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:3000

# Future variables for database, JWT, NFCe integration
# DATABASE_URL=postgresql://...
# JWT_SECRET=...
# NFCE_BASE_URL=...
```

## PWA Features

- **Service Worker**: Auto-generated with offline caching
- **Manifest**: Configured for mobile installation
- **Theme**: Primary blue (#3b82f6) with proper mobile viewport
- **Offline Support**: NetworkFirst caching strategy

## CORS Configuration

API routes include CORS headers:
- **Development**: Allows all origins (*)
- **Production**: Restricts to FRONTEND_URL environment variable
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

## Build Validation

✅ **Successful Build Results**:
- TypeScript compilation without errors
- ESLint validation passed
- PWA service worker generated
- Static pages optimized
- Build artifacts created in `.next/`

## Next Steps

1. **Database Integration**: Add PostgreSQL with Prisma ORM
2. **Authentication**: Implement JWT-based auth system
3. **NFCe Integration**: Add QR code processing endpoints
4. **Data Models**: Create receipt and item management APIs
5. **Testing**: Add Jest/React Testing Library setup

## Development Notes

- App Router is used (not Pages Router)
- TypeScript strict mode enabled
- ESLint configured with Next.js best practices
- Tailwind CSS with custom design tokens
- PWA optimized for mobile-first usage pattern