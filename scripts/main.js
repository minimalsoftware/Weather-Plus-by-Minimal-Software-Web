function hideWelcomePage() {
    document.querySelector(".welcome").classList.remove("welcome--active");
    settings.firstConfigurationShown = true;

    saveSettings();
    hideOverlay();

    locationSearch =  document.querySelectorAll(".location-search")[1];
    locationSearchBar = document.querySelectorAll(".location-search-bar")[1];
    autocompleteResults = document.querySelectorAll(".autocomplete-results")[1];

    locationSearch.addEventListener("keydown", (event) => {
        selectWithArrowKeys(event);
    });

    searchBarIcon = locationSearchBar.querySelector(".search-bar__cancel-icon");
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

function switchModalSubpage(modalId, targetSubpageId) {
    const modal = document.querySelector(`#${modalId}`);
    const subpages = modal.querySelectorAll(".modal__subpage");
    const targetSubpage = modal.querySelector(`#${targetSubpageId}`);

    subpages.forEach(subpage => {
        subpage.classList.remove("modal-subpage--active");
    });

    targetSubpage.classList.add("modal-subpage--active");
}