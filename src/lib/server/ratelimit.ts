// Yuri Archive
// Copyright (C) 2025 1vers1on

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
