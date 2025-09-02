# Admin Panel

## Core Requirements

- User and property moderation
- Analytics and reporting
- Content management
- System monitoring

## Key Operations

```typescript
// GraphQL Operations (Admin only)
adminUsers(filter: AdminUserFilter): [User]
adminProperties(filter: AdminPropertyFilter): [Property]
adminAnalytics(period: AnalyticsPeriod): Analytics
suspendUser(userId: ID, reason: String): User
approveProperty(propertyId: ID): Property
```

## Data Models

```typescript
@Entity("admin_actions")
class AdminAction {
  @Field(() => ID) id: string;
  @Field() adminId: string;
  @Field(() => ActionType) action: ActionType;
  @Field(() => TargetType) targetType: TargetType;
  @Field() targetId: string;
  @Field() reason: string;
  @Field() createdAt: Date;
}

interface Analytics {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  revenue: number;
  conversionRate: number;
}
```

## Business Rules

- Admin actions logged and auditable
- Property approval required for new hosts
- User suspension affects active bookings
- Analytics updated daily
