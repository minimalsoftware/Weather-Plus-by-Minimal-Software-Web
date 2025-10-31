import { writable } from 'svelte/store';

export const temperatureUnits = Object.freeze({
    CELSIUS: { value: "C" },
    FAHRENHEIT: { value: "F" },
});

export const windUnits = Object.freeze({
    KPH: { value: "km/h" },
    MPH: { value: "mph" },
});

export const pressureUnits = Object.freeze({
    HPA: { value: "hPa" },
    MBAR: { value: "mBar" },
});

// Load default settings from localStorage
const loadSettings = () => {
    const defaultLocations = JSON.parse(localStorage.getItem("locations")) ?? [];
    const storedSettings = localStorage.getItem("settings");
    
    const defaultSettings = {
        sidebarState: JSON.parse(localStorage.getItem("sidebarState")) ?? true,
        locations: defaultLocations,
        activeLocation: defaultLocations[0],
        firstConfigurationShown: false,
        sidebarWidth: 300,
        theme: 'auto',
        temperatureUnit: temperatureUnits.CELSIUS,
        windUnit: windUnits.KPH,
        pressureUnit: pressureUnits.HPA,
        weatherPageLayoutLocked: false,
        lastWeatherFetchDateTime: undefined,
    };
    
    return storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings;
};

function createSettings() {
    const { subscribe, set, update } = writable(loadSettings());
    
    return {
        subscribe,
        set,
        update,
        save: () => {
            update(s => {
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
        },
        updateTemperatureUnit: (unit) => {
            update(s => {
                s.temperatureUnit = unit;
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
        },
        updateWindUnit: (unit) => {
            update(s => {
                s.windUnit = unit;
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
        },
        updatePressureUnit: (unit) => {
            update(s => {
                s.pressureUnit = unit;
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
        },
        toggleLayoutLock: () => {
            update(s => {
                s.weatherPageLayoutLocked = !s.weatherPageLayoutLocked;
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
        }
    };
}

export const settings = createSettings();
