const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("location") && urlParams.has("lat") && urlParams.has("lon")) {
    const location = new Location(
        urlParams.get("location"),
        parseFloat(urlParams.get("lat")),
        parseFloat(urlParams.get("lon"))
    );
    fetchWeather(location);
} else {
    fetchWeather();
}

/**
 * Copies the active location URL to the clipboard by using GET parameters.
 */
function copyLinkToClipboard() {
    const { name, lat, lon } = settings.activeLocation;
    const url = new URL(window.location.href);
    url.searchParams.set("location", name);
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    navigator.clipboard.writeText(url.href).then(() => {
        showNotification("Link copied to clipboard");
    });
}