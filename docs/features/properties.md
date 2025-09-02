# Property Management

## Core Requirements

- Property CRUD with image galleries
- Search and filtering capabilities
- Availability calendar management
- Pricing and amenities

## Key Operations

```typescript
// GraphQL Operations
properties(filter: PropertyFilter, pagination: PaginationInput): PropertyConnection
createProperty(input: CreatePropertyInput): Property
updateProperty(id: ID, input: UpdatePropertyInput): Property
uploadPropertyImages(propertyId: ID, files: [Upload]): [PropertyImage]
updateAvailability(propertyId: ID, calendar: [AvailabilityInput]): Property
```

## Data Models

```typescript
@Entity("properties")
class Property {
  @Field(() => ID) id: string;
  @Field() hostId: string;
  @Field() title: string;
  @Field() description: string;
  @Field(() => PropertyType) propertyType: PropertyType;
  @Field() maxGuests: number;
  @Field() bedrooms: number;
  @Field() bathrooms: number;
  @Field(() => Address) address: Address;
  @Field(() => [Amenity]) amenities: Amenity[];
  @Field(() => [PropertyImage]) images: PropertyImage[];
  @Field() basePrice: number;
  @Field() isActive: boolean;
}

@Entity("availability_slots")
class AvailabilitySlot {
  @Field() propertyId: string;
  @Field() date: Date;
  @Field() isAvailable: boolean;
  @Field() price?: number; // override base price
  @Field() minimumStay: number;
}
```

## Business Rules

- Max 20 images per property
- Image formats: JPG, PNG, WebP (max 10MB each)
- Automatic availability blocking on booking
- Price overrides for special dates/seasons
