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
import { isValid } from "$lib/server/captcha";
import {
    isRateLimited,
    getRemainingRequests,
    type RateLimitConfig,
} from "$lib/server/ratelimit";

const prisma = new PrismaClient();

const RATE_LIMIT: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
    prefix: "ratelimit:guestbook",
};

export async function POST({ request, getClientAddress }) {
    const data = await request.json();
    const { name, message, email, website } = data;
    const token = data.captchaToken;
    const userIP =
        request.headers.get("cf-connecting-ip") || getClientAddress();

    if (await isRateLimited(userIP, RATE_LIMIT)) {
        return json(
            {
                error: "Too many requests. Please try again later.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil(
                        RATE_LIMIT.windowMs / 1000,
                    ).toString(),
                },
            },
        );
    }

    const captchaValid = await isValid(token);
    if (!captchaValid) {
        return json(
            {
                error: "Invalid captcha",
            },
            {
                status: 400,
            },
        );
    }

    if (!name || !message) {
        return json(
            { error: "Name and message are required" },
            { status: 400 },
        );
    }

    if (message.length > 500) {
        return json(
            { error: "Message is too long (max 500 characters)" },
            { status: 400 },
        );
    }

    if (name.length > 50) {
        return json(
            { error: "Name is too long (max 50 characters)" },
            { status: 400 },
        );
    }

    const entry = await prisma.guestbook.create({
        data: {
            name,
            message,
            email: email || null,
            website: website || null,
        },
    });

    return json({
        success: true,
        entry: {
            id: entry.id,
            name: entry.name,
            message: entry.message,
            createdAt: entry.createdAt,
            website: entry.website,
        },
    });
}

export async function GET() {
    const entries = await prisma.guestbook.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            message: true,
            createdAt: true,
            website: true,
        },
    });

    return json(entries);
}
