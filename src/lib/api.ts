// Yuri Archive
// Copyright (C) 2025 1vers1on

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { userSettings, favorites } from "$lib/globalState";
import { accessTokenStore, loggedIn, getAccessToken } from "./auth";
import { get } from "svelte/store";

export async function getPosts(
    tags: string,
    page: number,
    limit: number,
    sort: string,
) {
    const url = new URL("/api/posts", window.location.origin);
    if (userSettings.get().defaultTags) {
        tags = tags + " " + userSettings.get().defaultTags;
    }
    url.searchParams.set("tags", tags);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("order", sort);
    const settings = userSettings.get();
    if (!settings.nsfw) {
        url.searchParams.set("nsfw", "false");
    } else {
        url.searchParams.set("nsfw", "true");
    }

    const response = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getPost(id: string) {
    const url = new URL(`/api/post/${id}`, window.location.origin);

    const response = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function getToday() {
    const url = new URL("/api/today", window.location.origin);

    const response = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching today's posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.post.id;
}

export async function getRandom() {
    const url = new URL("/api/random", window.location.origin);

    const response = await fetch(url.toString(), {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching today's posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data.post.id;
}

export async function getUserFavorites() {
    if (await loggedIn()) {
        const url = new URL("/api/user/me/favorites", window.location.origin);
        const token = await getAccessToken();
        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching favorites: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } else {
        return favorites.get();
    }
}

export async function addUserFavorite(postId: string) {
    if (await loggedIn()) {
        const url = new URL("/api/user/me/favorites", window.location.origin);
        const token = await getAccessToken();
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ postId }),
        });

        if (!response.ok) {
            throw new Error(`Error adding favorite: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } else {
        favorites.add(postId);
    }
}

export async function removeUserFavorite(postId: string) {
    if (await loggedIn()) {
        const url = new URL(
            `/api/user/me/favorites/${postId}`,
            window.location.origin,
        );
        const token = await getAccessToken();
        const response = await fetch(url.toString(), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error removing favorite: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } else {
        favorites.remove(postId);
    }
}

export async function isPostFavorite(postId: string) {
    if (await loggedIn()) {
        try {
            const url = new URL(
                `/api/user/me/favorites/${postId}`,
                window.location.origin,
            );
            const token = await getAccessToken();
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(
                    `Error checking favorite status: ${response.statusText}`,
                );
            }
            const data = await response.json();
            return data.isFavorite;
        } catch (error) {
            console.error("Error checking favorite status:", error);
            return false;
        }
    } else {
        console.log("Checking favorite status in local storage");
        return favorites.has(postId);
    }
}
