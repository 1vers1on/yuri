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
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch }) => {
    const baseUrl = "https://yuri.liminal.moe";

    const staticRoutes = [
        "",
        "/about",
        "/guestbook",
        "/random",
        "/today",
        "/results",
    ];

    interface Post {
        id: string;
        uploadDate?: string;
    }

    interface SitemapEntry {
        loc: string;
        changefreq: "daily" | "weekly" | "monthly";
        priority: string;
        lastmod?: string;
    }

    const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticRoutes
        .map(
            (route: string) => `<url>
        <loc>${baseUrl}${route}</loc>
        <changefreq>${route === "/today" ? "daily" : "weekly"}</changefreq>
        <priority>${route === "" ? "1.0" : "0.8"}</priority>
    </url>`,
        )
        .join("\n  ")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "max-age=3600",
        },
    });
};
