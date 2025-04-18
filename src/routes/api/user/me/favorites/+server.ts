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
import { getUserFavorites, addUserFavorite } from "$lib/server/serverApi";
import type { RequestHandler } from "./$types";
import jwt from "jsonwebtoken";
import { request } from "http";

export const GET: RequestHandler = async ({ url, request }) => {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;

        const favorites = await getUserFavorites(userId);
        return json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = (decoded as any).id;

        const { postId } = await request.json();
        if (!postId) {
            return json({ error: "Post ID is required" }, { status: 400 });
        }

        await addUserFavorite(userId, postId);
        return json({ message: "Favorite added successfully" });
    } catch (error) {
        console.error("Error adding favorite:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};
