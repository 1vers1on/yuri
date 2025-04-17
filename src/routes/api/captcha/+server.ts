import { error, json } from "@sveltejs/kit";
import { generateCaptcha, validateCaptcha } from "$lib/server/captcha";

export async function GET() {
    const captcha = generateCaptcha();

    return json(captcha);
}

export async function POST({ request }) {
    const { token, text } = await request.json();

    if (!token || !text) {
        throw error(400, "Missing token or text");
    }

    const isValid = validateCaptcha(token, text);

    if (!isValid) {
        throw error(400, "Invalid captcha");
    }

    return json({ success: true });
}
