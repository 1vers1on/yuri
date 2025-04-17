import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    
    if (!id) {
        throw error(400, 'Missing required parameter: id');
    }
    
    const post = await prisma.yuri.findUnique({
        where: { id },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
    
    if (!post) {
        throw error(404, 'Post not found');
    }
    
    const formattedPost = {
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map(tag => tag.tag.tag),
    };
    
    return json(formattedPost);
}
