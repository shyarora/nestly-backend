# Review System

## Core Requirements

- Bidirectional reviews (Guest ↔ Host)
- Rating aggregation and display
- Review moderation capabilities
- Photo uploads with reviews

## Key Operations

```typescript
// GraphQL Operations
createReview(input: CreateReviewInput): Review
reviews(propertyId: ID): [Review]
respondToReview(reviewId: ID, response: String): Review
moderateReview(reviewId: ID, action: ModerationAction): Review
```

## Data Models

```typescript
@Entity("reviews")
class Review {
  @Field(() => ID) id: string;
  @Field() bookingId: string;
  @Field() reviewerId: string;
  @Field() revieweeId: string;
  @Field() propertyId?: string;
  @Field(() => ReviewType) type: ReviewType;
  @Field() rating: number; // 1-5
  @Field() comment: string;
  @Field(() => [String]) photos: string[];
  @Field() response?: string;
  @Field() isPublic: boolean;
  @Field() createdAt: Date;
}

enum ReviewType {
  GUEST_TO_HOST = "GUEST_TO_HOST",
  HOST_TO_GUEST = "HOST_TO_GUEST",
}
```

## Business Rules

- Reviews only after completed bookings
- 14-day window for submitting reviews
- Host can respond within 30 days
- Rating aggregation affects search ranking
