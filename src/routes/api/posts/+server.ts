import { json } from "@sveltejs/kit";
import { getPosts, parseTags } from "$lib/server/serverApi";

export async function GET({ url }) {
    const { include, exclude } = parseTags(url.searchParams.get("tags"));
    const nsfw = url.searchParams.get("nsfw") === "true";
    const page = parseInt(url.searchParams.get("page") || "1");
    let limit = parseInt(url.searchParams.get("limit") || "50");
    if (limit > 100) limit = 100;

    const order = url.searchParams.get("order") || "id_desc";

    const { posts, totalCount } = await getPosts({
        includeTagsFilter: include,
        excludeTagsFilter: exclude,
        nsfw,
        page,
        limit,
        order,
    });

    return json({
        posts,
        nResults: totalCount,
    });
}
