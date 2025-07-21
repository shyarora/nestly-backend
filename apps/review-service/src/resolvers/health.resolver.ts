export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return 'review service is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return 'review service is ready'
      } catch (error) {
        throw new Error('review service not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return `Hello from Nestly review service! ${new Date().toISOString()}`
    },
  },
}
