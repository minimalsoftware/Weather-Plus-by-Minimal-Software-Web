import { writable, derived } from 'svelte/store';
import { settings } from './settings.js';

export const themes = Object.freeze({
    LIGHT: "light",
    DARK: "dark",
    AUTO: "auto",
});

function createTheme() {
    const { subscribe, set } = writable(themes.AUTO);
    
    return {
        subscribe,
        toggle: (newTheme) => {
            set(newTheme);
            settings.update(s => {
                s.theme = newTheme;
                localStorage.setItem("settings", JSON.stringify(s));
                return s;
            });
            
            let actualTheme = newTheme;
            if (newTheme === themes.AUTO) {
                actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;
            }
            
            document.documentElement.setAttribute("data-theme", actualTheme);
            
            if (actualTheme === themes.LIGHT) {
                const mainContent = document.querySelector(".main-content");
                if (mainContent) mainContent.style.backgroundColor = "";
            } else {
                const mainContent = document.querySelector(".main-content");
                if (mainContent) mainContent.style.backgroundColor = "#080C12";
            }
            
            changeIconColor(actualTheme === themes.LIGHT);
        }
    };
}

function changeIconColor(isLight = false) {
    const mainColorIcons = document.querySelectorAll(".icon--main-color");
    for (let icon of mainColorIcons) {
        icon.style.filter = isLight ? "" : "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(2%) hue-rotate(219deg) brightness(101%) contrast(101%)";
    }
    
    const grayIcons = document.querySelectorAll(".icon--gray");
    for (let icon of grayIcons) {
        icon.style.filter = isLight ? "" : "invert(100%)";
    }
}

export const theme = createTheme();

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        settings.subscribe(s => {
            if (s.theme === themes.AUTO) {
                theme.toggle(themes.AUTO);
            }
        })();
    });
}
