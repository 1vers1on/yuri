import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { applyRateLimit } from "$lib/server/apiRatelimit";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function GET(event) {
    const rateLimited = await applyRateLimit(event, "search");
    if (rateLimited) {
        return rateLimited;
    }

    const { url } = event;
    const query = url.searchParams.get("q")?.trim().toLowerCase();
    if (!query || query.length < 1) {
        return json({ error: "query too short" }, { status: 400 });
    }

    const cacheKey = `tags:query:${query}`;

    try {
        const cachedResults = await redis.get(cacheKey);

        if (cachedResults) {
            return json(JSON.parse(cachedResults));
        }

        const tags = await prisma.tag.findMany({
            where: {
                tag: {
                    contains: query,
                },
            },
            orderBy: {
                posts: {
                    _count: "desc",
                },
            },
            take: 20,
            select: {
                tag: true,
                posts: true,
            },
        });

        const results = tags.map((t) => ({
            tag: t.tag,
            count: t.posts.length,
        }));

        await redis.setex(cacheKey, 300, JSON.stringify(results));

        return json(results);
    } catch (error) {
        console.error("Redis or database error:", error);

        const tags = await prisma.tag.findMany({
            where: {
                tag: {
                    contains: query,
                },
            },
            orderBy: {
                posts: {
                    _count: "desc",
                },
            },
            take: 20,
            select: {
                tag: true,
                posts: true,
            },
        });

        const results = tags.map((t) => ({
            tag: t.tag,
            count: t.posts.length,
        }));

        return json(results);
    }
}
