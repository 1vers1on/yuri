import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface UserSettings {
    gridLayout: boolean;
    nsfw: boolean;
}

const defaultSettings: UserSettings = {
    gridLayout: false,
    nsfw: false,
};


function createSettingsStore() {
    const initialSettings = browser
        ? JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(defaultSettings))
        : defaultSettings;

    const { subscribe, set, update } = writable<UserSettings>(initialSettings);

    return {
        subscribe,
        set: (settings: UserSettings) => {
            set(settings);
            if (browser) {
                localStorage.setItem('userSettings', JSON.stringify(settings));
            }
        },
        update: (updaterFn: (settings: UserSettings) => UserSettings) => {
            update(settings => {
                const updatedSettings = updaterFn(settings);
                if (browser) {
                    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
                }
                return updatedSettings;
            });
        },
        reset: () => {
            set(defaultSettings);
            if (browser) {
                localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
            }
        }
    };
}

export const userSettings = createSettingsStore();
