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

import { getPosts, parseTags } from "$lib/server/serverApi";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const { include, exclude } = parseTags(url.searchParams.get("tags"));
    const nsfw = url.searchParams.get("nsfw") === "true";
    const page = parseInt(url.searchParams.get("page") || "1");
    let limit = parseInt(url.searchParams.get("limit") || "50");
    if (limit > 100) limit = 100;

    const order = url.searchParams.get("order") || "id_desc";

    const { posts, totalCount } = await getPosts({
        includeTagsFilter: include,
        excludeTagsFilter: exclude,
        nsfw,
        page,
        limit,
        order,
    });

    return {
        posts,
        nResults: totalCount,
    };
};
