import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class PropertyFilters {
    @Field(() => String, { nullable: true })
    search?: string;

    @Field(() => String, { nullable: true })
    location?: string;

    @Field(() => Float, { nullable: true })
    minPrice?: number;

    @Field(() => Float, { nullable: true })
    maxPrice?: number;

    @Field(() => String, { nullable: true })
    propertyType?: string;

    @Field(() => String, { nullable: true })
    roomType?: string;

    @Field(() => Int, { nullable: true })
    guests?: number;

    @Field(() => Int, { nullable: true })
    bedrooms?: number;

    @Field(() => Float, { nullable: true })
    bathrooms?: number;

    @Field(() => Int, { defaultValue: 20 })
    limit?: number;

    @Field(() => Int, { defaultValue: 0 })
    offset?: number;
}

@InputType()
export class CreatePropertyInput {
    @Field(() => String)
    title!: string;

    @Field(() => String)
    description!: string;

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

    @Field(() => Int, { defaultValue: 1 })
    minimumStay?: number;

    @Field(() => Int, { nullable: true })
    maximumStay?: number;
}

@InputType()
export class UserInput {
    @Field(() => String)
    email!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String)
    password!: string;
}

@InputType()
export class CreateBookingInput {
    @Field(() => String)
    propertyId!: string;

    @Field(() => Date)
    checkIn!: Date;

    @Field(() => Date)
    checkOut!: Date;

    @Field(() => Int)
    guests!: number;
}

@InputType()
export class CreateReviewInput {
    @Field(() => String)
    bookingId!: string;

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
}
