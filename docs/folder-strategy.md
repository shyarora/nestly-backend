# Nestly Backend - Folder Strategy & Project Setup

## 📁 Folder Structure Overview

This document outlines the complete folder structure for the Nestly backend project, designed for scalability, microservices readiness, and GitHub Copilot compatibility.

## 🏗️ Complete Folder Structure

```
nestly-backend/
├── apps/                           # Microservices applications
│   ├── api-gateway/               # Main GraphQL API gateway
│   │   ├── src/
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   ├── index.ts      # Combined schema
│   │   │   │   ├── user.graphql  # User schema
│   │   │   │   ├── property.graphql
│   │   │   │   ├── booking.graphql
│   │   │   │   ├── payment.graphql
│   │   │   │   └── review.graphql
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   ├── index.ts      # Combined resolvers
│   │   │   │   ├── user.resolver.ts
│   │   │   │   ├── property.resolver.ts
│   │   │   │   ├── booking.resolver.ts
│   │   │   │   ├── payment.resolver.ts
│   │   │   │   └── review.resolver.ts
│   │   │   ├── middleware/       # Authentication, rate limiting
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── validation.middleware.ts
│   │   │   ├── context/          # GraphQL context
│   │   │   │   └── apollo-context.ts
│   │   │   ├── server.ts         # Apollo Server setup
│   │   │   └── app.ts           # Express app setup
│   │   ├── tests/               # API gateway tests
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth-service/              # Authentication microservice
│   │   ├── src/
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   ├── auth.resolver.ts
│   │   │   │   └── profile.resolver.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── google-oauth.service.ts
│   │   │   │   ├── jwt.service.ts
│   │   │   │   └── user.service.ts
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   ├── auth.graphql
│   │   │   │   └── user.graphql
│   │   │   ├── middleware/       # GraphQL middleware
│   │   │   │   └── auth-validation.middleware.ts
│   │   │   ├── types/            # TypeScript types
│   │   │   │   └── auth.types.ts
│   │   │   └── server.ts         # GraphQL server setup
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── property-service/          # Property management
│   │   ├── src/
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   ├── property.resolver.ts
│   │   │   │   ├── search.resolver.ts
│   │   │   │   └── media.resolver.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── property.service.ts
│   │   │   │   ├── search.service.ts
│   │   │   │   ├── pricing.service.ts
│   │   │   │   └── availability.service.ts
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   └── property.repository.ts
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   ├── property.graphql
│   │   │   │   └── search.graphql
│   │   │   ├── types/            # TypeScript types
│   │   │   │   └── property.types.ts
│   │   │   └── server.ts         # GraphQL server setup
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── booking-service/           # Booking and availability
│   │   ├── src/
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   ├── booking.resolver.ts
│   │   │   │   └── availability.resolver.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── booking.service.ts
│   │   │   │   ├── availability.service.ts
│   │   │   │   ├── pricing-engine.service.ts
│   │   │   │   └── conflict-resolution.service.ts
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   └── booking.repository.ts
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   ├── booking.graphql
│   │   │   │   └── availability.graphql
│   │   │   ├── types/            # TypeScript types
│   │   │   │   └── booking.types.ts
│   │   │   └── server.ts         # GraphQL server setup
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── payment-service/           # Razorpay integration
│   │   ├── src/
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   ├── payment.resolver.ts
│   │   │   │   └── webhook.resolver.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── razorpay.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   └── refund.service.ts
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   └── payment.repository.ts
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   └── payment.graphql
│   │   │   ├── webhooks/         # Webhook handlers (REST endpoints for Razorpay)
│   │   │   │   └── razorpay.webhook.ts
│   │   │   ├── types/            # TypeScript types
│   │   │   │   └── payment.types.ts
│   │   │   └── server.ts         # GraphQL server setup
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── review-service/            # Reviews and ratings
│   │   ├── src/
│   │   │   ├── resolvers/        # GraphQL resolvers
│   │   │   │   └── review.resolver.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── review.service.ts
│   │   │   │   ├── rating-aggregation.service.ts
│   │   │   │   └── moderation.service.ts
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   └── review.repository.ts
│   │   │   ├── schema/           # GraphQL schema definitions
│   │   │   │   └── review.graphql
│   │   │   ├── types/            # TypeScript types
│   │   │   │   └── review.types.ts
│   │   │   └── server.ts         # GraphQL server setup
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── notification-service/      # Email and messaging
│       ├── src/
│       │   ├── resolvers/        # GraphQL resolvers
│       │   │   ├── email.resolver.ts
│       │   │   └── message.resolver.ts
│       │   ├── services/         # Business logic
│       │   │   ├── email.service.ts
│       │   │   ├── message.service.ts
│       │   │   └── template.service.ts
│       │   ├── repositories/     # Data access layer
│       │   │   └── message.repository.ts
│       │   ├── schema/           # GraphQL schema definitions
│       │   │   ├── email.graphql
│       │   │   └── message.graphql
│       │   ├── types/            # TypeScript types
│       │   │   └── notification.types.ts
│       │   └── server.ts         # GraphQL server setup
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
│
├── packages/                      # Shared libraries (monorepo approach)
│   ├── database/                  # Database schemas and migrations
│   │   ├── src/
│   │   │   ├── schemas/          # Drizzle schemas
│   │   │   │   ├── index.ts      # Export all schemas
│   │   │   │   ├── users.schema.ts
│   │   │   │   ├── properties.schema.ts
│   │   │   │   ├── bookings.schema.ts
│   │   │   │   ├── payments.schema.ts
│   │   │   │   ├── reviews.schema.ts
│   │   │   │   └── messages.schema.ts
│   │   │   ├── migrations/       # Database migrations
│   │   │   │   ├── 0001_initial_tables.sql
│   │   │   │   ├── 0002_add_indexes.sql
│   │   │   │   └── migrate.ts
│   │   │   ├── seeds/            # Test data
│   │   │   │   ├── users.seed.ts
│   │   │   │   └── properties.seed.ts
│   │   │   ├── connection.ts     # Database connection
│   │   │   └── config.ts         # Database configuration
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── common/                    # Shared utilities
│   │   ├── src/
│   │   │   ├── types/            # TypeScript types
│   │   │   │   ├── index.ts
│   │   │   │   ├── api.types.ts
│   │   │   │   ├── database.types.ts
│   │   │   │   └── service.types.ts
│   │   │   ├── utils/            # Helper functions
│   │   │   │   ├── index.ts
│   │   │   │   ├── date.utils.ts
│   │   │   │   ├── string.utils.ts
│   │   │   │   ├── validation.utils.ts
│   │   │   │   └── logger.utils.ts
│   │   │   ├── constants/        # App constants
│   │   │   │   ├── index.ts
│   │   │   │   ├── status.constants.ts
│   │   │   │   └── config.constants.ts
│   │   │   ├── validators/       # Input validation
│   │   │   │   ├── index.ts
│   │   │   │   ├── user.validator.ts
│   │   │   │   ├── property.validator.ts
│   │   │   │   └── booking.validator.ts
│   │   │   ├── errors/           # Custom error classes
│   │   │   │   ├── index.ts
│   │   │   │   ├── app.error.ts
│   │   │   │   ├── validation.error.ts
│   │   │   │   └── database.error.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                      # Authentication utilities
│   │   ├── src/
│   │   │   ├── jwt/              # JWT utilities
│   │   │   │   ├── jwt.service.ts
│   │   │   │   └── jwt.types.ts
│   │   │   ├── google/           # Google OAuth helpers
│   │   │   │   ├── google-oauth.service.ts
│   │   │   │   └── google.types.ts
│   │   │   ├── middleware/       # Auth middleware
│   │   │   │   ├── authenticate.middleware.ts
│   │   │   │   └── authorize.middleware.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── graphql-types/             # Generated GraphQL types
│       ├── src/
│       │   ├── generated/        # Auto-generated types
│       │   └── custom/           # Custom type extensions
│       ├── codegen.yml           # GraphQL codegen config
│       ├── package.json
│       └── tsconfig.json
│
├── shared/                        # Non-package shared resources
│   ├── docker/                    # Docker configurations
│   │   ├── development/
│   │   │   ├── docker-compose.yml
│   │   │   └── Dockerfile.dev
│   │   └── production/
│   │       ├── docker-compose.prod.yml
│   │       └── Dockerfile.prod
│   ├── scripts/                   # Build and deployment scripts
│   │   ├── build.sh
│   │   ├── deploy.sh
│   │   ├── setup.sh
│   │   └── migrate.sh
│   └── configs/                   # Configuration files
│       ├── nginx.conf
│       ├── pm2.ecosystem.js
│       └── env.example
│
├── tools/                         # Development tools
│   ├── codegen/                   # Code generation tools
│   │   ├── graphql-codegen.ts
│   │   └── schema-generator.ts
│   ├── testing/                   # Testing utilities
│   │   ├── test-helpers.ts
│   │   ├── mock-data.ts
│   │   └── test-setup.ts
│   └── deployment/                # Deployment scripts
│       ├── oci-deploy.ts
│       └── docker-build.ts
│
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   │   ├── graphql-schema.md
│   │   └── rest-endpoints.md
│   ├── architecture/              # System architecture
│   │   ├── overview.md
│   │   ├── database-design.md
│   │   └── microservices.md
│   ├── deployment/                # Deployment guides
│   │   ├── oci-setup.md
│   │   └── docker-deployment.md
│   └── folder-strategy.md         # This document
│
├── tests/                         # End-to-end tests
│   ├── e2e/
│   │   ├── auth.test.ts
│   │   ├── booking.test.ts
│   │   └── payment.test.ts
│   ├── integration/
│   │   ├── api.test.ts
│   │   └── database.test.ts
│   └── fixtures/
│       ├── users.json
│       └── properties.json
│
├── plan/                          # Project planning
│   └── intro.md                   # Project overview
│
├── docker-compose.yml             # Local development
├── docker-compose.prod.yml        # Production setup
├── package.json                   # Root package.json (workspace)
├── tsconfig.json                  # Root TypeScript config
├── .gitignore                     # Git ignore rules
├── .env.example                   # Environment variables template
└── README.md                      # Project documentation
```

