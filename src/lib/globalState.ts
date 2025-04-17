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
        update(updaterFn: (settings: UserSettings) => UserSettings) {
            update(settings => {
                const updatedSettings = updaterFn(settings);
                if (browser) {
                    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
                }
                return updatedSettings;
            });
        },
        reset() {
            if (browser) {
                localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
            }
            set(defaultSettings);
        }
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
            update(favorites => {
                const updatedFavorites = [...favorites, id];
                if (browser) {
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                }
                return updatedFavorites;
            });
        },
        remove(id: string) {
            update(favorites => {
                const updatedFavorites = favorites.filter(favId => favId !== id);
                if (browser) {
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                }
                return updatedFavorites;
            });
        },
        has(id: string) {
            let result = false;
            subscribe(favorites => {
                result = favorites.includes(id);
            })();
            return result;
        },
        reset() {
            if (browser) {
                localStorage.removeItem("favorites");
            }
            set([]);
        }
    };
}

export const favorites = createFavoritesStore();
export const userSettings = createSettingsStore();
