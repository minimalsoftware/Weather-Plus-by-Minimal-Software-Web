/**
 * Changes and saves temperature unit.
 * @param unit The temperature unit to select.
 */
function changeTemperatureUnit(unit) {
    settings.temperatureUnit = unit;
    saveSettings();
    displayLocations(fetchedLocationsData);
    displayWeatherData(fetchedData);
}

/**
 * Changes and saves wind unit.
 * @param unit The wind unit to select.
 */
function changeWindUnit(unit) {
    settings.windUnit = unit;
    saveSettings();
    displayWeatherData(fetchedData);
}

/**
 * Changes and saves pressure unit.
 * @param unit The pressure unit to select.
 */
function changePressureUnit(unit) {
    settings.pressureUnit = unit;
    saveSettings();
    displayWeatherData(fetchedData);
}

/**
 * Toggles and saves the lock of the weather page layout.
 */
function toggleWeatherPageLayoutLocked() {
    settings.weatherPageLayoutLocked = !settings.weatherPageLayoutLocked;
    saveSettings();
    initializeSortable();
}