## 🎯 Design Principles

### 1. **Microservices-Ready Architecture**

-   **Domain-Driven Design**: Each service represents a business domain
-   **Clear Boundaries**: Well-defined service interfaces
-   **Independent Deployment**: Each service can be deployed separately
-   **Database per Service**: Future-ready for separate databases

### 2. **Monorepo Benefits**

-   **Shared Code**: Common utilities in `packages/`
-   **Type Safety**: Shared TypeScript types
-   **Consistent Patterns**: Same structure across all services
-   **Easy Refactoring**: Cross-service changes are simple

### 3. **GitHub Copilot Optimization**

-   **Descriptive Naming**: Self-documenting folder and file names
-   **Consistent Patterns**: Predictable file locations
-   **Clear Separation**: Resolvers, services, repositories pattern (GraphQL-focused)
-   **Type-First Approach**: Strong TypeScript inference

### 4. **100% GraphQL Architecture**

-   **No REST Endpoints**: All client communication via GraphQL
-   **Unified API**: Single GraphQL endpoint per service
-   **Type-Safe**: Schema-first development with generated types
-   **Real-time**: GraphQL subscriptions for live updates

## 🎯 GraphQL Architecture Explained

### **GraphQL vs REST Terminology**

**❌ REST Pattern (what we avoid):**

