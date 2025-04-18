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
