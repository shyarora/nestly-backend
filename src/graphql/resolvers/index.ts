export const resolvers = {
  Query: {
    health: () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      runtime: 'bun',
    }),
  },
  
  Mutation: {
    _empty: () => 'This is a placeholder mutation',
  },
};
