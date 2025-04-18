import { json } from '@sveltejs/kit';
import { getUserFavorites, addUserFavorite } from '$lib/server/serverApi';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import { request } from 'http';

export const GET: RequestHandler = async ({ url, request }) => {
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

        const favorites = await getUserFavorites(userId);
        return json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
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

        const { postId } = await request.json();
        if (!postId) {
            return json({ error: 'Post ID is required' }, { status: 400 });
        }

        await addUserFavorite(userId, postId);
        return json({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
