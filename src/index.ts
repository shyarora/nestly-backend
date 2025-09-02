import "dotenv/config";

console.log("🚀 Nestly Backend Starting...");
console.log(`⚡ Powered by Bun ${Bun.version}`);

const server = Bun.serve({
  port: process.env.PORT || 4000,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        runtime: "bun"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Nestly Backend API", { status: 200 });
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
console.log(`📊 Health check: http://localhost:${server.port}/health`);
