export const healthResolvers = {
    Query: {
        // Basic liveness check
        livez: async () => {
            return "Property Service is alive";
        },

        // Readiness check
        readyz: async () => {
            try {
                // Add any readiness checks here (database, external services, etc.)
                return "Property Service is ready";
            } catch (error) {
                throw new Error("Property Service not ready");
            }
        },

        // Hello world endpoint
        hello: async () => {
            return `Hello from Nestly Property Service! ${new Date().toISOString()}`;
        },
    },
};
