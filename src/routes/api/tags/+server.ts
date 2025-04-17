import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ url }) {
    const query = url.searchParams.get("q")?.trim().toLowerCase();
    if (!query || query.length < 1) {
        return json({ error: "query too short" }, { status: 400 });
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

    return json(results);
}
