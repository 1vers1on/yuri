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
                cookies.delete("refreshToken", { path: '/' });
                throw error(401, "Unauthorized");
            }

            if (err.message === "Refresh token expired") {
                cookies.delete("refreshToken", { path: '/' });
                throw error(401, "Unauthorized");
            }

            if (err.message === "User not found") {
                cookies.delete("refreshToken", { path: '/' });
                throw error(401, "Unauthorized");
            }
        }
        throw error(500, "Internal Server Error");
    }
}
