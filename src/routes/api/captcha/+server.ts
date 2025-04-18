import { json } from "@sveltejs/kit";
import { generateCaptcha, validateCaptcha } from "$lib/server/captcha";

export async function GET() {
    const captcha = generateCaptcha();

    return json(captcha);
}

export async function POST({ request }) {
    const { token, text } = await request.json();

    if (!token || !text) {
        return new Response("Missing token or text", { status: 400 });
    }

    const isValid = validateCaptcha(token, text);

    if (!isValid) {
        return new Response("Invalid captcha", { status: 400 });
    }

    return json({ success: true });
}
