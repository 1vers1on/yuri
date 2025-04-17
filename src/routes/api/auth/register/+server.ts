import { json, error } from "@sveltejs/kit";
import { register } from "$lib/server/auth";
import { isValid } from "$lib/server/captcha.js";

export async function POST({ request, cookies }) {
    const { username, password, captchaToken } = await request.json();
    try {
        if (!username || !password || !captchaToken) {
            return error(400, "Missing required fields");
        }

        if (!isValid(captchaToken)) {
            return error(400, "Invalid captcha");
        }

        if (username.length < 3) {
            return error(400, "Username must be at least 3 characters long");
        }

        if (password.length < 5) {
            return error(400, "Password must be at least 5 characters long");
        }

        if (password.length > 100) {
            return error(400, "Password must be less than 100 characters long");
        }

        if (username.length > 100) {
            return error(400, "Username must be less than 100 characters long");
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return error(400, "Username can only contain letters and numbers");
        }

        try {
            const { refreshToken } = await register(username, password);
            cookies.set("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return json({ success: true });
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === "User already exists") {
                    return error(409, "User already exists");
                }

                if (err.message === "Invalid password") {
                    return error(400, "Invalid password");
                }

                return error(500, "Internal Server Error");
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            return error(500, err.message);
        }
    }
}
