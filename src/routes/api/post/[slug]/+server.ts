import { json, error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { getPostById } from "$lib/server/serverApi";

const prisma = new PrismaClient();

export async function GET({ params }) {
    const id = params.slug;
    const formattedPost = await getPostById(id);

    if (!formattedPost) {
        throw error(404, "Post not found");
    }

    return json(formattedPost);
}