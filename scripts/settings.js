function openSettings() {
    const settingsModal = document.querySelector(".settings");
    settingsModal.classList.add("modal--active");
    showOverlay();

    document.querySelector(".overlay").addEventListener("click", function (e) {
        if (!settingsModal.contains(e.target) && settingsModal.classList.contains("map--active")) {
            closeSettings();
        }
    });
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