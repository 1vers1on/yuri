// load-yuri.js
import { PrismaClient } from './generated/prisma/client.js';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const filePath = path.resolve('./metadata_out.json');

async function main() {
    console.log('reading data...');
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);

    console.log('clearing existing db...');
    await prisma.yuriTag.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.yuri.deleteMany({});

    const tagCache = new Map();

    const seenHashes = new Set();

    console.log('importing yuri...');
    for (const [filename, entry] of Object.entries(data)) {
        const { hash, rating, source, artist, tags } = entry;

        const tagList = tags
            .split(/[ ,]+/)
            .map(t => t.trim().toLowerCase())
            .filter(t => t.length > 0);

        const tagConnections = [];
        const seenTagIds = new Set();

        for (const tag of tagList) {
            let tagId = tagCache.get(tag);
            if (!tagId) {
                const tagEntry = await prisma.tag.upsert({
                    where: { tag },
                    update: {},
                    create: { tag }
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
                            connect: { id: tagId }
                        }
                    }))
                }
            }
        });
    }

    console.log('done!');
}

main()
    .catch(e => {
        console.error('error loading data:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
