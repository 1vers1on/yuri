import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getDateSeed(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export async function GET({ url }) {
    const dateParam = url.searchParams.get("date");
    const today = dateParam ? new Date(dateParam) : new Date();
    const dateStr = today.toISOString().split("T")[0];

    const totalPosts = await prisma.yuri.count({
        where: {
            rating: {
                in: ["s", "g"],
            },
        },
    });

    if (totalPosts === 0) {
        return json({
            post: null,
            date: dateStr,
        });
    }

    const seed = getDateSeed(dateStr);
    const skipIndex = seed % totalPosts;

    const post = await prisma.yuri.findFirst({
        skip: skipIndex,
        where: {
            rating: {
                in: ["s", "g"],
            },
        },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!post) {
        return json({
            post: null,
            date: dateStr,
        });
    }

    const formattedPost = {
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map((tag) => tag.tag.tag),
    };

    return json({
        post: formattedPost,
        date: dateStr,
    });
}
