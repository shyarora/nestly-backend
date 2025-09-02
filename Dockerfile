# Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production
WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Copy built application
COPY --from=base /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bun
USER bun

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Start application
CMD ["bun", "run", "start"]