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

import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getDateSeed(dateStr: string): number {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export async function GET({ url }) {
    const dateParam = url.searchParams.get("date");
    const today = dateParam ? new Date(dateParam) : new Date();
    const dateStr = today.toISOString().split("T")[0];

    const totalPosts = await prisma.yuri.count({
        where: {
            rating: {
                in: ["s", "g"],
            },
        },
    });

    if (totalPosts === 0) {
        return json({
            post: null,
            date: dateStr,
        });
    }

    const seed = getDateSeed(dateStr);
    const skipIndex = seed % totalPosts;

    const post = await prisma.yuri.findFirst({
        skip: skipIndex,
        where: {
            rating: {
                in: ["s", "g"],
            },
        },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
        },
    });

    if (!post) {
        return json({
            post: null,
            date: dateStr,
        });
    }

    const formattedPost = {
        id: post.id,
        filename: post.filename,
        rating: post.rating,
        source: post.source,
        artist: post.artist,
        tags: post.tags.map((tag) => tag.tag.tag),
    };

    return json({
        post: formattedPost,
        date: dateStr,
    });
}
