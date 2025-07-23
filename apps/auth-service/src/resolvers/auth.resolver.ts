import { AuthService } from "../services/auth.service.js";
import { Resolvers, MutationGoogleAuthArgs, MutationRefreshTokenArgs, MutationUpdateUserRolesArgs } from "../generated/types.js";
import { UserModel, UserGraphQLModel, AuthPayloadModel } from "../types/auth.types.js";
import { GraphQLError } from "graphql";

const authService = new AuthService();

// Helper function to convert UserModel to UserGraphQLModel
const toGraphQLUser = (user: UserModel): UserGraphQLModel => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    phone: user.phone,
    isPhoneVerified: user.isPhoneVerified,
    roles: user.roles,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
});

export const authResolvers: Resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            if (!user) {
                throw new GraphQLError("Not authenticated", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }
            return toGraphQLUser(user);
        },

        validateToken: async (_, __, { userId }) => {
            return !!userId;
        },
    },

    Mutation: {
        googleAuth: async (_, { input }: MutationGoogleAuthArgs): Promise<AuthPayloadModel> => {
            try {
                // Verify Google token
                const googleUserInfo = await authService.verifyGoogleToken(input.googleIdToken);

                // Find or create user
                const user = await authService.findOrCreateUser(googleUserInfo);

                // Generate tokens
                const accessToken = authService.generateAccessToken(user);
                const refreshToken = authService.generateRefreshToken(user);

                return {
                    user: toGraphQLUser(user),
                    accessToken,
                    refreshToken,
                };
            } catch (error) {
                throw new GraphQLError(error instanceof Error ? error.message : "Authentication failed", { extensions: { code: "AUTHENTICATION_ERROR" } });
            }
        },

        refreshToken: async (_, { token }: MutationRefreshTokenArgs): Promise<AuthPayloadModel> => {
            try {
                // Verify refresh token
                const payload = authService.verifyToken(token);

                // Get fresh user data
                const user = await authService.getUserById(payload.userId);
                if (!user) {
                    throw new Error("User not found");
                }

                // Generate new tokens
                const accessToken = authService.generateAccessToken(user);
                const newRefreshToken = authService.generateRefreshToken(user);

                return {
                    user: toGraphQLUser(user),
                    accessToken,
                    refreshToken: newRefreshToken,
                };
            } catch (error) {
                throw new GraphQLError(error instanceof Error ? error.message : "Token refresh failed", { extensions: { code: "AUTHENTICATION_ERROR" } });
            }
        },

        logout: async () => {
            // In a stateless JWT system, logout is handled client-side
            // by removing the token. Here we just return success.
            // For more security, you could implement a token blacklist.
            return true;
        },

        updateUserRoles: async (_, { userId, roles }: MutationUpdateUserRolesArgs, { user }): Promise<UserGraphQLModel> => {
            // Check if current user has admin privileges
            if (!user || !user.roles.includes("admin")) {
                throw new GraphQLError("Insufficient permissions", {
                    extensions: { code: "FORBIDDEN" },
                });
            }

            try {
                const updatedUser = await authService.updateUserRoles(userId, roles);
                return toGraphQLUser(updatedUser);
            } catch (error) {
                throw new GraphQLError(error instanceof Error ? error.message : "Role update failed", { extensions: { code: "INTERNAL_ERROR" } });
            }
        },
    },
};
