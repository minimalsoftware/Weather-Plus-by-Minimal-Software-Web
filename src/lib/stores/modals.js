import { writable } from 'svelte/store';

function createModalStore() {
    const { subscribe, set, update } = writable({
        settings: false,
        welcome: false,
        precipitation: false,
        airQuality: false,
        wind: false,
        uvIndex: false,
        astronomy: false,
        map: false
    });
    
    return {
        subscribe,
        open: (modalName) => {
            update(modals => {
                modals[modalName] = true;
                return modals;
            });
        },
        close: (modalName) => {
            update(modals => {
                modals[modalName] = false;
                return modals;
            });
        },
        toggle: (modalName) => {
            update(modals => {
                modals[modalName] = !modals[modalName];
                return modals;
            });
        }
    };
}

export const modals = createModalStore();
