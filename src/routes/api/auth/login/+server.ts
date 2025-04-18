import { json, error } from "@sveltejs/kit";
import { login } from "$lib/server/auth";

export async function POST({ request, cookies }) {
    const { username, password } = await request.json();
    try {
        if (!username || !password) {
            return error(400, "Missing required fields");
        }
        
        try {
            const { refreshToken } = await login(username, password);
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
