import { json, error } from "@sveltejs/kit";
import { login } from "$lib/server/auth";
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

        try {
            const { refreshToken } = await login(username, password);
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
                if (err.message === "User not found") {
                    return error(404, "User not found");
                }

                if (err.message === "Invalid password") {
                    return error(401, "Invalid password");
                }

                return error(500, "Internal Server Error");
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            return error(500, "Internal Server Error");
        }
    }
}
