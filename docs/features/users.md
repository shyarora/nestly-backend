# User Management

## Core Requirements

- User profiles with avatar upload
- Host profile with additional verification
- Account settings and preferences
- User verification system

## Key Operations

```typescript
// GraphQL Operations
me(): User
updateProfile(input: UpdateProfileInput): User
uploadAvatar(file: Upload): User
becomeHost(input: HostProfileInput): User
deleteAccount(): Boolean
```

## Data Models

```typescript
@Entity("users")
class User {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() avatar?: string;
  @Field(() => UserRole) role: UserRole;
  hostProfile?: HostProfile;
}

@Entity("host_profiles")
class HostProfile {
  @Field(() => ID) id: string;
  @Field() userId: string;
  @Field() bio: string;
  @Field(() => [String]) languages: string[];
  @Field() responseTime: number; // hours
  @Field() responseRate: number; // percentage
  @Field() isSuperhost: boolean;
  @Field(() => VerificationStatus) verificationStatus: VerificationStatus;
}
```

## Business Rules

- Avatar max size: 5MB, formats: JPG, PNG, WebP
- Host verification required for listing properties
- Profile completeness affects search ranking
