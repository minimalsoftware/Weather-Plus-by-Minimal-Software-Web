class Location {
    constructor(name, lat, lon) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
    }
}

const locationsContainer = document.querySelector(".locations-container");

/**
 * Fetches weather data for all locations from the Open-Meteo API.
 */
function fetchLocationsData() {
    const latitudes = settings.locations.map(location => location.lat).join(",");
    const longitudes = settings.locations.map(location => location.lon).join(",");

    if (settings.locations.length >= 1) {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,weather_code&timezone=auto`)
            .then(response => response.json())
            .then(data => {
                displayLocations(data);
            })
            .catch(error => console.error("Error:", error));
    }
}

let fetchedLocationsData;

/**
 * Displays the locations in the sidebar.
 * @param {Object} data The fetched weather data for all locations.
 */
function displayLocations(data) {
    fetchedLocationsData = data;

    locationsContainer.innerHTML = "";

    if (settings.locations.length > 1) {
        for (let i = 0; i < data.length; i++) {
            let location = document.createElement("div");
            location.classList.add("location");

            if (settings.activeLocation.name === settings.locations[i].name) location.classList.add("location--active");

            location.append(document.querySelector("#location-template").content.cloneNode(true));

            location.querySelector(".location__name").insertAdjacentText("afterbegin", settings.locations[i].name);
            location.querySelector(".location__time").insertAdjacentText("afterbegin", new Date().toLocaleTimeString("en-US", {
                timeZone: data[i]["timezone"],
                hour: "2-digit",
                minute: "2-digit"
            }));
            location.querySelector(".location__temperature").insertAdjacentText("afterbegin", settings.temperatureUnit === temperatureUnits.FAHRENHEIT ? `${Math.round(convertToFahrenheit(data[i]["current"]["temperature_2m"]))}°F` : `${Math.round(data[i]["current"]["temperature_2m"])}°C`);

            location.addEventListener("click", () => {
                if (editMode) return;
                settings.activeLocation = settings.locations[i] || settings.locations[0];
                console.log(settings.locations[i]);
                saveSettings();
                fetchWeather();
                if (settings.locations.length > 1) {
                    let locationElements = document.querySelectorAll(".location");
                    locationElements.forEach((locationElement, index) => {
                        locationElement.classList.toggle("location--active", index === i);
                    });
                } else {
                    location.classList.add("location--active");
                }
            });

            let deleteButton = location.querySelector(".location__delete-btn");
            deleteButton.setAttribute("onclick", `event.stopPropagation(); deleteLocation(this, ${i});`);

            const weatherCode = data[i]["current"]["weather_code"];

            location.querySelector(".location__weather-condition span").insertAdjacentText("afterbegin", getWeatherConditionDescription(weatherCode));

            locationsContainer.append(location);
        }
    } else if (settings.locations.length === 1) {
        let location = document.createElement("div");
        location.classList.add("location", "location--active");

        location.append(document.querySelector("#location-template").content.cloneNode(true));
        location.querySelector(".location__name").insertAdjacentText("afterbegin", settings.locations[0].name);
        location.querySelector(".location__time").insertAdjacentText("afterbegin", new Date().toLocaleTimeString("en-US", {
            timeZone: data["timezone"],
            hour: "2-digit",
            minute: "2-digit"
        }));
        location.querySelector(".location__temperature").insertAdjacentText("afterbegin", Math.round(data["current"]["temperature_2m"]) + "°C");

        const weatherCode = data["current"]["weather_code"];

        location.querySelector(".location__weather-condition span").insertAdjacentText("afterbegin", getWeatherConditionDescription(weatherCode));

        location.addEventListener("click", () => {
            if (editMode) return;
            settings.activeLocation = settings.locations[0];
            console.log(settings.locations[0]);
            saveSettings();
            fetchWeather();
            let locationElements = document.querySelectorAll(".location");
            locationElements.forEach((locationElement, index) => {
                locationElement.classList.toggle("location--active", index === 0);
            });
        });

        let deleteButton = location.querySelector(".location__delete-btn");
        deleteButton.setAttribute("onclick", `event.stopPropagation(); deleteLocation(this, ${0});`);

        locationsContainer.append(location);
    }

    locationsWeatherConditionMarquee();
}

/**
 * Adds marquee animation to the weather condition text if it overflows the container.
 */
function locationsWeatherConditionMarquee() {
    const marqueeContainer = document.querySelectorAll('.location');
    const marqueeSpan = document.querySelectorAll('.marquee span');
    const marquee = document.querySelectorAll('.marquee');

    for (let i = 0; i < marqueeContainer.length; i++) {
        if (marqueeSpan[i].scrollWidth + 12 > marqueeContainer[i].clientWidth && settings.sidebarState) {
            marquee[i].classList.add('animate');
        } else {
            marquee[i].classList.remove('animate');
        }
    }
}

/**
 * Attaches click listeners to the locations in the sidebar when, for example, locations are reordered.
 */
function attachLocationClickListeners() {
    document.querySelectorAll(".location").forEach((locationElement, index) => {
        locationElement.addEventListener("click", () => {
            settings.activeLocation = settings.locations[index];

            saveSettings();
            fetchWeather();
            fetchLocationsData();
        });
    });
}

window.addEventListener("DOMContentLoaded", () => {
    fetchLocationsData();
    attachLocationClickListeners();

    new Sortable(locationsContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function (/**Event*/evt) {
            const movedItem = settings.locations.splice(evt.oldIndex, 1)[0];
            settings.locations.splice(evt.newIndex, 0, movedItem);

            attachLocationClickListeners();
            saveSettings();
        },
    });
});

let locationSearch = !settings.firstConfigurationShown ? document.querySelectorAll(".location-search")[0] : document.querySelectorAll(".location-search")[1];
let locationSearchBar = !settings.firstConfigurationShown ? document.querySelectorAll(".location-search-bar")[0] : document.querySelectorAll(".location-search-bar")[1];
let autocompleteResults = !settings.firstConfigurationShown ? document.querySelectorAll(".autocomplete-results")[0] : document.querySelectorAll(".autocomplete-results")[1];
let currentIndex = -1;

/**
 * Displays the search results in the autocomplete dropdown from photon API.
 * @param {Object} data The fetched search results from the photon API.
 */
function displaySearchResults(data) {
    currentIndex = -1;
    autocompleteResults.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let result = document.createElement("div");

        result.append(document.querySelector("#autocomplete-result-template").content.cloneNode(true));
        result.classList.add("autocomplete-result");
        result.querySelector(".autocomplete-result__name").insertAdjacentText("afterbegin", data[i].properties.name);
        result.querySelector(".autocomplete-result__state").insertAdjacentText("afterbegin", `${data[i].properties.country}, ${data[i].properties.state}`);
        result.addEventListener("click", () => {
            addAndFetchLocation(new Location(data[i].properties.name, data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]));
        });

        autocompleteResults.appendChild(result);
    }

    autocompleteResults.classList.toggle("autocomplete-results--active", data.length > 0);
}

/**
 * Adds a location to the list and fetches the weather data for it.
 * @param {Location} location The location to add.
 */
function addAndFetchLocation(location) {
    if (settings.locations.some(loc => loc.name === location.name)) {
        showNotification(`Location ${location.name} is already on the list`);
        return;
    }

    mainContent.scrollTo(0, 0);

    editLocationsButton.style.display = "";

    settings.locations.unshift(location);
    settings.activeLocation = location;
    saveSettings();

    showNotification(`Successfully added location: ${location.name}`);
    fetchLocationsData();
    fetchWeather();
    clearLocationSearchBar();

    if (!settings.firstConfigurationShown) hideWelcomePage();
}

let searchBarIcon = locationSearchBar.querySelector(".search-bar__cancel-icon");

let currentFetchController = null;

/**
 * Searches for locations using the photon API.
 * @param {string} query The search query.
 */
function searchLocations(query) {
    searchBarIcon.classList.toggle("search-bar__icon--active", query.length > 0);

    if (query.length >= 2) {
        if (currentFetchController) {
            currentFetchController.abort();
        }

        currentFetchController = new AbortController();

        fetch(`https://photon.komoot.io/api/?q=${query}&layer=city&layer=locality&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&lang=default`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data.features);
            })
            .catch(() => {
            });
    } else {
        autocompleteResults.innerHTML = "";
        autocompleteResults.classList.remove("autocomplete-results--active");
    }
}

