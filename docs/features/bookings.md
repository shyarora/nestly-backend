# Booking System

## Core Requirements

- Booking creation with conflict prevention
- Pricing calculations with taxes/fees
- Status workflow management
- Calendar integration

## Key Operations

```typescript
// GraphQL Operations
createBooking(input: CreateBookingInput): Booking
myBookings(role: UserRole): [Booking]
updateBookingStatus(id: ID, status: BookingStatus): Booking
cancelBooking(id: ID, reason: String): Booking
```

## Data Models

```typescript
@Entity("bookings")
class Booking {
  @Field(() => ID) id: string;
  @Field() propertyId: string;
  @Field() guestId: string;
  @Field() hostId: string;
  @Field() checkIn: Date;
  @Field() checkOut: Date;
  @Field() guests: number;
  @Field() totalPrice: number;
  @Field(() => BookingStatus) status: BookingStatus;
  @Field(() => PaymentStatus) paymentStatus: PaymentStatus;
  @Field() paymentId?: string;
  @Field() specialRequests?: string;
}

enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}
```

## Business Rules

- No overlapping bookings for same property
- Host has 24 hours to respond to requests
- Automatic confirmation after payment
- Cancellation policies based on booking date
