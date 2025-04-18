import { json } from '@sveltejs/kit';
import { removeUserFavorite, isUserFavorite } from '$lib/server/serverApi';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import { request } from 'http';

export const GET: RequestHandler = async ({ request, params }) => {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;

        const { slug } = params;
        if (!slug) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        const isFavorite = await isUserFavorite(userId, slug);
        return json({ isFavorite });
    } catch (error) {
        console.error('Error checking favorite:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const DELETE: RequestHandler = async ({ params, request }) => {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;

        const { slug } = params;
        if (!slug) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        await removeUserFavorite(userId, slug);
        return json({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
