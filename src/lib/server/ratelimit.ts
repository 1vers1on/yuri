import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    prefix: string;
}

export async function isRateLimited(
    key: string,
    config: RateLimitConfig,
): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const redisKey = `${config.prefix}:${key}`;

    await redis.zadd(redisKey, now, `${now}`);
    await redis.zremrangebyscore(redisKey, 0, windowStart);
    await redis.expire(redisKey, Math.ceil(config.windowMs / 1000));

    const requestCount = await redis.zcard(redisKey);

    return requestCount > config.maxRequests;
}

export async function getRemainingRequests(
    key: string,
    config: RateLimitConfig,
): Promise<number> {
    const redisKey = `${config.prefix}:${key}`;
    const requestCount = await redis.zcard(redisKey);
    return Math.max(0, config.maxRequests - requestCount);
}
