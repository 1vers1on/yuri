import { json, error } from "@sveltejs/kit";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET({ url }) {
    const id = url.searchParams.get("id");

    if (!id) {
        throw error(400, "missing id parameter");
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
        throw error(500, "image conversion failed");
    }
}
