# Project Context - Supermarket Receipt Manager

## Session Loaded: 2025-09-17

### 🏗️ Project Architecture
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js implemented
- **Frontend**: React 18 with PWA capabilities
- **Deployment**: Configured for Vercel

### 📁 Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── db/            # Database utilities
│   │   └── health/        # Health check
│   ├── auth/              # Auth UI pages
│   ├── dashboard/         # Main application
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   └── providers/         # Context providers
├── lib/                   # Utilities
│   ├── prisma.ts         # Database connection
│   └── auth-helpers.ts   # Auth utilities
└── types/                 # TypeScript definitions
```

### 🔧 Key Dependencies
- **Core**: Next.js 14, React 18, TypeScript
- **Database**: Prisma 6.16.1, @prisma/client
- **Auth**: NextAuth.js 4.24.11, @auth/prisma-adapter
- **Security**: bcryptjs, Zod validation
- **Development**: Docker PostgreSQL setup

### 📊 Current Implementation Status
- ✅ Project foundation with Next.js 14
- ✅ PostgreSQL database with Docker
- ✅ Basic User authentication model
- ✅ NextAuth.js integration
- ✅ TypeScript configuration
- ✅ Environment setup

### 🎯 Project Purpose
Personal inventory tracking system for São Paulo supermarket receipts via NFCe QR code scanning. Core goal: eliminate "forgot what to buy" problem through smart shopping lists based on purchase history.

### 🚧 Development Phases
1. **Foundation Setup** ✅ - Infrastructure and authentication
2. **NFCe Processing Engine** - QR code parsing and data extraction
3. **Core Data Management** - CRUD operations and item unification
4. **Smart Features** - Shopping patterns and smart lists
5. **User Interface** - Complete PWA interface
6. **Production Deployment** - Live system deployment

### 🔄 Current Git Status
- **Branch**: main
- **Modified files**: middleware.ts, src/app/layout.tsx, src/app/page.tsx, src/lib/prisma.ts
- **Untracked**: src/app/auth/, src/app/dashboard/, src/components/, src/lib/auth-helpers.ts

### 📱 Key Features Target
- QR code scanning for NFCe receipts
- Purchase history tracking
- Smart shopping list generation
- Item unification across stores
- Mobile-first PWA design

### 🔗 Environment Configuration
- Development: `npm run dev` on port 3000
- Database: Docker PostgreSQL on localhost:5432
- NextAuth URL: localhost:3002
- API base: localhost:3000/api

### ⚡ Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint checking
- `npm run db:*` - Prisma database operations
- `npm run docker:*` - Docker container management