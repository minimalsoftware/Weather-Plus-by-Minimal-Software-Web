class Location {
    constructor(name, lat, lon) {
        this.name = name;
        this.lat = lat;
        this.lon = lon;
    }
}

const locationsContainer = document.querySelector(".locations-container");

function displayNoLocationsInformation() {
    locationsContainer.innerHTML = "";
    let noLocations = document.createElement("div");
    noLocations.classList.add("no-locations");
    noLocations.textContent = "Add first location to see the weather";
    locationsContainer.append(noLocations);
}

function fetchLocationsData() {
    const lats = settings.locations.map(location => location.lat).join(",");
    const lons = settings.locations.map(location => location.lon).join(",");

    if (settings.locations.length >= 1) {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code&timezone=auto`)
            .then(response => response.json())
            .then(data => {
                displayLocations(data);
            })
            .catch(error => console.error("Error:", error));
    } else {
        displayNoLocationsInformation();
    }
}

function displayLocations(data) {
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
            location.querySelector(".location__temperature").insertAdjacentText("afterbegin", Math.round(data[i]["current"]["temperature_2m"]) + "°C");

            location.addEventListener("click", () => {
                settings.activeLocation = settings.locations[i];
                saveSettings();
                fetchWeather();
                let locationElements = document.querySelectorAll(".location");
                locationElements.forEach((locationElement, index) => {
                    locationElement.classList.toggle("location--active", index === i);
                });
            });

            const weatherCode = data[i]["current"]["weather_code"];

            location.querySelector(".location__weather-condition").insertAdjacentText("afterbegin", getWeatherConditionDescription(weatherCode));

            location.querySelector(".location__delete-btn").addEventListener("click", (event) => {
                event.stopPropagation();
                deleteLocation(i, location, settings.locations[i].name);
            });

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

        location.querySelector(".location__weather-condition").insertAdjacentText("afterbegin", getWeatherConditionDescription(weatherCode));

        location.querySelector(".location__delete-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            deleteLocation(0, location, settings.locations[0].name);
        });

        locationsContainer.append(location);
    }
}

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

const locationSearch = document.querySelector(".location-search");
const locationSearchBar = document.querySelector(".location-search-bar");
const autocompleteResults = document.querySelector(".autocomplete-results");
let currentIndex = -1;

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

function addAndFetchLocation(location) {
    if (settings.locations.some(loc => loc.name === location.name)) {
        showNotification(`Location ${location.name} is already on the list`);
        return;
    }

    mainContent.scrollTo(0, 0);

    settings.locations.unshift(location);
    settings.activeLocation = location;
    saveSettings();

    showNotification(`Successfully added location: ${location.name}`);
    fetchLocationsData();
    fetchWeather();
    clearLocationSearchBar();
}

const searchBarIcon = locationSearchBar.querySelector(".search-bar__cancel-icon");

let currentFetchController = null;

function searchLocations(query) {
    searchBarIcon.classList.toggle("search-bar__icon--active", query.length > 0);

    if (query.length >= 2) {
        if (currentFetchController) {
            currentFetchController.abort();
        }

        currentFetchController = new AbortController();
        const signal = currentFetchController.signal;

        fetch(`https://photon.komoot.io/api/?q=${query}&layer=city&layer=locality&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&lang=default`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data.features);
            })
            .catch(error => {
                if (error.name === "AbortError") {

                }
            });
    } else {
        autocompleteResults.innerHTML = "";
        autocompleteResults.classList.remove("autocomplete-results--active");
    }
}

function clearLocationSearchBar() {
    locationSearch.value = "";
    locationSearch.blur();
    autocompleteResults.innerHTML = "";
    autocompleteResults.classList.remove("autocomplete-results--active");
    searchBarIcon.classList.remove("search-bar__icon--active");
}

document.addEventListener("click", (event) => {
    const isClickInside = autocompleteResults.contains(event.target) || locationSearchBar.contains(event.target);
    if (!isClickInside) {
        autocompleteResults.classList.remove("autocomplete-results--active");
    }
});

locationSearch.addEventListener("keydown", (event) => {
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
});

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

const editLocationButton = document.querySelector(".edit-locations-btn");
let editMode = false;

function toggleEditLocationMode() {
    if (!editMode) {
        document.querySelectorAll(".location").forEach(locationElement => {
            locationElement.classList.add("location--edit-mode");
        });
        editLocationButton.querySelector("span").textContent = "Done";

        editMode = true;
    } else {
        document.querySelectorAll(".location").forEach(locationElement => {
            locationElement.classList.remove("location--edit-mode");
        });
        editLocationButton.querySelector("span").textContent = "Edit locations";

        editMode = false;
    }
}

function deleteLocation(locationIndex, locationElement, locationName) {
    settings.locations.splice(locationIndex, 1);
    if (settings.activeLocation.name === locationElement.querySelector(".location__name").textContent) {
        settings.activeLocation = settings.locations[0];
        saveSettings();
        fetchWeather();
    }

    locationElement.remove();

    showNotification(`Location ${locationName} successfully removed`);

    if (settings.locations.length === 0) {
        displayNoLocationsInformation();
        toggleEditLocationMode();
    }
}