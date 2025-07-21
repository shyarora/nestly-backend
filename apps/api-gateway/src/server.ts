import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import type { GraphQLContext } from "./context/apollo-context.js";

const PORT = parseInt(process.env.PORT || "5000");
const HOST = process.env.HOST || "localhost";

// Create Fastify instance
const fastify = Fastify({
    logger: true,
});

// Register CORS
await fastify.register(cors, {
    origin: true,
    credentials: true,
});

// Service Configuration
const services = {
    'property-service': { port: 5001, name: 'Property Service' },
    'auth-service': { port: 5002, name: 'Auth Service' },
    'booking-service': { port: 5003, name: 'Booking Service' },
    'payment-service': { port: 5004, name: 'Payment Service' },
    'review-service': { port: 5005, name: 'Review Service' },
    'notification-service': { port: 5006, name: 'Notification Service' },
};

// Manual proxy function
async function proxyRequest(request: any, reply: any, targetUrl: string, servicePath: string) {
    try {
        // Parse the URL to get the path properly
        const originalPath = request.url;
        let targetPath = '';
        
        // Remove service path prefix and any query parameters
        if (originalPath.startsWith(servicePath)) {
            targetPath = originalPath.substring(servicePath.length);
            // If path is empty after removing service prefix, default to root
            if (!targetPath || targetPath === '') {
                targetPath = '/';
            }
            // Ensure path starts with /
            if (!targetPath.startsWith('/')) {
                targetPath = '/' + targetPath;
            }
        } else {
            targetPath = originalPath;
        }
        
        const fullTargetUrl = `${targetUrl}${targetPath}`;
        
        fastify.log.info(`🔀 Proxying: ${originalPath} -> ${fullTargetUrl}`);
        
        const response = await fetch(fullTargetUrl, {
            method: request.method,
            headers: {
                ...request.headers,
                host: undefined, // Remove host header to avoid conflicts
                'content-type': request.headers['content-type'],
            },
            body: request.method !== 'GET' && request.method !== 'HEAD' && request.body ? JSON.stringify(request.body) : undefined,
        });

        // Copy response headers
        response.headers.forEach((value, key) => {
            if (key !== 'content-encoding' && key !== 'transfer-encoding') {
                reply.header(key, value);
            }
        });

        reply.status(response.status);
        const responseText = await response.text();
        return reply.send(responseText);
    } catch (error) {
        fastify.log.error(`Proxy error for ${targetUrl}: ${error}`);
        return reply.status(503).send({ 
            error: 'Service Unavailable', 
            message: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

// Register service routes
for (const [serviceName, config] of Object.entries(services)) {
    const targetUrl = `http://localhost:${config.port}`;
    const servicePath = `/${serviceName}`;
    
    // Handle all HTTP methods for each service with wildcard
    fastify.all(`${servicePath}/*`, async (request, reply) => {
        return proxyRequest(request, reply, targetUrl, servicePath);
    });
    
    // Handle root service path (without trailing slash) - redirect to service root
    fastify.all(servicePath, async (request, reply) => {
        return proxyRequest(request, reply, targetUrl, servicePath);
    });
    
    fastify.log.info(`📡 Registered route: ${servicePath}/* -> ${targetUrl}`);
}

// Create Apollo Server
const apollo = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
    introspection: process.env.NODE_ENV !== "production",
});

// Start Apollo Server
await apollo.start();

// Register Apollo with Fastify
await fastify.register(fastifyApollo(apollo));

// Health check endpoints (REST for Kubernetes)
fastify.get("/livez", async () => {
    return { status: "alive", service: "api-gateway", timestamp: new Date().toISOString() };
});

fastify.get("/readyz", async () => {
    try {
        // Add any readiness checks here
        return { status: "ready", service: "api-gateway", timestamp: new Date().toISOString() };
    } catch (error) {
        fastify.log.error(error);
        throw new Error("Service not ready");
    }
});

// Service discovery endpoint
fastify.get("/services", async () => {
    const serviceList = Object.entries(services).map(([path, config]) => ({
        name: config.name,
        path: `/${path}`,
        endpoints: {
            graphql: `http://localhost:${PORT}/${path}/graphql`,
            health: `http://localhost:${PORT}/${path}/livez`,
            readiness: `http://localhost:${PORT}/${path}/readyz`,
        },
        directPort: config.port,
    }));

    return {
        gateway: {
            name: "API Gateway",
            port: PORT,
            graphql: `http://localhost:${PORT}/graphql`,
            health: `http://localhost:${PORT}/livez`,
            services: `/services`,
        },
        services: serviceList,
        totalServices: serviceList.length,
        timestamp: new Date().toISOString(),
    };
});

// Service discovery dashboard (HTML)
fastify.get("/", async (request, reply) => {
    const serviceList = Object.entries(services).map(([path, config]) => ({
        name: config.name,
        path: `/${path}`,
        port: config.port,
    }));

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nestly Backend - Service Discovery</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
        .service-card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .service-name { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 15px; }
        .endpoint { margin: 8px 0; }
        .endpoint a { color: #0066cc; text-decoration: none; font-family: monospace; font-size: 14px; }
        .endpoint a:hover { text-decoration: underline; }
        .endpoint-label { font-weight: 500; color: #666; margin-right: 10px; }
        .gateway-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .gateway-card .service-name { color: white; }
        .gateway-card .endpoint a { color: #e0e7ff; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
        .status.healthy { background: #dcfce7; color: #166534; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 Nestly Backend Services</h1>
            <p>GraphQL Microservices Architecture - All services accessible through port 5000</p>
            <div class="status healthy">All services running on single port with path-based routing</div>
        </div>

        <div class="services-grid">
            <div class="service-card gateway-card">
                <div class="service-name">🚀 API Gateway</div>
                <div class="endpoint">
                    <span class="endpoint-label">GraphQL:</span>
                    <a href="http://localhost:${PORT}/graphql" target="_blank">http://localhost:${PORT}/graphql</a>
                </div>
                <div class="endpoint">
                    <span class="endpoint-label">Health:</span>
                    <a href="http://localhost:${PORT}/livez" target="_blank">http://localhost:${PORT}/livez</a>
                </div>
                <div class="endpoint">
                    <span class="endpoint-label">Services:</span>
                    <a href="http://localhost:${PORT}/services" target="_blank">http://localhost:${PORT}/services</a>
                </div>
            </div>

            ${serviceList.map(service => `
            <div class="service-card">
                <div class="service-name">${service.name}</div>
                <div class="endpoint">
                    <span class="endpoint-label">GraphQL:</span>
                    <a href="http://localhost:${PORT}${service.path}/graphql" target="_blank">http://localhost:${PORT}${service.path}/graphql</a>
                </div>
                <div class="endpoint">
                    <span class="endpoint-label">Health:</span>
                    <a href="http://localhost:${PORT}${service.path}/livez" target="_blank">http://localhost:${PORT}${service.path}/livez</a>
                </div>
                <div class="endpoint">
                    <span class="endpoint-label">Readiness:</span>
                    <a href="http://localhost:${PORT}${service.path}/readyz" target="_blank">http://localhost:${PORT}${service.path}/readyz</a>
                </div>
                <div class="endpoint">
                    <span class="endpoint-label">Direct Port:</span>
                    <a href="http://localhost:${service.port}/graphql" target="_blank">http://localhost:${service.port}/graphql</a>
                </div>
            </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>✨ Generated at ${new Date().toLocaleString()}</p>
            <p>🔧 Use <code>pnpm dev</code> to start all services | <code>pnpm stop</code> to stop all services</p>
        </div>
    </div>
</body>
</html>`;

    reply.type('text/html');
    return html;
});

// Start server
async function start() {
    try {
        await fastify.listen({ port: PORT, host: HOST });
        fastify.log.info(`🚀 API Gateway running at http://${HOST}:${PORT}`);
        fastify.log.info(`📊 GraphQL Playground: http://${HOST}:${PORT}/graphql`);
        fastify.log.info(`🔍 Service Discovery: http://${HOST}:${PORT}/services`);
        fastify.log.info(`📡 Proxied Services:`);
        
        for (const [serviceName, config] of Object.entries(services)) {
            fastify.log.info(`   /${serviceName} -> ${config.name} (port ${config.port})`);
        }
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();
