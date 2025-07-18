import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Property, PropertyImage, Amenity } from "../types";
import { Context } from "../lib/context";
import { PropertyFilters, CreatePropertyInput } from "../types/inputs";
import { properties, users, propertyImages, amenities, propertyAmenities } from "../db/schema";
import { eq, like, and, gte, lte, desc } from "drizzle-orm";

@Resolver(() => Property)
export class SimplePropertyResolver {
    @Query(() => [Property])
    async properties(
        @Ctx() { db }: Context,
        @Arg("filters", () => PropertyFilters, { nullable: true })
        filters?: PropertyFilters,
    ): Promise<Property[]> {
        let whereConditions: any[] = [];

        if (filters) {
            if (filters.search) {
                whereConditions.push(
                    // Using OR conditions for search
                    like(properties.title, `%${filters.search}%`),
                );
            }

            if (filters.location) {
                whereConditions.push(like(properties.city, `%${filters.location}%`));
            }

            if (filters.minPrice) {
                whereConditions.push(gte(properties.pricePerNight, filters.minPrice.toString()));
            }

            if (filters.maxPrice) {
                whereConditions.push(lte(properties.pricePerNight, filters.maxPrice.toString()));
            }

            if (filters.propertyType) {
                whereConditions.push(eq(properties.propertyType, filters.propertyType));
            }

            if (filters.roomType) {
                whereConditions.push(eq(properties.roomType, filters.roomType));
            }

            if (filters.guests) {
                whereConditions.push(gte(properties.maxGuests, filters.guests));
            }

            if (filters.bedrooms) {
                whereConditions.push(gte(properties.bedrooms, filters.bedrooms));
            }

            if (filters.bathrooms) {
                whereConditions.push(gte(properties.bathrooms, filters.bathrooms));
            }
        }

        const propertiesList = await db
            .select()
            .from(properties)
            .leftJoin(users, eq(properties.hostId, users.id))
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
            .orderBy(desc(properties.createdAt))
            .limit(filters?.limit || 20)
            .offset(filters?.offset || 0);

        // Transform to match GraphQL schema
        return propertiesList.map(({ properties: property, users: host }) => ({
            ...property,
            host,
            images: [], // Will be loaded separately if needed
            amenities: [], // Will be loaded separately if needed
            bookings: [],
            reviews: [],
        })) as any;
    }

    @Query(() => Property, { nullable: true })
    async property(@Ctx() { db }: Context, @Arg("id", () => String) id: string): Promise<Property | null> {
        const propertyResult = await db.select().from(properties).leftJoin(users, eq(properties.hostId, users.id)).where(eq(properties.id, id)).limit(1);

        if (propertyResult.length === 0) return null;

        const { properties: property, users: host } = propertyResult[0];

        // Get property images
        const images = await db.select().from(propertyImages).where(eq(propertyImages.propertyId, id)).orderBy(propertyImages.order);

        return {
            ...property,
            host,
            images,
            amenities: [], // Will be loaded separately if needed
            bookings: [],
            reviews: [],
        } as any;
    }

    @Mutation(() => Property)
    async createProperty(@Ctx() { db, user }: Context, @Arg("input", () => CreatePropertyInput) input: CreatePropertyInput): Promise<Property> {
        if (!user?.id) {
            throw new Error("Authentication required");
        }

        const newProperties = await db
            .insert(properties)
            .values({
                title: input.title,
                description: input.description,
                hostId: user.id,
                propertyType: input.propertyType,
                roomType: input.roomType,
                maxGuests: input.maxGuests,
                bedrooms: input.bedrooms,
                bathrooms: input.bathrooms,
                pricePerNight: input.pricePerNight.toString(),
                cleaningFee: input.cleaningFee?.toString(),
                serviceFee: input.serviceFee?.toString(),
                city: input.city,
                state: input.state,
                country: input.country,
                address: input.address,
                latitude: input.latitude?.toString(),
                longitude: input.longitude?.toString(),
                minimumStay: input.minimumStay || 1,
                maximumStay: input.maximumStay || 30,
            })
            .returning();

        const property = newProperties[0];

        // Get the host information
        const host = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

        return {
            ...property,
            host: host[0],
            images: [],
            amenities: [],
            bookings: [],
            reviews: [],
        } as any;
    }
}
