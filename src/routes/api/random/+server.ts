import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { applyRateLimit } from "$lib/server/apiRatelimit";

const prisma = new PrismaClient();

export async function GET(event) {
    const rateLimited = await applyRateLimit(event, "random");
    if (rateLimited) {
        return rateLimited;
    }

    const { url } = event;
    const nsfw = url.searchParams.get("nsfw") === "true";

    const whereClause = nsfw
        ? {}
        : {
              rating: {
                  in: ["s", "g"],
              },
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
    const skipIndex = Math.floor(seed);

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

    return json({
        post: {
            id: post.id,
            filename: post.filename,
            rating: post.rating,
            source: post.source,
            artist: post.artist,
        },
    });
}
