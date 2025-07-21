import { healthResolvers } from "./health.resolver";

export const resolvers = {
    Query: {
        ...healthResolvers.Query,
    },
};
