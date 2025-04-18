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

import { writable } from "svelte/store";
import { get } from "svelte/store";

export const accessTokenStore = writable<string | null>(null);

export async function getAccessToken(): Promise<string | null> {
    const token = await get(accessTokenStore);
    return (token as any).token;
}

export async function refreshAccessToken(): Promise<void> {
    const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    accessTokenStore.set(data.accessToken);
}

export async function loginUser(
    username: string,
    password: string,
): Promise<void> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    await refreshAccessToken();
}

export async function registerUser(
    username: string,
    password: string,
    captcha: string,
): Promise<void> {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, captchaToken: captcha }),
    });

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    await refreshAccessToken();
}

export async function loggedIn(): Promise<boolean> {
    // const token = await new Promise<string | null>((resolve) => {
    //     accessTokenStore.subscribe((token) => {
    //         resolve(token);
    //     })();
    // });
    // return token !== null;
    const token = await getAccessToken();
    return token !== null && token !== undefined;
}