```
controllers/ ← HTTP route handlers (/api/users, /api/properties)
routes/      ← URL routing definitions
middleware/  ← HTTP middleware
```

**✅ GraphQL Pattern (what we use):**

```
resolvers/   ← GraphQL field resolvers (handle queries/mutations)
schema/      ← GraphQL schema definitions (.graphql files)
middleware/  ← GraphQL middleware (auth, validation)
services/    ← Business logic (same as REST)
repositories/ ← Data access (same as REST)
```

### **Key GraphQL Components Explained**

#### **1. Resolvers** (GraphQL's "Controllers")

Resolvers are functions that fetch data for GraphQL fields:

```typescript
// apps/property-service/src/resolvers/property.resolver.ts
export const propertyResolvers = {
    Query: {
        // Handle: query { properties { id, title } }
        properties: async (parent, args, context) => {
            return await PropertyService.getAllProperties(args.filters);
        },

        // Handle: query { property(id: "123") { id, title } }
        property: async (parent, { id }, context) => {
            return await PropertyService.getPropertyById(id);
        },
    },

    Mutation: {
        // Handle: mutation { createProperty(input: {...}) { id } }
        createProperty: async (parent, { input }, context) => {
            return await PropertyService.createProperty(input);
        },
    },

    // Field resolvers for complex/related data
    Property: {
        // When someone queries property.reviews, this runs
        reviews: async (property, args, context) => {
            return await ReviewService.getPropertyReviews(property.id);
        },
    },
};
```

#### **2. Schema** (GraphQL Type Definitions)

Schema files define your API structure:

```graphql
# apps/property-service/src/schema/property.graphql
type Property {
    id: ID!
    title: String!
    price: Float!
    reviews: [Review!]! # This triggers the field resolver
}

type Query {
    properties(filters: PropertyFiltersInput): [Property!]!
    property(id: ID!): Property
}

type Mutation {
    createProperty(input: CreatePropertyInput!): Property!
}
```

#### **3. Services** (Business Logic - Same as REST)

```typescript
// apps/property-service/src/services/property.service.ts
export class PropertyService {
    static async createProperty(input: CreatePropertyInput) {
        // Validate, apply business rules, save to database
        return await PropertyRepository.create(input);
    }
}
```

#### **4. Repositories** (Data Access - Same as REST)

