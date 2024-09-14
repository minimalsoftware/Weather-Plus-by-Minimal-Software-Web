let defaultLocations = [...(JSON.parse(localStorage.getItem("locations")) ?? [])];

const temperatureUnits = Object.freeze({
    CELSIUS: "C",
    FAHRENHEIT: "F",
});

const windUnits = Object.freeze({
    KPH: "km/h",
    MPH: "mph",
});

const pressureUnits = Object.freeze({
    HPA: "hPa",
    MBAR: "mBar",
});

let settings = {
    sidebarState: JSON.parse(localStorage.getItem("sidebarState")) ?? true,
    locations: defaultLocations,
    activeLocation: defaultLocations[0],
    firstConfigurationShown: false,
    sidebarWidth: 300,
    theme: themes.AUTO,
    temperatureUnit: temperatureUnits.CELSIUS,
    windUnit: windUnits.KPH,
    pressureUnit: pressureUnits.HPA,
    weatherPageLayoutLocked: false,
    lastWeatherFetchDateTime: undefined,
}

settings = JSON.parse(localStorage.getItem("settings")) ?? settings;

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

window.addEventListener("DOMContentLoaded", () => {
    if (!settings.firstConfigurationShown) showWelcomePage();
    toggleTheme(settings.theme, true);
    setActiveButton(document.querySelector("#segmented-button--temperature"), settings.temperatureUnit === temperatureUnits.CELSIUS ? 0 : 1);
    setActiveButton(document.querySelector("#segmented-button--wind"), settings.windUnit === windUnits.KPH ? 0 : 1);
    setActiveButton(document.querySelector("#segmented-button--pressure"), settings.pressureUnit === pressureUnits.HPA ? 0 : 1);
    document.querySelector("#switch-weather-page-layout-lock").checked = settings.weatherPageLayoutLocked;
});