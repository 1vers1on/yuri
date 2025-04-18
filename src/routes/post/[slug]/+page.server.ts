import type { PageServerLoad } from "./$types";
import { getPostById } from "$lib/server/serverApi";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.slug;
    const post = await getPostById(id);
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
};
