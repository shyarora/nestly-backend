export const typeDefs = `#graphql
  type Query {
    health: HealthStatus!
  }

  type Mutation {
    _empty: String
  }

  type HealthStatus {
    status: String!
    timestamp: String!
    version: String!
    runtime: String!
  }
`;
