export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return 'booking service is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return 'booking service is ready'
      } catch (error) {
        throw new Error('booking service not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return `Hello from Nestly booking service! ${new Date().toISOString()}`
    },
  },
}
