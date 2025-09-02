# Authentication & Authorization

## Core Requirements

- JWT access tokens (15min) + refresh tokens (7 days)
- OAuth2 (Google, GitHub) + email/password registration
- Role-based access: Guest, Host, Admin
- Email verification + password reset

## Key Operations

```typescript
// GraphQL Mutations
register(input: RegisterInput): AuthPayload
login(input: LoginInput): AuthPayload
refreshToken(token: String): AuthPayload
googleAuth(code: String): AuthPayload
resetPassword(input: ResetPasswordInput): Boolean
```

## Data Models

```typescript
@Entity("users")
class User {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field(() => UserRole) role: UserRole;
  @Field() isEmailVerified: boolean;
  googleId?: string;
  githubId?: string;
  password: string; // hashed, not exposed
}

@Entity("refresh_tokens")
class RefreshToken {
  @Field(() => ID) id: string;
  @Field() userId: string;
  @Field() token: string;
  @Field() expiresAt: Date;
  @Field() isRevoked: boolean;
}
```

## Business Rules

- Rate limit: 5 login attempts per 15 minutes
- Password: 8+ chars, uppercase, lowercase, number
- Email verification required for activation
- Auto-logout on suspicious activity
