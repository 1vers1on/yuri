import { writable } from "svelte/store";
import { browser } from "$app/environment";

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
        set: (settings: UserSettings) => {
            set(settings);
            if (browser) {
                localStorage.setItem("userSettings", JSON.stringify(settings));
            }
        },
        update: (updaterFn: (settings: UserSettings) => UserSettings) => {
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
        reset: () => {
            set(defaultSettings);
            if (browser) {
                localStorage.setItem(
                    "userSettings",
                    JSON.stringify(defaultSettings),
                );
            }
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
        add: (id: string) =>
            update((favorites) => {
                const updatedFavorites = [...favorites, id];
                if (browser) {
                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(updatedFavorites),
                    );
                }
                return updatedFavorites;
            }),
        remove: (id: string) =>
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
            }),
        has: (id: string) => {
            let favorites: string[] = [];
            if (browser) {
                favorites = JSON.parse(
                    localStorage.getItem("favorites") || "[]",
                );
            }
            return favorites.includes(id);
        },
        reset: () => {
            set([]);
            if (browser) {
                localStorage.removeItem("favorites");
            }
        },
    };
}

export const favorites = createFavoritesStore();
export const userSettings = createSettingsStore();
