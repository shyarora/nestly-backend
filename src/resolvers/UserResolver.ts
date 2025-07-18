import { Resolver, Query, Mutation, Arg, Ctx, Authorized, InputType, Field } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { User } from "../types";
import { Context } from "../lib/context";
import { users } from "../db/schema";

@InputType()
class RegisterInput {
    @Field(() => String)
    @IsEmail()
    email!: string;

    @Field(() => String)
    @MinLength(6)
    password!: string;

    @Field(() => String)
    firstName!: string;

    @Field(() => String)
    lastName!: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => Boolean, { defaultValue: false })
    isHost!: boolean;
}

@InputType()
class LoginInput {
    @Field(() => String)
    @IsEmail()
    email!: string;

    @Field(() => String)
    password!: string;
}

@InputType()
class UpdateProfileInput {
    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;

    @Field(() => String, { nullable: true })
    bio?: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => String, { nullable: true })
    avatar?: string;
}

@Resolver(User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    @Authorized()
    async me(@Ctx() { user, db }: Context): Promise<User | null> {
        if (!user) return null;

        const result = await db.query.users.findFirst({
            where: eq(users.id, user.id),
            with: {
                hostedProperties: true,
                bookings: true,
                reviews: true,
            },
        });

        return result as User | null;
    }

    @Query(() => [User])
    async users(@Ctx() { db }: Context): Promise<User[]> {
        return await db.select().from(users).orderBy(users.createdAt);
    }

    @Query(() => User, { nullable: true })
    async user(@Arg("id", () => String) id: string, @Ctx() { db }: Context): Promise<User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.id, id),
            with: {
                hostedProperties: true,
                reviews: true,
            },
        });

        return result as unknown as User | null;
    }

    @Mutation(() => String)
    async register(@Arg("input", () => RegisterInput) input: RegisterInput, @Ctx() { db }: Context): Promise<string> {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, input.email),
        });

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create user
        const newUsers = await db
            .insert(users)
            .values({
                email: input.email,
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
                phoneNumber: input.phoneNumber,
                isHost: input.isHost,
            })
            .returning();

        const user = newUsers[0];

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        return token;
    }

    @Mutation(() => String)
    async login(@Arg("input", () => LoginInput) input: LoginInput, @Ctx() { db }: Context): Promise<string> {
        // Find user
        const user = await db.query.users.findFirst({
            where: eq(users.email, input.email),
        });

        if (!user || !user.password) {
            throw new Error("Invalid email or password");
        }

        // Check password
        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
            throw new Error("Invalid email or password");
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        return token;
    }

    @Mutation(() => User)
    @Authorized()
    async updateProfile(@Arg("input", () => UpdateProfileInput) input: UpdateProfileInput, @Ctx() { user, db }: Context): Promise<User> {
        if (!user) {
            throw new Error("Not authenticated");
        }

        const updatedUsers = await db
            .update(users)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning();

        return updatedUsers[0] as unknown as User;
    }

    @Mutation(() => User)
    @Authorized()
    async becomeHost(@Ctx() { user, db }: Context): Promise<User> {
        if (!user) {
            throw new Error("Not authenticated");
        }

        const updatedUsers = await db
            .update(users)
            .set({
                isHost: true,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning();

        return updatedUsers[0] as unknown as User;
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteAccount(@Ctx() { user, db }: Context): Promise<boolean> {
        if (!user) {
            throw new Error("Not authenticated");
        }

        await db.delete(users).where(eq(users.id, user.id));

        return true;
    }
}
