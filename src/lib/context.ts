import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export interface Context {
    db: typeof db;
    user?: {
        id: string;
        email: string;
        isHost: boolean;
        isVerified?: boolean;
    } | null;
}

export async function createContext(req: any): Promise<Context> {
    let user: { id: string; email: string; isHost: boolean } | null = null;

    // Extract token from Authorization header
    const authHeader = req?.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);

        try {
            // For development, accept a mock token
            if (token === "mock-token") {
                // Create a mock user if it doesn't exist
                let mockUser = await db.query.users.findFirst({
                    where: eq(users.email, "test@example.com"),
                });

                if (!mockUser) {
                    const newUsers = await db
                        .insert(users)
                        .values({
                            email: "test@example.com",
                            firstName: "Test",
                            lastName: "User",
                            isHost: true,
                        })
                        .returning();
                    mockUser = newUsers[0];
                }

                user = {
                    id: mockUser.id,
                    email: mockUser.email,
                    isHost: mockUser.isHost,
                };
            } else if (process.env.JWT_SECRET) {
                // Verify JWT token in production
                const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
                if (decoded.userId) {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.id, decoded.userId),
                    });

                    if (dbUser) {
                        user = {
                            id: dbUser.id,
                            email: dbUser.email,
                            isHost: dbUser.isHost,
                        };
                    }
                }
            }
        } catch (error) {
            // Invalid token, user remains null
            console.warn("Invalid token provided:", error);
        }
    }

    return {
        db,
        user,
    };
}
