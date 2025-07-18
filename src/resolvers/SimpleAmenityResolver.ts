import { Resolver, Query, Ctx } from "type-graphql";
import { Amenity } from "../types";
import { Context } from "../types/context";

@Resolver(() => Amenity)
export class SimpleAmenityResolver {
    @Query(() => [Amenity])
    async amenities(@Ctx() { prisma }: Context = {} as Context): Promise<Amenity[]> {
        return (await prisma.amenity.findMany()) as any;
    }
}
