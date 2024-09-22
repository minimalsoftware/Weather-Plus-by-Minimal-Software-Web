/**
 * The main script for the application.
 */
function hideWelcomePage() {
    document.querySelector(".welcome").classList.remove("welcome--active");
    settings.firstConfigurationShown = true;

    saveSettings();
    hideOverlay();

    locationSearch = document.querySelectorAll(".location-search")[1];
    locationSearchBar = document.querySelectorAll(".location-search-bar")[1];
    autocompleteResults = document.querySelectorAll(".autocomplete-results")[1];

    locationSearch.addEventListener("keydown", (event) => {
        selectWithArrowKeys(event);
    });

    searchBarIcon = locationSearchBar.querySelector(".search-bar__cancel-icon");
}

/**
 * Shows the welcome page.
 */
function showWelcomePage() {
    let welcomeElement = document.querySelector(".welcome");
    welcomeElement.style.display = "flex";
    setTimeout(() => {
        welcomeElement.classList.add("welcome--active");
    }, 1);
    showOverlay();
}

/**
 * Shows the overlay.
 */
function showOverlay() {
    document.querySelector(".overlay").classList.add("overlay--active");
}

/**
 * Hides the overlay.
 */
function hideOverlay() {
    document.querySelector(".overlay").classList.remove("overlay--active");
}

/**
 * Rounds a number to a specific precision.
 * @param value
 * @param precision
 * @returns {number}
 */
function round(value, precision = 0) {
    const exponent = Math.pow(10, precision);
    return Math.round(value * exponent) / exponent;
}

/**
 * Changes subpage in a modal.
 * @param modalId - The id of the modal.
 * @param targetSubpageId - The id of the target subpage.
 */
function switchModalSubpage(modalId, targetSubpageId) {
    const modal = document.querySelector(`#${modalId}`);
    const subpages = modal.querySelectorAll(".modal__subpage");
    const targetSubpage = modal.querySelector(`#${targetSubpageId}`);

    subpages.forEach(subpage => {
        subpage.classList.remove("modal-subpage--active");
    });

    targetSubpage.classList.add("modal-subpage--active");
}