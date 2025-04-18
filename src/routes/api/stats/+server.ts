import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const CACHE_KEY = "yuri:stats";
const CACHE_TTL = 3600;

export async function GET() {
    try {
        const cachedStats = await redis.get(CACHE_KEY);

        if (cachedStats) {
            return json(JSON.parse(cachedStats));
        }

        const totalYuri = await prisma.yuri.count();
        const totalTags = await prisma.tag.count();

        const topTags = await prisma.tag.findMany({
            orderBy: {
                posts: {
                    _count: "desc",
                },
            },
            take: 10,
            select: {
                tag: true,
                _count: {
                    select: { posts: true },
                },
            },
        });

        const totalTagLinks = await prisma.yuriTag.count();
        const averageTagsPerPost =
            totalYuri === 0 ? 0 : totalTagLinks / totalYuri;

        const responseData = {
            totalYuri,
            totalTags,
            averageTagsPerPost,
            topTags: topTags.map((t) => ({
                tag: t.tag,
                count: t._count.posts,
            })),
        };

        await redis.set(
            CACHE_KEY,
            JSON.stringify(responseData),
            "EX",
            CACHE_TTL,
        );

        return json(responseData);
    } catch (err) {
        console.error("failed to fetch stats :(", err);
        return json({ error: "internal server error" }, { status: 500 });
    }
}
