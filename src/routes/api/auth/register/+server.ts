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
import type { RequestHandler } from "@sveltejs/kit";
import { register } from "$lib/server/auth";
import { isValid } from "$lib/server/captcha.js";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { username, password, captchaToken } = await request.json();

        if (!username || !password || !captchaToken) {
            throw error(400, "Missing required fields");
        }

        if (!isValid(captchaToken)) {
            throw error(400, "Invalid captcha");
        }

        if (username.length < 3) {
            throw error(400, "Username must be at least 3 characters long");
        }

        if (password.length < 5) {
            throw error(400, "Password must be at least 5 characters long");
        }

        if (password.length > 100) {
            throw error(400, "Password must be less than 100 characters long");
        }

        if (username.length > 100) {
            throw error(400, "Username must be less than 100 characters long");
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            throw error(400, "Username can only contain letters and numbers");
        }

        try {
            const { refreshToken } = await register(username, password);
            cookies.set("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            return json({ success: true });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "User already exists") {
                    throw error(409, "User already exists");
                }
                if (err.message === "Invalid password") {
                    throw error(400, "Invalid password");
                }
                if (err.message === "Missing required fields") {
                    throw error(400, "Missing required fields");
                }
                throw error(500, "Internal Server Error: " + err.message);
            }
            throw error(500, "Unknown internal server error");
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err);
            throw error(500, "Internal Server Error: " + err.message);
        }

        console.error(err);
        throw error(500, "Internal Server Error");
    }
};
