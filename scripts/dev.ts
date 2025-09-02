#!/usr/bin/env bun

/**
 * Development server with hot reload
 * Usage: bun scripts/dev.ts
 */

export {}; // Make this file a module to allow top-level await

console.log("🔥 Starting Nestly Backend in development mode...");

const proc = Bun.spawn(["bun", "--watch", "src/index.ts"], {
  cwd: process.cwd(),
  stdio: ["inherit", "inherit", "inherit"],
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  proc.kill();
  process.exit(0);
});

await proc.exited;
