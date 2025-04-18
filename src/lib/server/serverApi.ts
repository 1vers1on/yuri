import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export function parseTags(raw: string | null) {
    const tags = raw?.split("+") ?? [];
    const include: string[] = [];
    const exclude: string[] = [];

    for (const tag of tags) {
        if (tag.startsWith("-")) exclude.push(tag.slice(1));
        else if (tag.length > 0) include.push(tag);
    }

    return { include, exclude };
}

interface PostTag {
    tag: {
        tag: string;
    };
}

interface YuriPost {
    id: string;
    filename: string;
    rating: string;
    source: string | null;
    artist: string | null;
    tags: PostTag[];
}

interface PostResult {
    id: string;
    filename: string;
    rating: string;
    source: string | null;
    artist: string | null;
    tags: string[];
}

export async function getPosts(options: {
    includeTagsFilter: string[];
    excludeTagsFilter: string[];
    nsfw: boolean;
    page: number;
    limit: number;
    order: string;
}): Promise<{ posts: PostResult[]; totalCount: number }> {
    const { includeTagsFilter, excludeTagsFilter, nsfw, page, limit, order } =
        options;

    const whereClause = {
        AND: [
            nsfw ? {} : { rating: { in: ["g", "s"] } },
            ...includeTagsFilter.map((tag) => ({
                tags: {
                    some: {
                        tag: {
                            tag: tag,
                        },
                    },
                },
            })),
            ...excludeTagsFilter.map((tag) => ({
                tags: {
                    none: {
                        tag: {
                            tag: tag,
                        },
                    },
                },
            })),
        ],
    };

    const totalPosts = await prisma.yuri.count({ where: whereClause });
    let result: any[] = [];

    if (order === "random") {
        if (totalPosts === 0) {
            result = [];
        } else {
            const randomPosts = [];
            const seenIds = new Set();

            while (
                randomPosts.length < limit &&
                randomPosts.length < totalPosts
            ) {
                const randomSkip = Math.floor(Math.random() * totalPosts);

                const post = await prisma.yuri.findFirst({
                    where: whereClause,
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                    skip: randomSkip,
                });

                if (post && !seenIds.has(post.id)) {
                    randomPosts.push(post);
                    seenIds.add(post.id);
                }
            }

            result = randomPosts;
        }
    } else {
        const skip = (page - 1) * limit;

        let orderBy = {};
        switch (order) {
            case "id_asc":
                orderBy = { id: "asc" };
                break;
            case "id_desc":
                orderBy = { id: "desc" };
                break;
            case "created_at_asc":
                orderBy = { createdAt: "asc" };
                break;
            case "created_at_desc":
                orderBy = { createdAt: "desc" };
                break;
            default:
                orderBy = { id: "desc" };
        }

        result = await prisma.yuri.findMany({
            where: whereClause,
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
            orderBy,
            skip,
            take: limit,
        });
    }

    const formattedResult: PostResult[] = result.map((post: YuriPost) => ({
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map((tag) => tag.tag.tag),
    }));

    return {
        posts: formattedResult,
        totalCount: totalPosts,
    };
}

export async function getPostById(id: string) {
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
        return null;
    }

    return {
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map((tag) => tag.tag.tag),
    };
}

export async function getUserFavorites(userId: number) {
    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: userId,
            },
            include: {
                yuri: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return favorites.map((favorite) => ({
            id: favorite.yuri.id,
            filename: favorite.yuri.filename,
            rating: favorite.yuri.rating,
            source: favorite.yuri.source,
            artist: favorite.yuri.artist,
            favoriteDate: favorite.createdAt,
            tags: favorite.yuri.tags.map((t) => t.tag.tag),
        }));
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        throw new Error("Failed to fetch user favorites");
    }
}

export async function isUserFavorite(userId: number, yuriId: string) {
    try {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_yuriId: {
                    userId,
                    yuriId,
                },
            },
        });

        return !!favorite;
    } catch (error) {
        console.error("Error checking if post is favorited:", error);
        throw new Error("Failed to check favorite status");
    }
}

export async function addUserFavorite(userId: number, yuriId: string) {
    try {
        const favorite = await prisma.favorite.create({
            data: {
                userId,
                yuriId,
            },
        });

        return favorite;
    } catch (error) {
        console.error("Error adding user favorite:", error);
        throw new Error("Failed to add user favorite");
    }
}

export async function removeUserFavorite(userId: number, yuriId: string) {
    try {
        const favorite = await prisma.favorite.delete({
            where: {
                userId_yuriId: {
                    userId,
                    yuriId,
                },
            },
        });

        return favorite;
    } catch (error) {
        console.error("Error removing user favorite:", error);
        throw new Error("Failed to remove user favorite");
    }
}
