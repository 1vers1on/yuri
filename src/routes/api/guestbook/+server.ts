import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

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
    console.log("Received data:", data);
    const token = data.cloudflareToken;
    const userIP =
        request.headers.get("cf-connecting-ip") || getClientAddress();
    console.log("User IP:", token, userIP);

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

    const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                remoteip: userIP,
                secret: process.env.TURNSTILE_SECRET,
                response: token,
            }),
        },
    );

    const result = await res.json();
    console.log(result);
    if (!result.success) {
        return json({ error: "Captcha verification failed" }, { status: 400 });
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
