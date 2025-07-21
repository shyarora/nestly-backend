# Nestly Backend - Airbnb Clone

🏠 **Modern GraphQL microservices backend built with TypeScript, Drizzle ORM, and Apollo Server**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+
- PostgreSQL 15+
- Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nestly-backend

# Install dependencies
pnpm install

# Start development services (PostgreSQL, Redis)
pnpm docker:dev

# Setup database
pnpm db:generate
pnpm db:migrate

# Start all services in development
pnpm dev
```

## 🏗️ Architecture Overview

This project uses a **monorepo microservices architecture** with the following services:

| Service                  | Port | Description                            |
| ------------------------ | ---- | -------------------------------------- |
| **API Gateway**          | 4000 | Main GraphQL endpoint, request routing |
| **Auth Service**         | 4002 | User authentication, Google OAuth      |
| **Property Service**     | 4001 | Property management, search            |
| **Booking Service**      | 4003 | Reservations, availability             |
| **Payment Service**      | 4004 | Razorpay integration, transactions     |
| **Review Service**       | 4005 | Reviews and ratings                    |
| **Notification Service** | 4006 | Email and messaging                    |

## 🛠️ Development Commands

### Start Services

```bash
# All services
pnpm dev

# Individual services
pnpm dev:gateway      # API Gateway
pnpm dev:auth         # Auth Service
pnpm dev:property     # Property Service
pnpm dev:booking      # Booking Service
pnpm dev:payment      # Payment Service
pnpm dev:review       # Review Service
pnpm dev:notification # Notification Service
```

### Database Operations

```bash
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed test data
```

### Build & Test

```bash
pnpm build            # Build all services
pnpm test             # Run all tests
pnpm test:e2e         # End-to-end tests
pnpm lint             # Lint all code
pnpm type-check       # TypeScript checking
```

## 📊 Health Check Endpoints

Each service provides health check endpoints:

### GraphQL Health Checks

```graphql
query HealthCheck {
    livez # Basic liveness check
    readyz # Readiness with dependencies
    hello # Hello world with timestamp
}
```

### REST Health Checks

```bash
# Liveness probe
curl http://localhost:4000/livez

# Readiness probe
curl http://localhost:4000/readyz
```

## 🌐 GraphQL Playground

Visit the GraphQL playground for each service:

- **API Gateway**: http://localhost:4000/graphql
- **Property Service**: http://localhost:4001/graphql
- **Auth Service**: http://localhost:4002/graphql
- **Booking Service**: http://localhost:4003/graphql
- **Payment Service**: http://localhost:4004/graphql
- **Review Service**: http://localhost:4005/graphql
- **Notification Service**: http://localhost:4006/graphql

## 📁 Project Structure

```
nestly-backend/
├── apps/                    # Microservices
│   ├── api-gateway/        # Main GraphQL gateway
│   ├── auth-service/       # Authentication
│   ├── property-service/   # Property management
│   ├── booking-service/    # Booking system
│   ├── payment-service/    # Payment processing
│   ├── review-service/     # Reviews & ratings
│   └── notification-service/ # Messaging
│
├── packages/               # Shared libraries
│   ├── database/          # Drizzle schemas & migrations
│   ├── common/            # Utilities & types
│   ├── auth/              # Authentication helpers
│   └── graphql-types/     # Generated GraphQL types
│
└── shared/                # Infrastructure
    ├── docker/            # Docker configurations
    ├── scripts/           # Build scripts
    └── configs/           # Infrastructure configs
```

## 🔧 Technology Stack

### Core Technologies

- **TypeScript** - Type-safe JavaScript
- **GraphQL** - API query language
- **Apollo Server** - GraphQL server
- **Fastify** - Fast web framework
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### Development Tools

- **Turbo** - Monorepo build system
- **PNPM** - Fast package manager
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth credentials
- `RAZORPAY_KEY_ID` - Payment gateway keys
- `JWT_SECRET` - Authentication secret

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 🚢 Deployment

### Development

```bash
# Start with Docker
pnpm docker:dev

# Manual start
pnpm dev
```

### Production

```bash
# Build all services
pnpm build

# Start production services
pnpm start
```

## 📖 API Documentation

- [GraphQL Schema](./docs/api/graphql-schema.md)
- [REST Endpoints](./docs/api/rest-endpoints.md)
- [Architecture Overview](./docs/architecture/overview.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Nestly platform**
