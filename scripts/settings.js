function openSettings() {
    document.querySelector(".settings").classList.add("modal--active");
    showOverlay();
}

function closeSettings() {
    document.querySelector(".settings").classList.remove("modal--active");
    hideOverlay();
}

function changeTemperatureUnit(unit) {
    settings.temperatureUnit = unit;
    saveSettings();
    displayLocations(fetchedLocationsData);
    displayWeatherData(fetchedData);
}

function changeWindUnit(unit) {
    settings.windUnit = unit;
    saveSettings();
    displayWeatherData(fetchedData);
}

function changePressureUnit(unit) {
    settings.pressureUnit = unit;
    saveSettings();
    displayWeatherData(fetchedData);
}