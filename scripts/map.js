let map, selectedLocationLon, selectedLocationLat, selectedLocationName;

class MapLayer {
    constructor(name, url, attribution, ext = "png", maxZoom = 18) {
        this.name = name;
        this.url = url;
        this.attribution = attribution;
        this.ext = ext;
        this.maxZoom = maxZoom;
    }
}

let mapLayers = [
    new MapLayer("OpenStreetMap", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"),
    new MapLayer("Stadia Maps", "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}", '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>', "jpg", 15),
];

function openMap() {
    if (map) clearMap();

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMap();
    });

    showModal();

    document.querySelector(".map").classList.add("map--active");

    if (!map) {
        map = L.map('osm', {
            attributionControl: false,
            zoom: 10,
            zoomControl: false
        }).setView([activeLocation.lat, activeLocation.lon]);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 0,
            maxZoom: 18,
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            ext: "jpg"
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


            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
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
        map.setView([activeLocation.lat, activeLocation.lon]);
    }

}

function closeMap() {
    document.querySelector(".map").classList.remove("map--active");
    hideModal();
}

function clearMap() {
    selectedLocationLat = selectedLocationLon = selectedLocationName = undefined;

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    document.querySelector(".map__selected-location").classList.remove("map__selected-location--active");
}

function fetchSelectedLocation() {
    if (!selectedLocationName) return;
    let location = new Location(selectedLocationName, selectedLocationLat, selectedLocationLon);

    addAndFetchLocation(location);

    saveSettings();
    closeMap();
}

function switchMapLayer(mapLayer) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    L.tileLayer(mapLayer.url, {
        minZoom: 0,
        maxZoom: mapLayer.maxZoom,
        attribution: mapLayer.attribution,
        ext: mapLayer.ext,
    }).addTo(map);

    map.attributionControl.setPrefix(false);
    map.attributionControl._attributions = {};

    map.attributionControl.addAttribution(mapLayer.attribution);
}