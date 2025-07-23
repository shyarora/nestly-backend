import jwt from "jsonwebtoken";
import { FastifyRequest } from "fastify";
import { JwtPayload, AuthContext } from "../types/auth.types.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

export async function createAuthContext(request: FastifyRequest): Promise<AuthContext> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {}; // No authentication provided
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // No database call! All user data is in the JWT payload
        return {
            userId: payload.userId,
            user: {
                id: payload.userId,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                avatar: payload.avatar,
                phone: payload.phone,
                isPhoneVerified: payload.isPhoneVerified,
                roles: payload.roles,
                createdAt: new Date(), // These will be properly set during token generation
                updatedAt: new Date(),
            },
        };
    } catch (error) {
        // Token is invalid or expired
        return {};
    }
}
