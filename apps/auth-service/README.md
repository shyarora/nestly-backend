# Auth Service

A robust authentication service implementing Google OAuth with JWT-based security for the Nestly platform.

## Features

- ✅ **Google OAuth Integration**: Secure authentication using Google OAuth 2.0
- ✅ **JWT Token Management**: Access and refresh token generation with configurable expiration
- ✅ **Role-Based Authorization**: User roles stored and maintained in database
- ✅ **GraphQL API**: Type-safe API with generated TypeScript types
- ✅ **User Profile Management**: Complete user profile storage and retrieval
- ✅ **Production Ready**: Error handling, validation, and security best practices

## Architecture

### Technology Stack

- **Apollo Server 4**: GraphQL server implementation
- **Fastify**: High-performance web framework
- **TypeScript**: Type-safe development with GraphQL Codegen
- **Drizzle ORM**: Type-safe database operations
- **Google Auth Library**: Official Google OAuth client
- **JWT**: Stateless authentication tokens

### Authentication Flow

1. Client initiates Google OAuth
2. Google returns ID token to client
3. Client sends ID token to auth service
4. Service verifies token with Google
5. Service creates/updates user profile
6. Service returns JWT access & refresh tokens
7. Client uses JWT for subsequent API calls

## API Reference

### GraphQL Schema

```graphql
type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    avatar: String
    roles: [String!]!
    createdAt: String!
    updatedAt: String!
}

type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
}

input GoogleAuthInput {
    googleIdToken: String!
}

type Query {
    # Authentication
    me: User
    validateToken: Boolean!

    # Health checks
    livez: String!
    readyz: String!
    hello: String!
}

type Mutation {
    # Authentication
    googleAuth(input: GoogleAuthInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    logout: Boolean!

    # Admin only
    updateUserRoles(userId: ID!, roles: [String!]!): User!
}
```

### Examples

#### Google Authentication

```graphql
mutation GoogleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
        user {
            id
            email
            firstName
            lastName
            roles
        }
        accessToken
        refreshToken
    }
}
```

#### Get Current User

```graphql
query Me {
    me {
        id
        email
        firstName
        lastName
        roles
    }
}
```

#### Refresh Token

```graphql
mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
        user {
            id
            email
            roles
        }
        accessToken
        refreshToken
    }
}
```

## Environment Configuration

### Required Environment Variables

```env
# Server Configuration
PORT=5002
HOST=localhost
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=30d

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nestly_db
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs for your application
6. Copy Client ID and Client Secret to environment variables

## Usage

### Development

```bash
# Install dependencies
pnpm install

# Generate GraphQL types
pnpm codegen

# Start development server
pnpm dev

# Type checking
pnpm type-check
```

### Production

```bash
# Build application
pnpm build

# Start production server
pnpm start
```

## Security Features

### JWT Security

- Configurable token expiration
- Separate access and refresh tokens
- Automatic token validation on protected routes

### Role-Based Access Control

- User roles stored in database
- Admin-only operations protected
- Role updates require admin privileges

### Input Validation

- Google token verification
- GraphQL schema validation
- Database constraint enforcement

## Database Schema

The service uses the following user schema:

```typescript
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    googleId: varchar("google_id", { length: 255 }).unique(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatar: text("avatar"),
    phone: varchar("phone", { length: 20 }),
    roles: jsonb("roles").$type<string[]>().default(["user"]),
    isEmailVerified: boolean("is_email_verified").default(false),
    isPhoneVerified: boolean("is_phone_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
```

## Authorization Header

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The service implements comprehensive error handling:

- **UNAUTHENTICATED**: No valid authentication provided
- **AUTHENTICATION_ERROR**: Invalid credentials or token verification failed
- **FORBIDDEN**: Insufficient permissions for requested operation
- **INTERNAL_ERROR**: Server-side errors with detailed logging

## Health Checks

The service provides health check endpoints for monitoring:

- `GET /livez`: Liveness probe
- `GET /readyz`: Readiness probe
- GraphQL `livez` and `readyz` queries

## Integration

This auth service integrates with:

- **API Gateway**: For request routing and authentication
- **Database Package**: For shared database schemas and connections
- **Common Package**: For shared types and utilities

## Contributing

1. Ensure TypeScript types are properly generated with `pnpm codegen`
2. Follow the existing code patterns and error handling
3. Add proper JSDoc comments for public methods
4. Maintain 100% type safety - avoid `any` types

## License

This project is part of the Nestly platform.
