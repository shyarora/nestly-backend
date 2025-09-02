import "dotenv/config";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

console.log("🚀 Nestly Backend Starting with Apollo Server...");
console.log(`⚡ Powered by Bun ${Bun.version}`);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 },
});

console.log(`🚀 Apollo Server ready at ${url}`);
console.log(`📊 GraphQL Playground available`);
