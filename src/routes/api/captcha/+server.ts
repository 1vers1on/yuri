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
