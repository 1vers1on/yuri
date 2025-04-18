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

import { json, type RequestEvent } from "@sveltejs/kit";
import {
    isRateLimited,
    getRemainingRequests,
    type RateLimitConfig,
} from "./ratelimit";

const API_RATE_LIMITS: Record<string, RateLimitConfig> = {
    default: {
        maxRequests: 500,
        windowMs: 60 * 1000,
        prefix: "ratelimit:api",
    },
    search: {
        maxRequests: 500,
        windowMs: 60 * 1000,
        prefix: "ratelimit:search",
    },
    random: {
        maxRequests: 500,
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
