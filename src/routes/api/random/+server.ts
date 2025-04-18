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
import { applyRateLimit } from "$lib/server/apiRatelimit";

const prisma = new PrismaClient();

export async function GET(event) {
    const rateLimited = await applyRateLimit(event, "random");
    if (rateLimited) {
        return rateLimited;
    }

    const { url } = event;
    const nsfw = url.searchParams.get("nsfw") === "true";

    const whereClause = nsfw
        ? {}
        : {
              rating: {
                  in: ["s", "g"],
              },
          };

    const totalPosts = await prisma.yuri.count({
        where: whereClause,
    });

    if (totalPosts === 0) {
        return json({
            post: null,
        });
    }

    const seed = Math.random() * totalPosts;
    const skipIndex = Math.floor(seed);

    const post = await prisma.yuri.findFirst({
        skip: skipIndex,
        where: whereClause,
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
        });
    }

    return json({
        post: {
            id: post.id,
            filename: post.filename,
            rating: post.rating,
            source: post.source,
            artist: post.artist,
        },
    });
}
