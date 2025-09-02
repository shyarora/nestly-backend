# Project Structure

```
nestly-backend/
├── README.md                          # Project overview and quick start
├── COPILOT_INSTRUCTIONS.md           # AI collaboration guidelines
├── package.json                       # Node.js dependencies
├── package-lock.json
├── .env.example                       # Environment variables template
├── .env                              # Environment variables (git ignored)
├── .gitignore
├── .dockerignore
├── Dockerfile                        # Production Docker image
├── docker-compose.yml               # Development environment
├── docker-compose.prod.yml          # Production environment
├── tsconfig.json                    # TypeScript configuration
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── jest.config.js                   # Jest testing configuration
├── nodemon.json                     # Development server configuration
│
├── .github/                         # GitHub configuration
│   ├── workflows/                   # CI/CD pipelines
│   │   ├── test.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   └── ISSUE_TEMPLATE/             # Issue templates
│       ├── feature-implementation.md
│       └── bug-report.md
│
├── docs/                           # Documentation
│   ├── ROADMAP.md                 # Development roadmap
│   ├── architecture/              # Architecture documentation
│   │   ├── database-design.md
│   │   ├── api-design.md
│   │   └── security.md
│   ├── features/                  # Feature specifications
│   │   └── specifications.md
│   ├── deployment/                # Deployment guides
│   │   ├── oci-setup.md
│   │   ├── docker-guide.md
│   │   └── environment-setup.md
│   └── contributing/              # Contributing guidelines
│       ├── code-standards.md
│       ├── testing-guide.md
│       └── review-process.md
│
├── src/                           # Source code
│   ├── index.ts                   # Application entry point
│   ├── app.ts                     # Express app configuration
│   ├── server.ts                  # Apollo Server setup
│   │
│   ├── config/                    # Configuration files
│   │   ├── database.ts           # MongoDB connection
│   │   ├── redis.ts              # Redis connection
│   │   ├── auth.ts               # Authentication config
│   │   ├── upload.ts             # File upload config
│   │   └── index.ts              # Configuration exports
│   │
│   ├── graphql/                   # GraphQL layer
│   │   ├── schema.ts             # Combined schema
│   │   ├── context.ts            # GraphQL context
│   │   ├── schemas/              # Type definitions
│   │   │   ├── user.graphql
│   │   │   ├── property.graphql
│   │   │   ├── booking.graphql
│   │   │   ├── payment.graphql
│   │   │   ├── review.graphql
│   │   │   └── admin.graphql
│   │   ├── resolvers/            # GraphQL resolvers
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   ├── property.ts
│   │   │   ├── booking.ts
│   │   │   ├── payment.ts
│   │   │   ├── review.ts
│   │   │   └── admin.ts
│   │   └── middlewares/          # GraphQL middlewares
│   │       ├── auth.ts
│   │       ├── validation.ts
│   │       ├── rate-limit.ts
│   │       └── error-handler.ts
│   │
│   ├── services/                  # Business logic layer
│   │   ├── auth/                 # Authentication services
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.service.ts
│   │   │   ├── oauth.service.ts
│   │   │   └── email.service.ts
│   │   ├── user/                 # User management
│   │   │   ├── user.service.ts
│   │   │   ├── profile.service.ts
│   │   │   └── upload.service.ts
│   │   ├── property/             # Property management
│   │   │   ├── property.service.ts
│   │   │   ├── search.service.ts
│   │   │   ├── availability.service.ts
│   │   │   └── image.service.ts
│   │   ├── booking/              # Booking system
│   │   │   ├── booking.service.ts
│   │   │   ├── calendar.service.ts
│   │   │   ├── pricing.service.ts
│   │   │   └── notification.service.ts
│   │   ├── payment/              # Payment processing
│   │   │   ├── payment.service.ts
│   │   │   ├── razorpay.service.ts
│   │   │   ├── payout.service.ts
│   │   │   └── webhook.service.ts
│   │   ├── review/               # Review system
│   │   │   ├── review.service.ts
│   │   │   ├── rating.service.ts
│   │   │   └── moderation.service.ts
│   │   └── admin/                # Admin operations
│   │       ├── admin.service.ts
│   │       ├── analytics.service.ts
│   │       ├── moderation.service.ts
│   │       └── reporting.service.ts
│   │
│   ├── models/                    # Database models
│   │   ├── index.ts              # Model exports
│   │   ├── User.ts               # User model
│   │   ├── Property.ts           # Property model
│   │   ├── Booking.ts            # Booking model
│   │   ├── Payment.ts            # Payment model
│   │   ├── Review.ts             # Review model
│   │   ├── AdminAction.ts        # Admin action model
│   │   └── RefreshToken.ts       # Refresh token model
│   │
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.ts               # Authentication middleware
│   │   ├── validation.ts         # Input validation
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── error-handler.ts      # Error handling
│   │   ├── logger.ts             # Request logging
│   │   └── security.ts           # Security headers
│   │
│   ├── utils/                     # Shared utilities
│   │   ├── constants.ts          # Application constants
│   │   ├── errors.ts             # Custom error classes
│   │   ├── validation.ts         # Validation schemas
│   │   ├── logger.ts             # Winston logger setup
│   │   ├── cache.ts              # Redis caching utilities
│   │   ├── email.ts              # Email utilities
│   │   ├── upload.ts             # File upload utilities
│   │   ├── crypto.ts             # Encryption utilities
│   │   ├── date.ts               # Date manipulation
│   │   └── helpers.ts            # General helpers
│   │
│   └── types/                     # TypeScript type definitions
│       ├── index.ts              # Type exports
│       ├── auth.ts               # Authentication types
│       ├── user.ts               # User types
│       ├── property.ts           # Property types
│       ├── booking.ts            # Booking types
│       ├── payment.ts            # Payment types
│       ├── review.ts             # Review types
│       ├── admin.ts              # Admin types
│       └── common.ts             # Common types
│
├── tests/                         # Test files
│   ├── setup.ts                  # Test environment setup
│   ├── helpers/                  # Test utilities
│   │   ├── database.ts          # Test database setup
│   │   ├── auth.ts              # Auth test helpers
│   │   └── fixtures.ts          # Test data fixtures
│   ├── unit/                     # Unit tests
│   │   ├── services/            # Service layer tests
│   │   ├── models/              # Model tests
│   │   └── utils/               # Utility tests
│   ├── integration/              # Integration tests
│   │   ├── auth/                # Auth flow tests
│   │   ├── user/                # User API tests
│   │   ├── property/            # Property API tests
│   │   ├── booking/             # Booking API tests
│   │   ├── payment/             # Payment API tests
│   │   ├── review/              # Review API tests
│   │   └── admin/               # Admin API tests
│   └── e2e/                      # End-to-end tests
│       ├── user-journey.test.ts # Complete user flows
│       ├── booking-flow.test.ts # Booking workflows
│       └── payment-flow.test.ts # Payment workflows
│
├── scripts/                       # Utility scripts
│   ├── seed-database.ts          # Database seeding
│   ├── migrate-database.ts       # Database migrations
│   ├── cleanup-uploads.ts        # File cleanup
│   ├── generate-test-data.ts     # Test data generation
│   └── backup-database.ts        # Database backup
│
├── uploads/                       # Local file uploads (development)
│   └── .gitkeep
│
└── logs/                         # Application logs
    ├── app.log                   # Application logs
    ├── error.log                 # Error logs
    └── access.log                # Access logs
```

## Key Design Principles

### 1. Separation of Concerns

- **GraphQL Layer**: API interface and schema definition
- **Service Layer**: Business logic and data processing
- **Model Layer**: Database interaction and validation
- **Utility Layer**: Shared functionality and helpers

### 2. Modular Architecture

Each feature (user, property, booking, etc.) has its own:

- GraphQL schema and resolvers
- Service classes
- Database models
- Test suites

### 3. Configuration Management

- Environment-based configuration
- Secrets management
- Service configuration isolation
- Development vs production settings

### 4. Testing Strategy

- Unit tests for service layer
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Test data fixtures and helpers

### 5. Development Workflow

- TypeScript for type safety
- ESLint and Prettier for code quality
- Husky for pre-commit hooks
- Jest for testing framework
- Docker for consistent environments

This structure ensures maintainability, scalability, and clear separation of responsibilities while remaining simple enough for a monolithic architecture.
