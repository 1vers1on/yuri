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
import Redis from "ioredis";
import { applyRateLimit } from "$lib/server/apiRatelimit";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function GET(event) {
    const rateLimited = await applyRateLimit(event, "search");
    if (rateLimited) {
        return rateLimited;
    }

    const { url } = event;
    const query = url.searchParams.get("q")?.trim().toLowerCase();
    if (!query || query.length < 1) {
        return json({ error: "query too short" }, { status: 400 });
    }

    const cacheKey = `tags:query:${query}`;

    try {
        const cachedResults = await redis.get(cacheKey);

        if (cachedResults) {
            return json(JSON.parse(cachedResults));
        }

        const tags = await prisma.tag.findMany({
            where: {
                tag: {
                    contains: query,
                },
            },
            orderBy: {
                posts: {
                    _count: "desc",
                },
            },
            take: 20,
            select: {
                tag: true,
                posts: true,
            },
        });

        const results = tags.map((t) => ({
            tag: t.tag,
            count: t.posts.length,
        }));

        await redis.setex(cacheKey, 300, JSON.stringify(results));

        return json(results);
    } catch (error) {
        console.error("Redis or database error:", error);

        const tags = await prisma.tag.findMany({
            where: {
                tag: {
                    contains: query,
                },
            },
            orderBy: {
                posts: {
                    _count: "desc",
                },
            },
            take: 20,
            select: {
                tag: true,
                posts: true,
            },
        });

        const results = tags.map((t) => ({
            tag: t.tag,
            count: t.posts.length,
        }));

        return json(results);
    }
}
