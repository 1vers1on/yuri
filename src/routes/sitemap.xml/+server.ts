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
