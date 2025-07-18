import { ObjectType, Field, ID, Int, Float, registerEnumType } from "type-graphql";

// Define enums locally since SQLite doesn't support enums
export enum PropertyType {
    HOUSE = "HOUSE",
    APARTMENT = "APARTMENT",
    CONDO = "CONDO",
    VILLA = "VILLA",
    CABIN = "CABIN",
    COTTAGE = "COTTAGE",
    LOFT = "LOFT",
    TOWNHOUSE = "TOWNHOUSE",
    GUESTHOUSE = "GUESTHOUSE",
    HOTEL = "HOTEL",
    UNIQUE = "UNIQUE",
}

export enum RoomType {
    ENTIRE_PLACE = "ENTIRE_PLACE",
    PRIVATE_ROOM = "PRIVATE_ROOM",
    SHARED_ROOM = "SHARED_ROOM",
    HOTEL_ROOM = "HOTEL_ROOM",
}

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
}

export enum AmenityCategory {
    BASICS = "BASICS",
    FEATURES = "FEATURES",
    LOCATION = "LOCATION",
    SAFETY = "SAFETY",
    ACCESSIBILITY = "ACCESSIBILITY",
}

// Register enums for GraphQL
registerEnumType(PropertyType, {
    name: "PropertyType",
});

registerEnumType(RoomType, {
    name: "RoomType",
});

registerEnumType(BookingStatus, {
    name: "BookingStatus",
});

registerEnumType(AmenityCategory, {
    name: "AmenityCategory",
});

@ObjectType()
export class User {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    email!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => Boolean)
    isHost!: boolean;

    @Field(() => Boolean)
    isVerified!: boolean;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    // Relations (loaded when needed)
    @Field(() => [Property], { nullable: true })
    hostedProperties?: Property[];

    @Field(() => [Booking], { nullable: true })
    bookings?: Booking[];

    @Field(() => [Review], { nullable: true })
    reviews?: Review[];
}

@ObjectType()
export class Property {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    title!: string;

    @Field(() => String)
    description!: string;

    @Field(() => String)
    hostId!: string;

    @Field(() => String)
    propertyType!: string;

    @Field(() => String)
    roomType!: string;

    @Field(() => Int)
    maxGuests!: number;

    @Field(() => Int)
    bedrooms!: number;

    @Field(() => Float)
    bathrooms!: number;

    @Field(() => Float)
    pricePerNight!: number;

    @Field(() => Float, { nullable: true })
    cleaningFee?: number;

    @Field(() => Float, { nullable: true })
    serviceFee?: number;

    @Field(() => String)
    city!: string;

    @Field(() => String)
    state!: string;

    @Field(() => String)
    country!: string;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => Float, { nullable: true })
    latitude?: number;

    @Field(() => Float, { nullable: true })
    longitude?: number;

    @Field(() => Int)
    minimumStay!: number;

    @Field(() => Int, { nullable: true })
    maximumStay?: number;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    // Relations
    @Field(() => User)
    host!: User;

    @Field(() => [PropertyImage])
    images!: PropertyImage[];

    @Field(() => [PropertyAmenity])
    amenities!: PropertyAmenity[];

    @Field(() => [Booking], { nullable: true })
    bookings?: Booking[];

    @Field(() => [Review], { nullable: true })
    reviews?: Review[];
}

@ObjectType()
export class PropertyImage {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    propertyId!: string;

    @Field(() => String)
    url!: string;

    @Field(() => String, { nullable: true })
    caption?: string;

    @Field(() => Int)
    order!: number;

    @Field(() => Property)
    property!: Property;
}

@ObjectType()
export class Amenity {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String, { nullable: true })
    icon?: string;

    @Field(() => String)
    category!: string;

    @Field(() => [PropertyAmenity])
    properties!: PropertyAmenity[];
}

@ObjectType()
export class PropertyAmenity {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    propertyId!: string;

    @Field(() => String)
    amenityId!: string;

    @Field(() => Property)
    property!: Property;

    @Field(() => Amenity, { nullable: true })
    amenity?: Amenity;
}

@ObjectType()
export class Booking {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    propertyId!: string;

    @Field(() => String)
    guestId!: string;

    @Field(() => Date)
    checkIn!: Date;

    @Field(() => Date)
    checkOut!: Date;

    @Field(() => Int)
    guests!: number;

    @Field(() => Float)
    totalPrice!: number;

    @Field(() => String)
    status!: string;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    // Relations
    @Field(() => Property)
    property!: Property;

    @Field(() => User)
    guest!: User;
}

@ObjectType()
export class Review {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    bookingId!: string;

    @Field(() => String)
    propertyId!: string;

    @Field(() => String)
    reviewerId!: string;

    @Field(() => String)
    hostId!: string;

    @Field(() => Int)
    rating!: number;

    @Field(() => String, { nullable: true })
    comment?: string;

    @Field(() => Int, { nullable: true })
    accuracy?: number;

    @Field(() => Int, { nullable: true })
    communication?: number;

    @Field(() => Int, { nullable: true })
    cleanliness?: number;

    @Field(() => Int, { nullable: true })
    location?: number;

    @Field(() => Int, { nullable: true })
    checkIn?: number;

    @Field(() => Int, { nullable: true })
    value?: number;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;

    // Relations
    @Field(() => Booking)
    booking!: Booking;

    @Field(() => Property)
    property!: Property;

    @Field(() => User)
    reviewer!: User;

    @Field(() => User)
    host!: User;
}
