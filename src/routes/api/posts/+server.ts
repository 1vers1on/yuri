import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
function parseTags(raw: string | null) {
    const tags = raw?.split('+') ?? [];
    const include: string[] = [];
    const exclude: string[] = [];

    for (const tag of tags) {
        if (tag.startsWith('-')) exclude.push(tag.slice(1));
        else if (tag.length > 0) include.push(tag);
    }

    return { include, exclude };
}

export async function GET({ url }) {
    const { include, exclude } = parseTags(url.searchParams.get('tags'));
    const rating = url.searchParams.get('rating');
    const page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || '50');
    if (limit > 100) limit = 100;

    const order = url.searchParams.get('order') || 'id_desc';

    const whereClause = {
        AND: [
            rating ? { rating } : {},
            ...include.map(tag => ({
                tags: {
                    some: {
                        tag: {
                            tag: tag
                        }
                    }
                }
            })),
            ...exclude.map(tag => ({
                tags: {
                    none: {
                        tag: {
                            tag: tag
                        }
                    }
                }
            }))
        ]
    };

    const totalPosts = await prisma.yuri.count({ where: whereClause });

    let result: any[] = [];

    if (order === 'random') {
        if (totalPosts === 0) {
            result = [];
        } else {
            const randomPosts = [];
            const seenIds = new Set();

            while (randomPosts.length < limit && randomPosts.length < totalPosts) {
                const randomSkip = Math.floor(Math.random() * totalPosts);

                const post = await prisma.yuri.findFirst({
                    where: whereClause,
                    include: {
                        tags: {
                            include: {
                                tag: true
                            }
                        }
                    },
                    skip: randomSkip
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
            case 'id_asc':
                orderBy = { id: 'asc' };
                break;
            case 'id_desc':
                orderBy = { id: 'desc' };
                break;
            case 'created_at_asc':
                orderBy = { createdAt: 'asc' };
                break;
            case 'created_at_desc':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                orderBy = { id: 'desc' };
        }

        result = await prisma.yuri.findMany({
            where: whereClause,
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
            orderBy,
            skip,
            take: limit
        });
    }

    interface PostTag {
        tag: {
            tag: string;
        }
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

    const formattedResult: PostResult[] = result.map((post: YuriPost) => ({
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map(tag => tag.tag.tag),
    }));

    return json({
        posts: formattedResult,
        nResults: totalPosts,
    });
}