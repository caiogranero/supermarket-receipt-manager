# SuperMarket Receipt Manager - Session Context

## Project Summary
**Name**: SuperMarket Receipt Manager
**Purpose**: Personal inventory tracking via NFCe QR code scanning
**Users**: 2 (user + wife, shared account)
**Usage**: ~3 receipts per week, weekly shopping pattern
**Primary Goal**: Never forget what to buy - avoid going to supermarket without knowing usual purchases

## Technical Specifications

### Architecture
- **Backend**: C# ASP.NET Core API
- **Frontend**: React PWA (mobile-optimized)
- **Database**: PostgreSQL
- **Hosting**: Render.com (free tier)
- **Deployment**: Cloud database with automatic backup

### Key Requirements
- **QR Code Input**: Paste NFCe URLs from mobile
- **Auto Scraping**: Extract items from São Paulo NFCe system
- **Smart Lists**: "What haven't we bought recently?"
- **Item Unification**: Merge duplicate products with user confirmation
- **Purchase History**: "When did we last buy X?"
- **Pattern Analysis**: Shopping frequency and budget tracking

### Data Flow
```
📱 QR Code Scan → 🌐 NFCe Scraper → 📊 Item Parser → 🗄️ Database → 📈 Analytics Dashboard
```

## Implementation Workflow (6 Phases)

### Phase 1: Foundation Setup (Week 1)
- C# ASP.NET Core API project setup
- PostgreSQL database & Entity Framework
- JWT authentication system
- React PWA scaffolding with mobile design

### Phase 2: NFCe Scraping Engine (Week 2)
- URL parsing and validation
- Web scraping implementation (test URL: https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=35250956527062001697651030000227311007031750|2|1|1|34adcd24f24be99d3b4440f2ab1e6abb0ecbf71f)
- Item data normalization
- Error handling for site downtime

### Phase 3: Data Management (Week 2-3)
- CRUD operations for receipts/purchases
- Item unification algorithm
- Search and history queries
- Auto-categorization (dairy, meat, bakery)

### Phase 4: Smart Features (Week 3-4)
- Shopping frequency analysis
- Smart shopping list generation
- Price trend tracking (unit price + total)
- Pattern recognition for recommendations

### Phase 5: Frontend Integration (Week 3-4)
- QR code URL input interface
- Receipt viewing and management
- Shopping list interface
- Purchase history and search

### Phase 6: Deployment & Production (Week 4-5)
- Render deployment (backend + frontend)
- PostgreSQL production migration
- End-to-end testing
- Production validation

## Database Schema

### Core Tables
```sql
Users (Id, Email, Password, CreatedAt)
Stores (Id, Name, Address)
Receipts (Id, UserId, StoreId, Date, Total, NFCeUrl)
Items (Id, Name, Category, UnifiedItemId)
Purchases (Id, ReceiptId, ItemId, Quantity, UnitPrice, TotalPrice)
UnifiedItems (Id, MainName, Category) -- For merging duplicates
```

## Key Decisions Made

### Hosting Choice
- **Selected**: Render.com (free tier)
- **Rationale**: Truly free for low usage (750 hours/month), supports C# + PostgreSQL
- **Trade-off**: 30s cold starts after inactivity (acceptable for personal use)

### Tech Stack Rationale
- **C# Backend**: User preference, robust for data processing
- **React Frontend**: Modern, PWA-capable, mobile-responsive
- **PostgreSQL**: Reliable, free tier available, SQL familiarity
- **Real-time Scraping**: Simple approach for low volume (3 receipts/week)

### Feature Prioritization
1. **MVP**: QR scan → store items → view history
2. **High Value**: Smart shopping lists based on patterns
3. **Nice to Have**: Nutritional analysis, advanced analytics

## Risk Mitigation
- **NFCe Site Changes**: Flexible parser with comprehensive error handling
- **Free Tier Limits**: Monitor usage, upgrade path to Railway ($5/month) if needed
- **Item Unification**: User confirmation interface for uncertain matches

## Success Metrics
- **Week 4**: Working MVP (QR scanning, storage, basic lists)
- **Week 6**: Production system with smart recommendations
- **User Satisfaction**: Eliminates "forgot what to buy" problem

## Next Steps
Ready to begin Phase 1, Task 1.1: C# ASP.NET Core API project setup

## Session Insights
- User has clear, focused requirements (avoid feature creep)
- Personal/family use case allows for simpler architecture
- Free hosting constraint drives technical decisions
- Primary goal is practical inventory management, not analytics
- Weekly usage pattern fits well with Render's cold start limitations

---
*Session saved: 2025-01-14*
*Status: Requirements complete, workflow defined, ready for implementation*