function hideWelcomePage() {
    document.querySelector(".welcome").classList.remove("welcome--active");
    settings.firstConfigurationShown = true;
    saveSettings();
    hideOverlay();
}

function showWelcomePage() {
    document.querySelector(".welcome").classList.add("welcome--active");
    showOverlay();
}

function showOverlay() {
    document.querySelector(".overlay").classList.add("overlay--active");
}

function hideOverlay() {
    document.querySelector(".overlay").classList.remove("overlay--active");
}

// TODO: Implement format date functionality
function formatDate(date) {


    return date;
}

function round(value, precision = 0) {
    const exponent = Math.pow(10, precision);
    return Math.round(value * exponent) / exponent;
}