/**
 * Clears the search bar and hides the autocomplete dropdown.
 */
function clearLocationSearchBar() {
    locationSearch.value = "";
    locationSearch.blur();
    autocompleteResults.innerHTML = "";
    autocompleteResults.classList.remove("autocomplete-results--active");
    searchBarIcon.classList.remove("search-bar__icon--active");
}

document.addEventListener("click", (event) => {
    const isClickInside = autocompleteResults.contains(event.target) || locationSearchBar.contains(event.target);
    if (!isClickInside) autocompleteResults.classList.remove("autocomplete-results--active");
});

/**
 * Selects a search result using the arrow keys and the Enter key.
 * @param {KeyboardEvent} event The keyboard event.
 */
function selectWithArrowKeys(event) {
    const results = autocompleteResults.querySelectorAll(".autocomplete-result");

    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (currentIndex < results.length - 1) {
            currentIndex++;
            updateSelection(results);
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            updateSelection(results);
        }
    } else if (event.key === "Enter" && currentIndex >= 0) {
        event.preventDefault();
        results[currentIndex].click();
    }
}

locationSearch.addEventListener("keydown", (event) => {
    selectWithArrowKeys(event);
});

/**
 * Updates the selection of the search results.
 * @param results
 */
function updateSelection(results) {
    results.forEach((result, index) => {
        if (index === currentIndex) {
            result.classList.add("autocomplete-result--active");
            result.scrollIntoView({block: "nearest"});
        } else {
            result.classList.remove("autocomplete-result--active");
        }
    });
}

