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

import type { PageServerLoad } from "./$types";
import { getPostById } from "$lib/server/serverApi";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.slug;
    const post = await getPostById(id);
    if (!post) {
        throw new Error("Post not found");
    }
    return post;
};
