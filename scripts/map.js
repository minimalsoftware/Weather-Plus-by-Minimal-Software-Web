let map, selectedLocationLon, selectedLocationLat, selectedLocationName;

class MapLayer {
    constructor(name, url, attribution, darkThemeUrl = "", ext = "png", maxZoom = 18) {
        this.name = name;
        this.url = url;
        this.darkThemeUrl = darkThemeUrl;
        this.attribution = attribution;
        this.ext = ext;
        this.maxZoom = maxZoom;
    }
}

let mapLayers = [
    new MapLayer("OpenStreetMap", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors", "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}", "png", 18),
    new MapLayer("Stadia Maps", "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}", '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>', "", "jpg", 15),
];

let activeMapLayer = mapLayers[0];

/**
 * Opens the map where user can select desired location.
 * @param fromFirstConfiguration
 */
function openMap(fromFirstConfiguration = false) {
    if (map) clearMap();

    document.addEventListener("keydown", function handler(e) {
        if (e.key === "Escape") closeMap();
        document.removeEventListener("keydown", handler);
    });

    showOverlay();

    document.querySelector(".map").classList.add("map--active");

    if (!map) {
        map = L.map('osm', {
            attributionControl: false,
            zoom: settings.activeLocation ? 10 : 2,
            zoomControl: false
        }).setView([settings.activeLocation?.lat ?? 0, settings.activeLocation?.lon ?? 0]);

        let theme = settings.theme;
        if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

        let layerUrl = theme === "dark" ? mapLayers[0].darkThemeUrl : mapLayers[0].url;

        L.tileLayer(layerUrl, {
            minZoom: 0,
            maxZoom: 18,
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            ext: mapLayers[0].ext,
        }).addTo(map);

        L.control.attribution({
            prefix: false
        }).addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors').addTo(map);

        document.querySelector(".map__zoom-in").addEventListener("click", () => {
            map.setZoom(map.getZoom() + 1);
        });

        document.querySelector(".map__zoom-out").addEventListener("click", () => {
            map.setZoom(map.getZoom() - 1);
        });

        map.on('click', function (e) {
            document.querySelector(".map__selected-location").classList.add("map__selected-location--active");

            const lat = e.latlng.lat;
            const lon = e.latlng.lng;

            document.querySelector(".map__selected-location .lat").textContent = `Latitude: ${round(lat, 2)}`;
            document.querySelector(".map__selected-location .lon").textContent = `Longitude: ${round(lon, 2)}`;

            map.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            L.marker([lat, lon], {
                icon: L.divIcon({
                    html: `<img src="../graphics/svg/location-on-main-color.svg" class="marker-animated" style="width: 50px; height: 82px;" alt="Marker">`,
                    iconSize: [50, 82],
                    iconAnchor: [25, 60],
                })
            }).addTo(map);

            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=auto`)
                .then(response => response.json())
                .then(data => {
                    let locationName = data.address.town ?? data.address.city ?? data.address.village ?? data.address.county ?? data.address.state;
                    document.querySelector(".map__selected-location .name").textContent = locationName;
                    document.querySelector(".map__selected-location .name").textContent += `, ${data.address.country}`;

                    selectedLocationLat = lat;
                    selectedLocationLon = lon;
                    selectedLocationName = locationName;
                });
        });
    } else {
        map.setView([settings.activeLocation?.lat ?? 0, settings.activeLocation?.lon ?? 0]);
    }

    document.querySelector(".overlay").addEventListener("click", function (e) {
        const mapElement = document.querySelector(".map");
        if (!mapElement.contains(e.target) && mapElement.classList.contains("map--active")) {
            closeMap();
        }
    });
}

/**
 * Closes the map.
 */
function closeMap() {
    document.querySelector(".map").classList.remove("map--active");
    if (settings.firstConfigurationShown) hideOverlay();
}

/**
 * Clears the select location from the map.
 */
function clearMap() {
    selectedLocationLat = selectedLocationLon = selectedLocationName = undefined;

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    updateMapLayer();

    document.querySelector(".map__selected-location").classList.remove("map__selected-location--active");
    document.querySelector(".map__selected-location .name").textContent = "";
    document.querySelector(".map__selected-location .lat").textContent = "";
    document.querySelector(".map__selected-location .lon").textContent = "";
}

/**
 * Fetches the selected location from the map and adds to the location sidebar.
 */
function fetchSelectedLocation() {
    if (!selectedLocationName) return;
    let location = new Location(selectedLocationName, selectedLocationLat, selectedLocationLon);

    addAndFetchLocation(location);

    if (!settings.firstConfigurationShown) hideWelcomePage();

    saveSettings();
    closeMap();
}

/**
 * Updates the map layer based on the theme.
 */
function updateMapLayer() {
    let theme = settings.theme, url = activeMapLayer.url;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    if (theme === themes.DARK && activeMapLayer.darkThemeUrl) url = activeMapLayer.darkThemeUrl;

    L.tileLayer(url, {
        minZoom: 0,
        maxZoom: activeMapLayer.maxZoom,
        attribution: activeMapLayer.attribution,
        ext: activeMapLayer.ext,
    }).addTo(map);
}

/**
 * Switches the map layer.
 * @param {MapLayer} mapLayer The desired map layer.
 */
function switchMapLayer(mapLayer) {
    activeMapLayer = mapLayer;

    map.eachLayer(function (layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    updateMapLayer();

    map.attributionControl.setPrefix(false);
    map.attributionControl._attributions = {};
    map.attributionControl.addAttribution(activeMapLayer.attribution);
}