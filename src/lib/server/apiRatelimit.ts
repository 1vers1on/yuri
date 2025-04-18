import { json, type RequestEvent } from "@sveltejs/kit";
import {
    isRateLimited,
    getRemainingRequests,
    type RateLimitConfig,
} from "./ratelimit";

const API_RATE_LIMITS: Record<string, RateLimitConfig> = {
    default: {
        maxRequests: 60,
        windowMs: 60 * 1000,
        prefix: "ratelimit:api",
    },
    search: {
        maxRequests: 20,
        windowMs: 60 * 1000,
        prefix: "ratelimit:search",
    },
    random: {
        maxRequests: 30,
        windowMs: 60 * 1000,
        prefix: "ratelimit:random",
    },
};

export async function applyRateLimit(
    event: RequestEvent,
    endpoint: keyof typeof API_RATE_LIMITS = "default",
) {
    const config = API_RATE_LIMITS[endpoint] || API_RATE_LIMITS.default;
    const userIP =
        event.request.headers.get("cf-connecting-ip") ||
        event.getClientAddress();

    if (await isRateLimited(userIP, config)) {
        const remaining = await getRemainingRequests(userIP, config);

        return json(
            { error: "Rate limit exceeded. Please try again later." },
            {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil(config.windowMs / 1000).toString(),
                    "X-RateLimit-Limit": config.maxRequests.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": (
                        Math.ceil(Date.now() / 1000) +
                        Math.ceil(config.windowMs / 1000)
                    ).toString(),
                },
            },
        );
    }

    return null;
}
