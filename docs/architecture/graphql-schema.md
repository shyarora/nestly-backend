# GraphQL Schema Organization

## Schema Structure

```
src/graphql/schemas/
├── schema.graphql         # Root schema with imports
├── common.graphql         # Shared types and scalars
├── user.graphql          # User and authentication
├── property.graphql      # Property management
├── booking.graphql       # Booking system
├── payment.graphql       # Payment integration
├── review.graphql        # Review system
└── admin.graphql         # Admin operations
```

## Schema Files Overview

### schema.graphql (Root)

```graphql
#import * from './common.graphql'
#import * from './user.graphql'
#import * from './property.graphql'
#import * from './booking.graphql'
#import * from './payment.graphql'
#import * from './review.graphql'
#import * from './admin.graphql'

type Query {
  # User queries
  me: User!
  userProfile(id: ID!): PublicUser

  # Property queries
  properties(
    filter: PropertyFilter
    pagination: PaginationInput
  ): PropertyConnection!
  property(id: ID!): Property
  searchProperties(input: SearchInput!): PropertyConnection!

  # Booking queries
  booking(id: ID!): Booking
  myBookings(role: UserRole!): [Booking!]!

  # Review queries
  reviews(propertyId: ID!): [Review!]!

  # Admin queries (protected)
  adminAnalytics(period: AnalyticsPeriod!): Analytics! @auth(requires: ADMIN)
}

type Mutation {
  # Auth mutations
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!

  # User mutations
  updateProfile(input: UpdateProfileInput!): User! @auth
  uploadAvatar(file: Upload!): User! @auth

  # Property mutations
  createProperty(input: CreatePropertyInput!): Property! @auth(requires: HOST)
  updateProperty(id: ID!, input: UpdatePropertyInput!): Property! @auth

  # Booking mutations
  createBooking(input: CreateBookingInput!): Booking! @auth
  updateBookingStatus(id: ID!, status: BookingStatus!): Booking! @auth

  # Payment mutations
  createPaymentOrder(bookingId: ID!): PaymentOrder! @auth
  verifyPayment(input: PaymentVerificationInput!): Booking! @auth

  # Review mutations
  createReview(input: CreateReviewInput!): Review! @auth

  # Admin mutations
  suspendUser(userId: ID!, reason: String!): User! @auth(requires: ADMIN)
}

type Subscription {
  bookingUpdated(userId: ID!): Booking! @auth
  paymentStatusChanged(bookingId: ID!): Payment! @auth
}
```

### common.graphql (Shared Types)

```graphql
scalar Date
scalar Upload
scalar JSON

enum UserRole {
  GUEST
  HOST
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

type PaginationInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
  totalCount: Int!
}

input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}

directive @auth(requires: UserRole = GUEST) on FIELD_DEFINITION
directive @rateLimit(max: Int!, window: Int!) on FIELD_DEFINITION
directive @validate(schema: String!) on ARGUMENT_DEFINITION
```

## TypeScript Integration

### Resolver Structure

```typescript
// src/graphql/resolvers/user.resolver.ts
@Resolver(User)
export class UserResolver {
  constructor(
    @Inject("USER_SERVICE") private userService: UserService,
    @Inject("AUTH_SERVICE") private authService: AuthService
  ) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@Context("user") user: User): Promise<User> {
    return this.userService.findById(user.id);
  }

  @Mutation(() => AuthPayload)
  @RateLimit(5, 900) // 5 attempts per 15 minutes
  @ValidateInput(LoginSchema)
  async login(@Args("input") input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }
}
```

### Schema Generation

- **Code-First Approach**: Use TypeGraphQL decorators
- **Schema Stitching**: Combine modular schemas
- **Type Safety**: Full TypeScript integration
- **Validation**: Input validation with class-validator
- **Documentation**: Auto-generated from TypeScript types

## Key Features

### Authentication Directives

```graphql
# Require authentication
@auth

# Require specific role
@auth(requires: HOST)
@auth(requires: ADMIN)
```

### Rate Limiting

```graphql
# 10 requests per minute
@rateLimit(max: 10, window: 60)
```

### Input Validation

```graphql
# Validate with Joi schema
@validate(schema: "CreateBookingSchema")
```

### File Uploads

```graphql
# Handle file uploads
uploadAvatar(file: Upload!): User!
uploadPropertyImages(files: [Upload!]!): [PropertyImage!]!
```

This modular approach ensures:

- **Maintainability**: Each domain has its own schema file
- **Type Safety**: Full TypeScript integration
- **Reusability**: Shared types and directives
- **Documentation**: Self-documenting with GraphQL introspection
