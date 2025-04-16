import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const totalYuri = await prisma.yuri.count();
		const totalTags = await prisma.tag.count();

		const topTags = await prisma.tag.findMany({
			orderBy: {
				posts: {
					_count: 'desc'
				}
			},
			take: 10,
			select: {
				tag: true,
				_count: {
					select: { posts: true }
				}
			}
		});

		const totalTagLinks = await prisma.yuriTag.count();
		const averageTagsPerPost = totalYuri === 0 ? 0 : totalTagLinks / totalYuri;

		return json({
			totalYuri,
			totalTags,
			averageTagsPerPost,
			topTags: topTags.map(t => ({
				tag: t.tag,
				count: t._count.posts
			}))
		});
	} catch (err) {
		console.error('failed to fetch stats :(', err);
		return json({ error: 'internal server error' }, { status: 500 });
	}
}
