import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Property, PropertyImage, Amenity } from "../types";
import { Context } from "../types/context";
import { PropertyFilters, CreatePropertyInput } from "../types/inputs";

@Resolver(() => Property)
export class SimplePropertyResolver {
    @Query(() => [Property])
    async properties(
        @Arg("filters", () => PropertyFilters, { nullable: true })
        filters?: PropertyFilters,
        @Ctx() { prisma }: Context = {} as Context,
    ): Promise<Property[]> {
        let whereClause: any = {};

        if (filters) {
            if (filters.search) {
                whereClause.OR = [
                    { title: { contains: filters.search } },
                    { description: { contains: filters.search } },
                    { city: { contains: filters.search } },
                    { state: { contains: filters.search } },
                    { country: { contains: filters.search } },
                ];
            }

            if (filters.location) {
                whereClause.OR = [
                    { city: { contains: filters.location } },
                    { state: { contains: filters.location } },
                    { country: { contains: filters.location } },
                    { address: { contains: filters.location } },
                ];
            }

            if (filters.minPrice) {
                whereClause.pricePerNight = { gte: filters.minPrice };
            }

            if (filters.maxPrice) {
                whereClause.pricePerNight = {
                    ...whereClause.pricePerNight,
                    lte: filters.maxPrice,
                };
            }

            if (filters.propertyType) {
                whereClause.propertyType = filters.propertyType;
            }

            if (filters.roomType) {
                whereClause.roomType = filters.roomType;
            }

            if (filters.guests) {
                whereClause.maxGuests = { gte: filters.guests };
            }

            if (filters.bedrooms) {
                whereClause.bedrooms = { gte: filters.bedrooms };
            }

            if (filters.bathrooms) {
                whereClause.bathrooms = { gte: filters.bathrooms };
            }
        }

        const properties = await prisma.property.findMany({
            where: whereClause,
            include: {
                host: true,
                images: {
                    orderBy: { order: "asc" },
                },
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
            take: filters?.limit || 20,
            skip: filters?.offset || 0,
            orderBy: { createdAt: "desc" },
        });

        // Transform to match GraphQL schema
        return properties.map(property => ({
            ...property,
            amenities: property.amenities.map(pa => pa.amenity),
        })) as any;
    }

    @Query(() => Property, { nullable: true })
    async property(@Arg("id", () => String) id: string, @Ctx() { prisma }: Context = {} as Context): Promise<Property | null> {
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                host: true,
                images: {
                    orderBy: { order: "asc" },
                },
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        if (!property) return null;

        return {
            ...property,
            amenities: property.amenities.map(pa => pa.amenity),
        } as any;
    }

    @Mutation(() => Property)
    async createProperty(
        @Arg("input", () => CreatePropertyInput) input: CreatePropertyInput,
        @Ctx() { userId, prisma }: Context = {} as Context,
    ): Promise<Property> {
        if (!userId) {
            throw new Error("Authentication required");
        }

        const property = await prisma.property.create({
            data: {
                ...input,
                hostId: userId,
            },
            include: {
                host: true,
                images: true,
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        return {
            ...property,
            amenities: property.amenities.map(pa => pa.amenity),
        } as any;
    }
}
