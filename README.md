# Nestly Backend

A scalable, open-source Airbnb-like backend built with modern technologies and free-tier cloud services. This project demonstrates how to build a production-ready rental marketplace backend using cost-effective solutions.

## 🎯 Project Objectives

- **Educational**: Step-by-step backend development for rental marketplace
- **Scalable**: Monolithic architecture with clear module separation
- **Cost-Effective**: Built entirely on free-tier cloud services
- **Production-Ready**: Industry-standard patterns and best practices
- **Open Source**: Complete transparency in implementation decisions

## 🛠️ Tech Stack

### Core Technologies

- **Runtime**: Node.js 18+
- **API**: GraphQL with Apollo Server
- **Database**: MongoDB Atlas (Free Tier)
- **Cache**: Redis Cloud (Free Tier)
- **Authentication**: JWT + OAuth2 (Google, GitHub)
- **Payment**: Razorpay
- **File Storage**: Cloudflare R2 (Generous Free Quota)

### Infrastructure

- **Hosting**: Oracle Cloud Infrastructure (OCI) Ampere (Always Free)
- **Containerization**: Docker
- **CDN**: Cloudflare

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GraphQL API   │────│  Business Logic │────│   Data Layer    │
│                 │    │                 │    │                 │
│ • Resolvers     │    │ • Services      │    │ • MongoDB       │
│ • Schemas       │    │ • Validators    │    │ • Redis Cache   │
│ • Middlewares   │    │ • Utils         │    │ • File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Core Features

### Phase 1: Foundation

- [x] Project setup and architecture
- [ ] User authentication (JWT + OAuth2)
- [ ] User profiles and roles (Host/Guest)
- [ ] Basic GraphQL schema

### Phase 2: Property Management

- [ ] Property listings CRUD
- [ ] Image upload and management
- [ ] Search and filtering
- [ ] Property availability calendar

### Phase 3: Booking System

- [ ] Booking creation and management
- [ ] Calendar integration
- [ ] Pricing calculations
- [ ] Booking status workflow

### Phase 4: Financial System

- [ ] Razorpay integration
- [ ] Payment processing
- [ ] Host payout management
- [ ] Transaction history

### Phase 5: Social Features

- [ ] Review system (bidirectional)
- [ ] Rating aggregation
- [ ] Host-guest messaging
- [ ] User reputation system

### Phase 6: Administration

- [ ] Admin dashboard APIs
- [ ] Content moderation
- [ ] User management
- [ ] Analytics and reporting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB Atlas account
- Redis Cloud account
- Cloudflare account
- Razorpay account

### Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd nestly-backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env with your service credentials

# Start development server
npm run dev
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d
```

## 📁 Project Structure

```
src/
├── graphql/           # GraphQL schemas and resolvers
│   ├── schemas/       # Type definitions
│   ├── resolvers/     # Query/Mutation resolvers
│   └── middlewares/   # GraphQL middlewares
├── services/          # Business logic layer
│   ├── auth/          # Authentication services
│   ├── user/          # User management
│   ├── property/      # Property management
│   ├── booking/       # Booking system
│   ├── payment/       # Payment processing
│   └── admin/         # Admin operations
├── models/            # MongoDB schemas
├── utils/             # Shared utilities
├── config/            # Configuration files
└── middlewares/       # Express middlewares
```

## 🔒 Security Features

- JWT token authentication
- OAuth2 social login
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment-based secrets
- SQL injection prevention (MongoDB)
- XSS protection

## 📊 Performance Optimizations

- Redis caching strategy
- Database indexing
- GraphQL query optimization
- Image compression and CDN
- Connection pooling
- Lazy loading implementations

## 🧪 Testing Strategy

- Unit tests with Jest
- Integration tests for GraphQL endpoints
- Database transaction testing
- Payment flow testing
- Authentication flow testing

## 📖 Documentation

- **API Documentation**: GraphQL Playground/Apollo Studio
- **Architecture Decisions**: `/docs/architecture/`
- **Deployment Guide**: `/docs/deployment/`
- **Contributing Guide**: `/docs/contributing/`

## 🤝 Contributing

This project follows a collaborative AI-human development approach. See `COPILOT_INSTRUCTIONS.md` for AI assistance guidelines.

## 📄 License

MIT License - See LICENSE file for details

## 🌟 Learning Outcomes

By following this project, you'll learn:

- GraphQL API design and implementation
- MongoDB schema design and optimization
- JWT and OAuth2 authentication patterns
- Payment gateway integration
- Cloud service integration on free tiers
- Docker containerization
- Scalable backend architecture patterns

---

**Note**: This project prioritizes educational value while maintaining production-ready code quality. Each feature is implemented with detailed explanations and best practices.
