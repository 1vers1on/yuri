import { ExpiringMap } from "expiring-types";
import svgCaptcha from "svg-captcha";
import { randomBytes } from "crypto";

const captchaStore = new ExpiringMap<string, string>(5 * 60 * 1000);

function generateToken() {
    const token = randomBytes(16).toString("hex");
    return token;
}

export function generateCaptcha() {
    const captcha = svgCaptcha.create({
        size: 6,
        ignoreChars: "0o1l",
        noise: 3,
        color: true,
        background: "#f0f0f0",
        width: 88,
        height: 31,
    });

    const token = generateToken();

    captchaStore.set(token, captcha.text);

    return {
        data: captcha.data,
        token: token,
    };
}

export function validateCaptcha(token: string, text: string): boolean {
    const storedText = captchaStore.get(token);

    if (!storedText) {
        return false;
    }

    const isValid = storedText.toLowerCase() === text.toLowerCase();

    if (isValid) {
        captchaStore.delete(token);
    }

    return isValid;
}
