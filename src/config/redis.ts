import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient>;

export async function connectRedis(): Promise<void> {
  try {
    redisClient = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.disconnect();
      console.log('🔌 Disconnected from Redis');
    }
  } catch (error) {
    console.error('❌ Redis disconnection failed:', error);
    throw error;
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}
