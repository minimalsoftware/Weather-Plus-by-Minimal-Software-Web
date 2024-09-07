function hideWelcomePage() {
    document.querySelector(".welcome").classList.remove("welcome--active");
    settings.firstConfigurationShown = true;
    saveSettings();
    hideModal();
}

function showWelcomePage() {
    document.querySelector(".welcome").classList.add("welcome--active");
    showModal();
}

function showModal() {
    document.querySelector(".modal").classList.add("modal--active");
}

function hideModal() {
    document.querySelector(".modal").classList.remove("modal--active");
}



