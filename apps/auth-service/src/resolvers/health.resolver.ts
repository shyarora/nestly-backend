export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return 'auth service is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return 'auth service is ready'
      } catch (error) {
        throw new Error('auth service not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return `Hello from Nestly auth service! ${new Date().toISOString()}`
    },
  },
}
