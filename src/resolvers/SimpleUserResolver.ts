import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../types";
import { Context } from "../types/context";
import { UserInput } from "../types/inputs";

@Resolver(() => User)
export class SimpleUserResolver {
    @Query(() => [User])
    async users(@Ctx() { prisma }: Context = {} as Context): Promise<User[]> {
        return (await prisma.user.findMany({
            take: 10,
        })) as any;
    }

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => String) id: string, @Ctx() { prisma }: Context = {} as Context): Promise<User | null> {
        return (await prisma.user.findUnique({
            where: { id },
        })) as any;
    }

    @Mutation(() => User)
    async createUser(@Arg("input", () => UserInput) input: UserInput, @Ctx() { prisma }: Context = {} as Context): Promise<User> {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        // Create user (in real app, hash password)
        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: input.password, // In real app, hash this
                firstName: input.firstName,
                lastName: input.lastName,
                isHost: false,
                isVerified: false,
            },
        });

        return user as any;
    }
}
