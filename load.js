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

import { PrismaClient } from "./generated/prisma/client.js";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const filePath = path.resolve("./metadata_out.json");

async function main() {
    console.log("reading data...");
    const file = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(file);

    console.log("clearing existing db...");
    await prisma.yuriTag.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.yuri.deleteMany({});

    const tagCache = new Map();

    const seenHashes = new Set();

    console.log("importing yuri...");
    for (const [filename, entry] of Object.entries(data)) {
        const { hash, rating, source, artist, tags } = entry;

        const tagList = tags
            .split(/[ ,]+/)
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0);

        const tagConnections = [];
        const seenTagIds = new Set();

        for (const tag of tagList) {
            let tagId = tagCache.get(tag);
            if (!tagId) {
                const tagEntry = await prisma.tag.upsert({
                    where: { tag },
                    update: {},
                    create: { tag },
                });
                tagId = tagEntry.id;
                tagCache.set(tag, tagId);
            }

            if (!seenTagIds.has(tagId)) {
                tagConnections.push({ tagId });
                seenTagIds.add(tagId);
            }
        }

        await prisma.yuri.create({
            data: {
                id: hash,
                filename,
                rating,
                source,
                artist,
                tags: {
                    create: tagConnections.map(({ tagId }) => ({
                        tag: {
                            connect: { id: tagId },
                        },
                    })),
                },
            },
        });
    }

    console.log("done!");
}

main()
    .catch((e) => {
        console.error("error loading data:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
