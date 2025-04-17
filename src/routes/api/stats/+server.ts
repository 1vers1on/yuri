import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let statsCache: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 3600000;

export async function GET() {
    try {
        const now = Date.now();

        if (statsCache && now - lastCacheTime < CACHE_TTL) {
            return json(statsCache);
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

        statsCache = responseData;
        lastCacheTime = now;

        return json(responseData);
    } catch (err) {
        console.error("failed to fetch stats :(", err);
        return json({ error: "internal server error" }, { status: 500 });
    }
}
