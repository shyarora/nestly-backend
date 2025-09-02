# Feature Specifications Overview

Nestly backend consists of 6 core modules, each with specific responsibilities and clear boundaries.

## 📋 Feature Modules

### 1. [Authentication & Authorization](./auth.md)

JWT + OAuth2 authentication with role-based access control.

- **Operations**: register, login, refreshToken, googleAuth, githubAuth
- **Models**: User, RefreshToken
- **Features**: Email verification, password reset, rate limiting

### 2. [User Management](./users.md)

User profiles, host verification, and account management.

- **Operations**: updateProfile, uploadAvatar, becomeHost, deleteAccount
- **Models**: User, HostProfile, VerificationDocument
- **Features**: Avatar upload, host verification, profile completeness

### 3. [Property Management](./properties.md)

Property listings, image galleries, search, and availability.

- **Operations**: createProperty, updateProperty, uploadImages, updateAvailability
- **Models**: Property, PropertyImage, AvailabilitySlot, Address
- **Features**: Multi-image upload, geolocation search, availability calendar

### 4. [Booking System](./bookings.md)

Reservation management, conflict prevention, and workflow.

- **Operations**: createBooking, updateBookingStatus, cancelBooking
- **Models**: Booking, BookingStatus, PaymentStatus
- **Features**: Date conflict prevention, pricing calculation, status workflow

### 5. [Payment Integration](./payments.md)

Razorpay integration for payments, payouts, and refunds.

- **Operations**: createPaymentOrder, verifyPayment, processHostPayout
- **Models**: Payment, Payout, Refund
- **Features**: Secure payments, host payouts, refund processing

### 6. [Review System](./reviews.md)

Bidirectional reviews with rating aggregation and moderation.

- **Operations**: createReview, respondToReview, moderateReview
- **Models**: Review, ReviewType, ModerationAction
- **Features**: Guest/host reviews, photo uploads, rating aggregation

### 7. [Admin Panel](./admin.md)

Administrative tools for user/content moderation and analytics.

- **Operations**: adminUsers, adminProperties, suspendUser, adminAnalytics
- **Models**: AdminAction, Analytics
- **Features**: User moderation, content approval, system analytics

## 🏗️ Architecture Principles

### TypeScript with Decorators

- **@Injectable()** for dependency injection
- **@Resolver()** for GraphQL resolvers
- **@Entity()** for database models
- **@Field()** for GraphQL schema
- **@UseGuards()** for authentication

### GraphQL Schema Organization

```
src/graphql/schemas/
├── user.graphql          # User and auth types
├── property.graphql      # Property and search types
├── booking.graphql       # Booking and calendar types
├── payment.graphql       # Payment and transaction types
├── review.graphql        # Review and rating types
└── admin.graphql         # Admin and analytics types
```

### Implementation Order

1. **Phase 1**: Authentication & User Management
2. **Phase 2**: Property Management
3. **Phase 3**: Booking System
4. **Phase 4**: Payment Integration
5. **Phase 5**: Review System
6. **Phase 6**: Admin Panel

Each feature is designed to be:

- **Independent**: Can be implemented and tested separately
- **Modular**: Clear boundaries and responsibilities
- **Scalable**: Optimized for performance and growth
- **Type-Safe**: Full TypeScript coverage with decorators
