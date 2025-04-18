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

import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface UserSettings {
    gridLayout: boolean;
    nsfw: boolean;
    defaultTags: string;
}

const defaultSettings: UserSettings = {
    gridLayout: false,
    nsfw: false,
    defaultTags: "",
};

function createSettingsStore() {
    const initialSettings = browser
        ? JSON.parse(
              localStorage.getItem("userSettings") ||
                  JSON.stringify(defaultSettings),
          )
        : defaultSettings;

    const { subscribe, set, update } = writable<UserSettings>(initialSettings);

    return {
        subscribe,
        set(settings: UserSettings) {
            if (browser) {
                localStorage.setItem("userSettings", JSON.stringify(settings));
            }
            set(settings);
        },
        get() {
            let result: UserSettings = defaultSettings;
            subscribe((settings) => {
                result = settings;
            })();
            return result;
        },
        update(updaterFn: (settings: UserSettings) => UserSettings) {
            update((settings) => {
                const updatedSettings = updaterFn(settings);
                if (browser) {
                    localStorage.setItem(
                        "userSettings",
                        JSON.stringify(updatedSettings),
                    );
                }
                return updatedSettings;
            });
        },
        reset() {
            if (browser) {
                localStorage.setItem(
                    "userSettings",
                    JSON.stringify(defaultSettings),
                );
            }
            set(defaultSettings);
        },
    };
}

function createFavoritesStore() {
    const initialFavorites = browser
        ? JSON.parse(localStorage.getItem("favorites") || "[]")
        : [];

    const { subscribe, set, update } = writable<string[]>(initialFavorites);

    return {
        subscribe,
        add(id: string) {
            update((favorites) => {
                const updatedFavorites = [...favorites, id];
                if (browser) {
                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(updatedFavorites),
                    );
                }
                return updatedFavorites;
            });
        },
        remove(id: string) {
            update((favorites) => {
                const updatedFavorites = favorites.filter(
                    (favId) => favId !== id,
                );
                if (browser) {
                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(updatedFavorites),
                    );
                }
                return updatedFavorites;
            });
        },
        get() {
            let result: string[] = [];
            subscribe((favorites) => {
                result = favorites;
            })();
            return result;
        },
        has(id: string) {
            let result = false;
            subscribe((favorites) => {
                result = favorites.includes(id);
            })();
            return result;
        },
        reset() {
            if (browser) {
                localStorage.removeItem("favorites");
            }
            set([]);
        },
    };
}

export const favorites = createFavoritesStore();
export const userSettings = createSettingsStore();
