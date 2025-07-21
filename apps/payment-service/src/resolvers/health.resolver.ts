export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return 'payment service is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return 'payment service is ready'
      } catch (error) {
        throw new Error('payment service not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return `Hello from Nestly payment service! ${new Date().toISOString()}`
    },
  },
}
