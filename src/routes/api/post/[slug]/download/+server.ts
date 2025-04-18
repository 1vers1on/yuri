import { json } from "@sveltejs/kit";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET({ params }) {
    const id = params.slug;

    if (!id) {
        return new Response("missing id parameter", {
            status: 400,
        });
    }

    const avifPath = path.resolve(
        `/home/hoosiertransfer/projects/yuri/output_images/${id}.avif`,
    );

    try {
        const avifBuffer = await fs.readFile(avifPath);
        const pngBuffer = await sharp(avifBuffer).png().toBuffer();

        return new Response(pngBuffer, {
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (err: any) {
        console.error("conversion failed:", err);
        return new Response("image conversion failed", {
            status: 500,
        });
    }
}