const editLocationsButton = document.querySelector(".edit-locations-btn");
let editMode = false;

/**
 * Toggles the edit mode for the locations in the sidebar.
 */
function toggleEditLocationMode() {
    if (!editMode) {
        document.querySelectorAll(".location").forEach(locationElement => {
            locationElement.classList.add("location--edit-mode");
        });
        editLocationsButton.querySelector("span").textContent = "Done";

        editMode = true;
    } else {
        document.querySelectorAll(".location").forEach(locationElement => {
            locationElement.classList.remove("location--edit-mode");
        });
        editLocationsButton.querySelector("span").textContent = "Edit locations";

        editMode = false;
    }
}

/**
 * Reattaches the delete buttons to the locations in the sidebar.
 */
function reattachDeleteButtons() {
    const locationElements = document.querySelectorAll(".location");
    locationElements.forEach((locationElement, index) => {
        const deleteButton = locationElement.querySelector(".location__delete-btn");
        deleteButton.setAttribute("onclick", `event.stopPropagation(); deleteLocation(this, ${index});`);
    });
}

/**
 * Reattach the click listeners to the locations in the sidebar.
 */
function reattachLocationFetch() {
    const locationElements = document.querySelectorAll(".location");
    locationElements.forEach((locationElement, index) => {
        locationElement.addEventListener("click", () => {
            settings.activeLocation = settings.locations[index];

            saveSettings();
            fetchWeather();
            fetchLocationsData();
        });
    });
}

/**
 * Deletes a location from the sidebar.
 * @param deleteButton - The delete button element.
 * @param index - The index of the location in the settings.
 */
function deleteLocation(deleteButton, index) {
    let location = deleteButton.closest(".location");
    let locationName = location.querySelector(".location__name").textContent;
    location.remove();
    settings.locations.splice(index, 1);

    showNotification(`Successfully removed location: ${locationName}`);

    if (settings.locations.length !== 0) {
        if (locationName === settings.activeLocation.name) {
            // let firstLocation = document.querySelectorAll(".location")[0];
            // firstLocation.classList.add("location--active");
            // settings.activeLocation = settings.locations[0];
        }
    }

    if (settings.locations.length === 0) {
        toggleEditLocationMode();

        settings.activeLocation = undefined;
    }

    saveSettings();
    reattachDeleteButtons();
    reattachLocationFetch();
}