```typescript
// apps/property-service/src/repositories/property.repository.ts
export class PropertyRepository {
    static async create(data: CreatePropertyData) {
        return await db.insert(properties).values(data).returning();
    }
}
```

### **Special Case: Webhooks**

Note: Payment service includes `webhooks/` folder because Razorpay sends HTTP webhooks (not GraphQL):

```
payment-service/src/
├── resolvers/           # GraphQL API for client
├── webhooks/           # REST endpoints for Razorpay callbacks
└── services/           # Business logic for both
```

### 4. **Scalability Features**

-   **Horizontal Scaling**: Each service can scale independently
-   **Load Balancing**: API gateway can distribute requests
-   **Caching Strategy**: Service-level caching capabilities
-   **Database Optimization**: Query optimization per service

## 📦 Package Structure Explained

### **apps/**: Microservices Applications

Each application is a complete, deployable service:

-   **Independent**: Can run standalone
-   **Business-Focused**: Represents a domain boundary
-   **API Endpoints**: REST or GraphQL endpoints
-   **Database Access**: Through shared database package

### **packages/**: Shared Libraries

Reusable code across all services:

-   **database**: Drizzle schemas and migrations
-   **common**: Utilities, types, validators, errors
-   **auth**: Authentication and authorization logic
-   **graphql-types**: Generated and custom GraphQL types

### **shared/**: Infrastructure Resources

Non-code shared resources:

-   **docker**: Container configurations
-   **scripts**: Build and deployment automation
-   **configs**: Infrastructure configuration files

### **tools/**: Development Utilities

Development and build-time tools:

-   **codegen**: Code generation scripts
-   **testing**: Test utilities and helpers
-   **deployment**: Deployment automation

## 🔄 Service Communication Patterns

### Internal Communication (Monolith Mode)

```typescript
// Direct function calls within single deployment
import { PropertyService } from "../../property-service/src/services";
const properties = await PropertyService.search(criteria);
```

### External Communication (Microservices Mode)

```typescript
// GraphQL calls between services via federation or direct GraphQL
import { ServiceClient } from "@nestly/common";
const properties = await ServiceClient.graphql.query(
    `
  query GetProperties($filters: PropertyFiltersInput) {
    properties(filters: $filters) {
      id
      title
      price
    }
  }
`,
    { filters: criteria },
);
```

### GraphQL Federation (Advanced)

```typescript
// Each service extends the schema
// property-service adds Property type
// booking-service extends Property with bookings field

// Client can query across services seamlessly:
// query {
//   property(id: "123") {    # From property-service
//     title
//     bookings {             # From booking-service
//       checkIn
//       checkOut
//     }
//   }
// }
```

## 🗄️ Database Strategy

### Shared Database (Initial)

-   Single PostgreSQL instance
-   All services use `@nestly/database` package
-   Shared migrations and schemas
-   ACID transactions across services

### Separate Databases (Future)

-   Service-specific databases
-   Data synchronization via events
-   Eventual consistency model
-   Service-owned data

## 🚀 Development Workflow

### 1. **Local Development**

```bash
# Install dependencies
npm install

# Start all services in development mode
npm run dev

# Start specific service
npm run dev:property

# Database migrations
npm run db:migrate

# Generate GraphQL types
npm run codegen
```

### 2. **Testing**

```bash
# Run all tests
npm test

# Service-specific tests
npm run test:property

# E2E tests
npm run test:e2e

# Integration tests
npm run test:integration
```

### 3. **Building & Deployment**

```bash
# Build all services
npm run build

# Build specific service
npm run build:property

# Deploy to OCI
npm run deploy

# Deploy specific service
npm run deploy:property
```

## 🔧 Configuration Management

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/nestly
DATABASE_POOL_SIZE=10

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
SENDGRID_API_KEY=your_sendgrid_key
# or
OCI_EMAIL_ENDPOINT=your_oci_endpoint

# Services (for microservices mode)
PROPERTY_SERVICE_URL=http://localhost:3001
BOOKING_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
```

## 📋 Next Steps

1. **Setup Project**: Follow the project setup guide
2. **Database Design**: Create Drizzle schemas
3. **API Gateway**: Setup Apollo Server
4. **Authentication**: Implement Google OAuth
5. **Property Service**: Build property management
6. **Booking System**: Implement reservation logic
7. **Payment Integration**: Setup Razorpay
8. **Testing**: Comprehensive test coverage
9. **Deployment**: OCI deployment setup

This folder structure provides a solid foundation for building a scalable, maintainable, and Copilot-friendly Airbnb clone backend that can evolve from a monolith to microservices as needed.
