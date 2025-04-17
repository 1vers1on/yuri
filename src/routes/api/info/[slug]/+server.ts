import { json, error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET({ params }) {
    const id = params.slug;

    const post = await prisma.yuri.findUnique({
        where: { id },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!post) {
        throw error(404, "Post not found");
    }

    const formattedPost = {
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map((tag) => tag.tag.tag),
    };

    return json(formattedPost);
}
