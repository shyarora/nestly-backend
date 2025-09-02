# Payment Integration (Razorpay)

## Core Requirements

- Secure payment processing for bookings
- Host payout management
- Refund processing
- Transaction tracking

## Key Operations

```typescript
// GraphQL Operations
createPaymentOrder(bookingId: ID): PaymentOrder
verifyPayment(input: PaymentVerificationInput): Booking
processHostPayout(bookingId: ID): Payout
requestRefund(bookingId: ID, amount: Number): Refund
```

## Data Models

```typescript
@Entity("payments")
class Payment {
  @Field(() => ID) id: string;
  @Field() bookingId: string;
  @Field() razorpayOrderId: string;
  @Field() razorpayPaymentId?: string;
  @Field() amount: number;
  @Field() currency: string;
  @Field(() => PaymentStatus) status: PaymentStatus;
  @Field() createdAt: Date;
  @Field() verifiedAt?: Date;
}

@Entity("payouts")
class Payout {
  @Field(() => ID) id: string;
  @Field() hostId: string;
  @Field() bookingId: string;
  @Field() amount: number;
  @Field() platformFee: number;
  @Field() netAmount: number;
  @Field(() => PayoutStatus) status: PayoutStatus;
  @Field() razorpayPayoutId?: string;
}
```

## Business Rules

- Platform fee: 3% per booking
- Host payout: 24 hours after guest check-in
- Refund processing: Within 5-7 business days
- Payment verification via webhook
