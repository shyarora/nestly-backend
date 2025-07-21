# Nestly Backend - Airbnb Clone Project Plan

## 🎯 Project Overview

**Nestly** is an Airbnb-like platform backend built with Node.js and GraphQL, featuring Google authentication and Razorpay payment integration.

## 🏗️ System Architecture

### Tech Stack

-   **Runtime**: Node.js with TypeScript
-   **API Layer**: GraphQL with Apollo Server
-   **Database**: PostgreSQL with Drizzle ORM
-   **Authentication**: Google OAuth 2.0 (no custom auth management)
-   **Payments**: Razorpay integration
-   **File Storage**: Direct image links (no static hosting)
-   **Email**: SendGrid or OCI Email Delivery for notifications

## 🏛️ System Architecture & Design Principles

### Database Architecture Strategy

-   **PostgreSQL**: Primary database for ACID compliance and complex queries
-   **Drizzle ORM**: Type-safe SQL with performance focus, better control over queries
-   **Connection Pooling**: Built-in connection pooling for production
-   **Database Migrations**: Version-controlled schema changes with Drizzle migrations

### Core Domain Entities

The system will be built around these primary business entities:

-   **Users**: Google OAuth-only authentication with profile management
-   **Properties**: Rental listings with geospatial data and rich metadata
-   **Bookings**: Reservation system with conflict resolution and state management
-   **Payments**: Razorpay integration with order tracking and refund handling
-   **Reviews**: Bidirectional rating system between guests and hosts
-   **Messages**: Basic messaging system tied to booking contexts

### Why Drizzle Over Prisma?

1. **Performance**: Direct SQL generation, no runtime overhead
2. **Type Safety**: Full TypeScript inference without code generation
3. **Control**: Fine-grained query control and optimization
4. **Migration Strategy**: Simple, version-controlled migration system
5. **Bundle Size**: Smaller footprint for cloud deployments
6. **SQL Flexibility**: Raw SQL when needed without ORM limitations

## 🔐 Authentication Strategy

### Google OAuth 2.0 Implementation

1. **No Custom User Registration**: Users can only sign up via Google
2. **JWT Token Management**: Generate JWT after Google verification
3. **Session Management**: Store sessions with JWT expiration
4. **Profile Completion**: Prompt users to complete profile after first login

### Security Measures

-   Rate limiting on all endpoints
-   CORS configuration
-   Input validation and sanitization
-   SQL injection prevention with Drizzle
-   XSS protection

## 💳 Payment Integration (Razorpay)

### Payment Flow

1. **Create Order**: Generate Razorpay order when booking is initiated
2. **Payment Processing**: Handle payment confirmation via webhooks
3. **Payment History**: Track all payment transactions

### Razorpay Features to Implement

-   Order creation
-   Payment capture
-   Webhook handling
-   Payment link generation (for special cases)

## 📡 GraphQL API Design

### High-Level API Structure

-   **Queries**: Property search, user data, booking history, reviews
-   **Mutations**: Authentication, property management, booking operations, payments
-   **Input Validation**: Comprehensive validation for all operations
-   **Error Handling**: Structured error responses with proper HTTP codes

### Core API Features

-   Property search and filtering
-   User authentication and profile management
-   Booking creation and management
-   Payment processing
-   Review system
-   Basic messaging between guests and hosts

## 🔄 Core Business Logic

### 1. Property Management

-   **Search & Discovery**: Location-based search, filtering, sorting
-   **Property Listings**: CRUD operations for hosts
-   **Media Management**: Direct image links storage
-   **Availability Management**: Calendar-based availability system with date-specific pricing
-   **Pricing Strategy**: Base price, seasonal rates, weekend premiums, special event pricing
-   **Property Rules**: Check-in/check-out times, house rules, guest requirements

### 2. Booking System

-   **Availability Validation**: Prevent double bookings with real-time availability checking
-   **Dynamic Pricing Engine**: Date-based pricing with seasonal rates and demand pricing
-   **Price Calendar**: Display pricing for each date in a date range
-   **Booking Lifecycle**: Pending → Confirmed → Completed
-   **Date Range Validation**: Minimum/maximum stay requirements
-   **Guest Capacity Management**: Enforce maximum guest limits per property
-   **Instant Booking**: Automatic confirmation for qualified bookings
-   **Booking Conflicts Resolution**: Advanced conflict detection and prevention
-   **Special Rates**: Weekend rates, holiday pricing, long-stay discounts

### 3. Payment Processing

-   **Secure Transactions**: Razorpay integration for Indian market
-   **Full Payment Collection**: Complete payment processing at booking time
-   **Payment Tracking**: Complete audit trail for all transactions
-   **Payment Status Management**: Real-time payment status updates

### 4. Review System

-   **Mutual Reviews**: Both guests and hosts can review
-   **Review Validation**: Only after completed stays
-   **Rating Aggregation**: Calculate overall property ratings
-   **Content Moderation**: Basic review filtering

### 5. Communication

-   **Basic Messaging**: Text-based communication between users
-   **Notification System**: Email notifications for important events
-   **Message Persistence**: Store conversation history

## 🚀 Development Strategy

### Phase-Based Development

1. **Foundation**: Authentication, database setup, basic GraphQL server
2. **Core Features**: Property management, search functionality
3. **Booking System**: Reservation logic, availability management
4. **Payment Integration**: Razorpay setup, webhook handling
5. **Advanced Features**: Reviews, messaging, notifications
6. **Testing & Deployment**: Comprehensive testing, OCI deployment

## ☁️ Cloud Infrastructure (OCI)

### Deployment Architecture

-   **Compute**: OCI VM instances for backend application
-   **Database**: PostgreSQL on OCI VM with automated backups
-   **Frontend**: GitHub Pages for static frontend deployment
-   **Email**: OCI Email Delivery service for notifications

### OCI Services Utilization

-   **Compute Instance**: Backend Node.js application hosting
-   **Block Storage**: Database storage with encryption
-   **Email Delivery**: Transactional email sending

### Containerization Strategy

-   **Backend Application**: Dockerized Node.js application
-   **Container Registry**: OCI Container Registry for image storage
-   **Deployment**: Docker containers on OCI VM instances
-   **Database**: Separate PostgreSQL instance (not containerized)
-   **Container Benefits**: Consistent environments, easy scaling, simplified deployment

### Deployment Benefits

-   **Cost Effective**: OCI competitive pricing for startups
-   **Scalability**: Easy horizontal scaling with additional instances
-   **Security**: Built-in security features and compliance
-   **Integration**: Seamless integration between OCI services
-   **GitHub Pages**: Free static hosting for frontend

## 🧪 Testing Strategy

### Testing Approach

-   **End-to-End Testing**: Frontend testing with Playwright
-   **User Journey Testing**: Complete user flows from frontend
-   **Payment Flow Testing**: Razorpay integration via frontend
-   **Authentication Testing**: OAuth flow validation via frontend

## 📋 Environment Configuration

### Required Environment Variables

-   Database connection strings
-   Google OAuth credentials
-   Razorpay API keys
-   JWT secrets
-   Email service configuration

## 🎯 Success Metrics

### Business KPIs

-   User onboarding completion rate
-   Property listing success rate
-   Booking conversion rate
-   Payment transaction success rate

---

This high-level plan provides a strategic roadmap for building your Airbnb-like backend with a focus on architectural decisions, technology choices, and business logic without diving into implementation details. The modular approach allows for detailed documentation to be created separately for each domain as development progresses.
