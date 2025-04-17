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

function createSettingsState() {
    const initialSettings = browser
        ? JSON.parse(
              localStorage.getItem("userSettings") ||
                  JSON.stringify(defaultSettings),
          )
        : defaultSettings;

    // Create the state container
    const state = $state({
        settings: initialSettings as UserSettings
    });

    // Helper to save to localStorage
    function saveSettings(settings: UserSettings) {
        if (browser) {
            localStorage.setItem("userSettings", JSON.stringify(settings));
        }
    }

    return {
        get settings() {
            return state.settings;
        },
        
        set(settings: UserSettings) {
            state.settings = settings;
            saveSettings(settings);
        },
        
        update(updaterFn: (settings: UserSettings) => UserSettings) {
            const updatedSettings = updaterFn(state.settings);
            state.settings = updatedSettings;
            saveSettings(updatedSettings);
            return updatedSettings;
        },
        
        reset() {
            state.settings = defaultSettings;
            saveSettings(defaultSettings);
        }
    };
}

function createFavoritesState() {
    const initialFavorites = browser
        ? JSON.parse(localStorage.getItem("favorites") || "[]")
        : [];

    const state = $state({
        favorites: initialFavorites as string[]
    });

    function saveFavorites(favorites: string[]) {
        if (browser) {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }

    return {
        get favorites() {
            return state.favorites;
        },
        
        add(id: string) {
            const updatedFavorites = [...state.favorites, id];
            state.favorites = updatedFavorites;
            saveFavorites(updatedFavorites);
            return updatedFavorites;
        },
        
        remove(id: string) {
            const updatedFavorites = state.favorites.filter(
                (favId) => favId !== id
            );
            state.favorites = updatedFavorites;
            saveFavorites(updatedFavorites);
            return updatedFavorites;
        },
        
        has(id: string) {
            return state.favorites.includes(id);
        },
        
        reset() {
            state.favorites = [];
            if (browser) {
                localStorage.removeItem("favorites");
            }
        }
    };
}

export const favorites = createFavoritesState();
export const userSettings = createSettingsState();
