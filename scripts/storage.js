let defaultLocations = [...(JSON.parse(localStorage.getItem("locations")) ?? [
    new Location("London", 51.509865, -0.118092),
    new Location("New York", 40.730610, -73.935242),
    new Location("Tokyo", 35.652832, 139.839478),
    new Location("Sydney", -33.865143, 151.209900),
])];


let settings = {
    sidebarState: JSON.parse(localStorage.getItem("sidebarState")) ?? true,
    locations: defaultLocations,
    activeLocation: defaultLocations[0],
    firstConfigurationShown: false,
    sidebarWidth: 300,
}

settings = JSON.parse(localStorage.getItem("settings")) ?? settings;

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

window.addEventListener("DOMContentLoaded", () => {
    if (!settings.firstConfigurationShown) showWelcomePage();
});