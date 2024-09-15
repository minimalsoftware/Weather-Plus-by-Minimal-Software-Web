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