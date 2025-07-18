import { Resolver, Query, Ctx } from "type-graphql";
import { Amenity } from "../types";
import { Context } from "../lib/context";
import { amenities } from "../db/schema";

@Resolver(() => Amenity)
export class SimpleAmenityResolver {
    @Query(() => [Amenity])
    async amenities(@Ctx() { db }: Context): Promise<Amenity[]> {
        const allAmenities = await db.select().from(amenities);
        return allAmenities as any;
    }
}
