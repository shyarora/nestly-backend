export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return 'notification service is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return 'notification service is ready'
      } catch (error) {
        throw new Error('notification service not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return `Hello from Nestly notification service! ${new Date().toISOString()}`
    },
  },
}
