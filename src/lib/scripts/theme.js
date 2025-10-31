const themes = Object.freeze({
    LIGHT: "light",
    DARK: "dark",
    AUTO: "auto",
});

/**
 * Toggles the theme of the website.
 * @param theme The theme to toggle.
 * @param initialLoad Whether the function is called on an initial load.
 */
function toggleTheme(theme, initialLoad = false) {
    settings.theme = theme;
    saveSettings();

    let index;

    if (theme === themes.AUTO) {
        settings.theme = themes.AUTO;

        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;
    }

    if (theme === themes.LIGHT) {
        document.documentElement.setAttribute("data-theme", "light");
        document.querySelector(".main-content").style.backgroundColor = "";

        if (!initialLoad) displayWeatherData(fetchedData);
        changeIconColor(true);
    } else {
        index = 1;

        document.documentElement.setAttribute("data-theme", "dark");
        document.querySelector(".main-content").style.backgroundColor = "#080C12";

        if (!initialLoad) displayWeatherData(fetchedData);
        changeIconColor();
    }

    if (initialLoad) {
        const segmentedButtonTheme = document.querySelector("#segmented-button--theme");

        switch (settings.theme) {
            case themes.LIGHT:
                index = 0;
                break;
            case themes.DARK:
                index = 1;
                break;
            case themes.AUTO:
                index = 2;
                break;
        }
        setActiveButton(segmentedButtonTheme, index);
    }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (settings.theme === themes.AUTO) toggleTheme(themes.AUTO);
});

/**
 * Changes the colour of the icons for a dark theme.
 * @param revert Whether to revert the colour change.
 */
function changeIconColor(revert = false) {
    const mainColorIcons = document.querySelectorAll(".icon--main-color");
    for (let icon of mainColorIcons) {
        icon.style.filter = revert ? "" : "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(2%) hue-rotate(219deg) brightness(101%) contrast(101%)";
    }

    const grayIcons = document.querySelectorAll(".icon--gray");
    for (let icon of grayIcons) {
        icon.style.filter = revert ? "" : "invert(100%)";
    }
}