# SuperMarket Receipt Manager

Personal inventory tracking system for São Paulo supermarket receipts via NFCe QR code scanning.

## 🎯 Project Overview

**Primary Goal**: Never forget what to buy - avoid going to the supermarket without knowing usual purchases.

**Users**: Personal use for 2 people (shared account)  
**Usage Pattern**: ~3 receipts per week, weekly shopping  
**Core Feature**: Scan NFCe QR codes → Smart shopping lists

## 🏗️ Architecture

- **Backend**: Next.js 14 API Routes (App Router)
- **Frontend**: React PWA (mobile-optimized)
- **Database**: PostgreSQL with Docker (dev) / Vercel (prod)
- **ORM**: Prisma with TypeScript
- **Hosting**: Vercel (planned)

## 📋 Current Status

This project is in active development. See [Issues](https://github.com/caiogranero/supermarket-receipt-manager/issues) for current tasks and [Milestones](https://github.com/caiogranero/supermarket-receipt-manager/milestones) for progress tracking.

### Development Phases

1. **[Foundation Setup](https://github.com/caiogranero/supermarket-receipt-manager/issues/1)** - Core infrastructure and authentication
2. **[NFCe Processing Engine](https://github.com/caiogranero/supermarket-receipt-manager/issues/2)** - QR code parsing and data extraction
3. **[Core Data Management](https://github.com/caiogranero/supermarket-receipt-manager/issues/3)** - CRUD operations and item unification  
4. **[Smart Features](https://github.com/caiogranero/supermarket-receipt-manager/issues/4)** - Shopping patterns and smart lists
5. **[User Interface](https://github.com/caiogranero/supermarket-receipt-manager/issues/5)** - Complete PWA interface
6. **[Production Deployment](https://github.com/caiogranero/supermarket-receipt-manager/issues/6)** - Live system on Render.com

## 🚀 Core Features

### MVP (Week 4 Target)
- ✅ QR code scanning and data storage  
- ✅ Purchase history search ("When did I last buy eggs?")
- ✅ Basic shopping list generation

### Full System (Week 6 Target)  
- ✅ Smart recommendations based on patterns
- ✅ Item unification (merge duplicates across stores)
- ✅ Mobile-optimized user experience
- ✅ Price trend tracking

## 🛠️ Technical Stack

### Backend
- **Framework**: Next.js 14+ API Routes with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (planned)
- **Development**: Docker PostgreSQL container
- **Architecture**: Clean Architecture principles

### Frontend
- **Framework**: React 18+ with hooks
- **Type**: Progressive Web App (PWA)
- **Styling**: Mobile-first responsive design
- **Build**: Vite or Create React App

### Infrastructure
- **Hosting**: Render.com (free tier - 750 hours/month)
- **Database**: Render PostgreSQL (1GB limit)
- **Performance**: Handles 30s cold starts after inactivity

## 📊 Data Flow

```
📱 Mobile QR Scan → 🌐 NFCe Scraper → 📊 Item Parser → 🗄️ Database → 📈 Analytics Dashboard
```

## 🏪 NFCe Integration

The system processes São Paulo NFCe (Nota Fiscal de Consumidor Eletrônica) receipts by:

1. **QR Code Input**: User scans or inputs NFCe URL
2. **Web Scraping**: Extracts purchase data from government portal
3. **Data Processing**: Normalizes item names, prices, quantities
4. **Storage**: Saves to database with automatic categorization
5. **Analytics**: Generates shopping patterns and recommendations

### Sample NFCe URL Format
```
https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=35250956527062001697651030000227311007031750|2|1|1|34adcd24f24be99d3b4440f2ab1e6abb0ecbf71f
```

## 📱 Mobile-First Design

The interface is optimized for mobile phones since users will primarily:
- Scan QR codes with their phones after shopping
- Check shopping lists while in supermarkets  
- Search purchase history while planning meals

## 🔒 Privacy & Data

- **Personal Use Only**: Designed for 2 users with shared account
- **Data Retention**: 1 year of purchase history
- **Cloud Storage**: Render.com database with automatic backups
- **Authentication**: Simple email/password (no social login complexity)

## 📈 Success Metrics

- **Primary Success**: Eliminates "forgot what to buy" problem
- **Usage Goal**: Easy weekly routine - scan receipt → get shopping list  
- **Technical Goal**: Reliable system handling 3 receipts/week efficiently

## 🤝 Contributing

This is a personal project for 2-person use. Issues and pull requests are used for internal development tracking.

## 📄 License

Private project for personal use.

---

**Project Status**: In Development  
**Timeline**: 4-6 weeks part-time development  
**Next Milestone**: [Foundation Setup](https://github.com/caiogranero/supermarket-receipt-manager/issues/1)