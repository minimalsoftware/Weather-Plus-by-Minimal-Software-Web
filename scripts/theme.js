const themes = Object.freeze({
    LIGHT: "light",
    DARK: "dark",
    AUTO: "auto",
});

function toggleTheme(theme, initialLoad = false, ) {
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

        changeIconColor(true);
        if (!initialLoad) displayWeatherData(fetchedData);
    } else {
        index = 1;

        document.documentElement.setAttribute("data-theme", "dark");
        document.querySelector(".main-content").style.backgroundColor = "#080C12";

        changeIconColor();
        if (!initialLoad) displayWeatherData(fetchedData);
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
        console.log(index);
        setActiveButton(segmentedButtonTheme, index);
    }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    console.log("Theme changed" + settings.theme);

    if (settings.theme === themes.AUTO) toggleTheme(themes.AUTO);
});

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