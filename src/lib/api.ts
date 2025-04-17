import { userSettings } from '$lib/stores';
import { get } from 'svelte/store';

export async function getPosts(tags: string, page: number, limit: number, sort: string) {
    const url = new URL('/api/posts', window.location.origin);
    url.searchParams.set('tags', tags);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('order', sort);
    const settings = get(userSettings);
    if (!settings.nsfw) {
        url.searchParams.set('nsfw', 'false');
    } else {
        url.searchParams.set('nsfw', 'true');
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getPost(id: string) {
    const url = new URL('/api/info', window.location.origin);
    url.searchParams.set('id', id);

    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getToday() {
    const url = new URL('/api/today', window.location.origin);


    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching today's posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.post.id;
}

export async function getRandom() {
    const url = new URL('/api/random', window.location.origin);


    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching today's posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.post.id;
}
