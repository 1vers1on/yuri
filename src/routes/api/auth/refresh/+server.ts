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

import { json, error } from "@sveltejs/kit";
import { refresh } from "$lib/server/auth";

export async function POST({ cookies }) {
    const refreshToken = cookies.get("refreshToken");
    if (!refreshToken) {
        throw error(401, "Unauthorized");
    }

    try {
        const accessToken = await refresh(refreshToken);
        return json({ accessToken });
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Invalid refresh token") {
                cookies.delete("refreshToken", { path: "/" });
                throw error(401, "Unauthorized");
            }

            if (err.message === "Refresh token expired") {
                cookies.delete("refreshToken", { path: "/" });
                throw error(401, "Unauthorized");
            }

            if (err.message === "User not found") {
                cookies.delete("refreshToken", { path: "/" });
                throw error(401, "Unauthorized");
            }
        }
        throw error(500, "Internal Server Error");
    }
}
