import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ url }) {
    const nsfw = url.searchParams.get("nsfw") === "true";

    const whereClause = nsfw
        ? {}
        : {
            rating: {
                in: ["s", "g"],
            }
        };

    const totalPosts = await prisma.yuri.count({
        where: whereClause,
    });

    if (totalPosts === 0) {
        return json({
            post: null,
        });
    }

    const seed = Math.random() * totalPosts;
    const skipIndex = seed % totalPosts;

    const post = await prisma.yuri.findFirst({
        skip: skipIndex,
        where: whereClause,
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
    });
}
