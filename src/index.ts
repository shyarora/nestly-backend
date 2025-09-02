import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

console.log("🚀 Nestly Backend Starting...");
console.log(`⚡ Powered by Bun ${Bun.version}`);

const app = express();
const port = Number(process.env.PORT) || 4000;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// Start Apollo Server
await server.start();

// Apply middleware
app.use(cors());
app.use(express.json());

// Regular HTTP endpoints
app.get("/", (req, res) => {
  res.json({
    message: "Nestly Backend API",
    graphql: `http://localhost:${port}/graphql`,
    health: `http://localhost:${port}/health`,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    runtime: "bun",
  });
});

// Apply GraphQL middleware
app.use("/graphql", expressMiddleware(server));

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔍 GraphQL Playground: http://localhost:${port}/graphql`);
});
