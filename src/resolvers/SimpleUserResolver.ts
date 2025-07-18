import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../types";
import { Context } from "../lib/context";
import { UserInput } from "../types/inputs";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

@Resolver(() => User)
export class SimpleUserResolver {
    @Query(() => [User])
    async users(@Ctx() { db }: Context): Promise<User[]> {
        const allUsers = await db.select().from(users).limit(10);
        return allUsers as any;
    }

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => String) id: string, @Ctx() { db }: Context): Promise<User | null> {
        const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
        return (user[0] as any) || null;
    }

    @Mutation(() => User)
    async createUser(@Arg("input", () => UserInput) input: UserInput, @Ctx() { db }: Context): Promise<User> {
        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

        if (existingUser.length > 0) {
            throw new Error("User already exists");
        }

        // Create user (in real app, hash password)
        const newUsers = await db
            .insert(users)
            .values({
                email: input.email,
                password: input.password, // In real app, hash this
                firstName: input.firstName,
                lastName: input.lastName,
                isHost: false,
                isVerified: false,
            })
            .returning();

        return newUsers[0] as any;
    }
}
