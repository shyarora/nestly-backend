import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, users } from "@nestly/database";
import { JwtPayload, GoogleUserInfo, UserModel } from "../types/auth.types.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "859598107417-njrmkug58htpfi7brh4nqc8ivgsbvn49.apps.googleusercontent.com";
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export class AuthService {
    async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error("Invalid Google token payload");
            }

            return {
                sub: payload.sub,
                email: payload.email!,
                given_name: payload.given_name!,
                family_name: payload.family_name!,
                picture: payload.picture,
                email_verified: payload.email_verified!,
            };
        } catch (error) {
            throw new Error(`Google token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async findOrCreateUser(googleUserInfo: GoogleUserInfo): Promise<UserModel> {
        try {
            // Try to find existing user by Google ID first
            let existingUsers = await db.select().from(users).where(eq(users.googleId, googleUserInfo.sub)).limit(1);

            if (existingUsers.length === 0) {
                // If not found by Google ID, try by email
                existingUsers = await db.select().from(users).where(eq(users.email, googleUserInfo.email)).limit(1);
            }

            if (existingUsers.length > 0) {
                const user = existingUsers[0];

                // Update Google ID if it wasn't set
                if (user && !user.googleId && googleUserInfo.sub) {
                    const [updatedUser] = await db
                        .update(users)
                        .set({
                            googleId: googleUserInfo.sub,
                            isEmailVerified: googleUserInfo.email_verified,
                            updatedAt: new Date(),
                        })
                        .where(eq(users.id, user.id))
                        .returning();

                    if (!updatedUser) {
                        throw new Error("Failed to update user");
                    }

                    return this.mapDbUserToModel(updatedUser);
                }

                if (!user) {
                    throw new Error("User not found");
                }

                return this.mapDbUserToModel(user);
            }

            // Create new user
            const [newUser] = await db
                .insert(users)
                .values({
                    email: googleUserInfo.email,
                    googleId: googleUserInfo.sub,
                    firstName: googleUserInfo.given_name,
                    lastName: googleUserInfo.family_name,
                    avatar: googleUserInfo.picture,
                    isEmailVerified: googleUserInfo.email_verified,
                    roles: ["user"], // Default role
                })
                .returning();

            if (!newUser) {
                throw new Error("Failed to create user");
            }

            return this.mapDbUserToModel(newUser);
        } catch (error) {
            throw new Error(`User creation/retrieval failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    private mapDbUserToModel(dbUser: typeof users.$inferSelect): UserModel {
        return {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            avatar: dbUser.avatar,
            phone: dbUser.phone,
            isPhoneVerified: dbUser.isPhoneVerified || false,
            roles: Array.isArray(dbUser.roles) ? (dbUser.roles as string[]) : ["user"],
            createdAt: dbUser.createdAt || new Date(),
            updatedAt: dbUser.updatedAt || new Date(),
        };
    }

    generateAccessToken(user: UserModel): string {
        const payload: Omit<JwtPayload, "iat" | "exp"> = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            isPhoneVerified: user.isPhoneVerified,
            roles: user.roles,
        };

        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    }

    generateRefreshToken(user: UserModel): string {
        const payload: Omit<JwtPayload, "iat" | "exp"> = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            isPhoneVerified: user.isPhoneVerified,
            roles: user.roles,
        };

        return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions);
    }

    verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error) {
            throw new Error(`Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async getUserById(userId: string): Promise<UserModel | null> {
        try {
            const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);

            if (result.length === 0 || !result[0]) {
                return null;
            }

            return this.mapDbUserToModel(result[0]);
        } catch (error) {
            throw new Error(`User retrieval failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async updateUserRoles(userId: string, newRoles: string[]): Promise<UserModel> {
        try {
            const [updatedUser] = await db
                .update(users)
                .set({
                    roles: newRoles,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId))
                .returning();

            if (!updatedUser) {
                throw new Error("User not found");
            }

            return this.mapDbUserToModel(updatedUser);
        } catch (error) {
            throw new Error(`Role update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}
