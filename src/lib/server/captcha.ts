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
        size: 6,
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
