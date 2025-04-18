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

import { ExpiringMap } from "expiring-types";
import svgCaptcha from "svg-captcha";
import { randomBytes } from "crypto";

interface idk {
    text: string;
    valid: boolean;
}

const captchaStore = new ExpiringMap<string, idk>(5 * 60 * 1000);

export function isValid(token: string): boolean {
    const valid = captchaStore.get(token)?.valid;
    if (valid) {
        captchaStore.delete(token);
    }

    return valid === true;
}

function generateToken() {
    const token = randomBytes(16).toString("hex");
    return token;
}

export function generateCaptcha() {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: "0o1l",
        noise: 3,
        color: true,
        background: "#f0f0f0",
        width: 88,
        height: 31,
    });

    const token = generateToken();

    captchaStore.set(token, {
        text: captcha.text,
        valid: false,
    });

    return {
        data: captcha.data,
        token: token,
    };
}

export function validateCaptcha(token: string, text: string): boolean {
    const storedText = captchaStore.get(token)?.text;

    if (!storedText) {
        return false;
    }

    const isValid = storedText.toLowerCase() === text.toLowerCase();

    if (isValid) {
        captchaStore.set(token, {
            text: storedText,
            valid: true,
        });
    }

    return isValid;
}
