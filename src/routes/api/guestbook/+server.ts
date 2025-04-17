import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { isValid } from "$lib/server/captcha";

const prisma = new PrismaClient();

const RATE_LIMIT = {
    MAX_REQUESTS: 5,
    WINDOW_MS: 10 * 60 * 1000,
};

const rateLimitStore = new Map();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.WINDOW_MS;

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }

    const requests = rateLimitStore.get(ip);

    const recentRequests = requests.filter(
        (timestamp: number) => timestamp > windowStart,
    );
    rateLimitStore.set(ip, recentRequests);

    if (recentRequests.length >= RATE_LIMIT.MAX_REQUESTS) {
        return true;
    }

    recentRequests.push(now);
    return false;
}

export async function POST({ request, getClientAddress }) {
    const data = await request.json();
    const { name, message, email, website } = data;
    const token = data.captchaToken;
    const userIP =
        request.headers.get("cf-connecting-ip") || getClientAddress();

    if (isRateLimited(userIP)) {
        return json(
            {
                error: "Too many requests. Please try again later.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil(
                        RATE_LIMIT.WINDOW_MS / 1000,
                    ).toString(),
                },
            },
        );
    }

    if (!isValid(token)) {
        return json(
            {
                error: "Invalid captcha token.",
            },
            {
                status: 400,
            },
        );
    }

    const entry = await prisma.guestbook.create({
        data: {
            name,
            message,
            email,
            website,
        },
    });

    return json(entry);
}

export async function GET() {
    let entries = await prisma.guestbook.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    if (entries.length > 100) {
        entries = entries.slice(0, 100);
    }

    return json(entries);
}
