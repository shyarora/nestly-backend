import { healthResolvers } from "./health.resolver.js";
import { authResolvers } from "./auth.resolver.js";

export const resolvers = {
    Query: {
        ...healthResolvers.Query,
        ...authResolvers.Query,
    },
    Mutation: {
        ...authResolvers.Mutation,
    },
};
