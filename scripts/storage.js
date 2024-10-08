let defaultLocations = [...(JSON.parse(localStorage.getItem("locations")) ?? [])];

const temperatureUnits = Object.freeze({
    CELSIUS: {value: "C"},
    FAHRENHEIT: {value: "F"},
});

const windUnits = Object.freeze({
    KPH: {value: "km/h"},
    MPH: {value: "mph"},
});

const pressureUnits = Object.freeze({
    HPA: {value: "hPa"},
    MBAR: {value: "mBar"},
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

/**
 * Saves the settings object to the local storage in JSON format.
 */
function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

window.addEventListener("DOMContentLoaded", () => {
    if (!settings.firstConfigurationShown) showWelcomePage();
    toggleTheme(settings.theme, true);
    setActiveButton(document.querySelector("#segmented-button--temperature"), settings.temperatureUnit.value === temperatureUnits.CELSIUS.value ? 0 : 1);
    setActiveButton(document.querySelector("#segmented-button--wind"), settings.windUnit.value === windUnits.KPH.value ? 0 : 1);
    setActiveButton(document.querySelector("#segmented-button--pressure"), settings.pressureUnit.value === pressureUnits.HPA.value ? 0 : 1);
    document.querySelector("#switch-weather-page-layout-lock").checked = settings.weatherPageLayoutLocked;
});