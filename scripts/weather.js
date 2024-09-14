let fetchedData;
const weatherPage = document.querySelector(".weather-page");

function fetchWeather() {
    if (settings.locations.length === 0 || !settings.activeLocation) {
        document.querySelector(".no-locations").classList.add("no-locations--active");
        return;
    }

    weatherPage.classList.remove("weather-page--active");

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${settings.activeLocation.lat}&longitude=${settings.activeLocation.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_gusts_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=14`)
        .then(respone => respone.json())
        .then(data => {
            console.log(data);
            displayWeatherData(data);
        })
        .catch(error => console.error("Error:", error));
}

const hourlyForecastItems = document.querySelector(".hourly-forecast-items");

function displayHourlyForecast(currentTime, data, length = 24) {
    const hourlyForecastItemTemplate = document.querySelector("#hourly-forecast-item-template");
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let separatorCount = 0;

    while (hourlyForecastItems.firstChild) {
        hourlyForecastItems.removeChild(hourlyForecastItems.firstChild);
    }

    let isAfterSunset = new Date(data.daily.sunset[0]) < currentTime;
    let isBeforeSunset = new Date(data.daily.sunset[0]) > currentTime;

    const weatherInsights = getHourlyWeatherInsights(data, isAfterSunset, isBeforeSunset, new Date(data.daily.sunset[0]).getHours() + 1);
    if (weatherInsights) {
        document.querySelector(".hourly-forecast .weather-component__title").textContent = weatherInsights;
    } else {
        // document.querySelector(".hourly-forecast .weather-component__title").textContent = "No significant weather conditions expected.";
        document.querySelector(".hourly-forecast .weather-component__title").textContent = "Hourly forecast";
    }

    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    let hourlyIconTheme = theme === themes.DARK ? "hours-dark" : "hours-light";

    for (let i = currentTime.getHours(); i < length + currentTime.getHours(); i++) {
        let forecastItem = document.createElement("div");

        forecastItem.classList.add("hourly-forecast-item");
        forecastItem.append(hourlyForecastItemTemplate.content.cloneNode(true));

        let time = data.hourly.time[i].slice(-5);
        if (time === "00:00") {
            let separator = document.createElement("div");
            separator.classList.add("hourly-forecast-separator");
            separator.insertAdjacentText("afterbegin", separatorCount === 0 ? "Tommorow" : date.toLocaleDateString("en-US", {weekday: "long"}));
            date.setDate(date.getDate() + 1);
            separatorCount++;
            hourlyForecastItems.append(separator);
        }
        if (i === currentTime.getHours()) time = "Now";

        forecastItem.querySelector(".hourly-forecast-item__time").insertAdjacentText("afterbegin", time);
        forecastItem.querySelector(".hourly-forecast-item__temperature").insertAdjacentText("afterbegin",  settings.temperatureUnit === temperatureUnits.FAHRENHEIT ? `${Math.round(convertToFahrenheit(data.hourly.temperature_2m[i]))}°` : `${Math.round(data.hourly.temperature_2m[i])}°`);
        const weatherConditionsCodesWithPrecipitation = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
        if (data.hourly.precipitation_probability[i] !== 0 && weatherConditionsCodesWithPrecipitation.includes(data.hourly.weather_code[i])) {
            forecastItem.querySelector(".hourly-forecast-item__precipitation").insertAdjacentText("afterbegin", `${Math.round(data.hourly.precipitation_probability[i])}%`);
        }

        if ((new Date(data.daily.sunset[separatorCount]) < new Date(data.hourly.time[i]) && data.hourly.weather_code[i] === 0) || new Date(data.daily.sunrise[separatorCount]) > new Date(data.hourly.time[i]) && data.hourly.weather_code[i] === 0) {
            forecastItem.querySelector(".hourly-forecast-item__icon img").src = `graphics/weathers-icons/${hourlyIconTheme}/clear-moon.svg`;
        } else {
            forecastItem.querySelector(".hourly-forecast-item__icon img").src = `graphics/weathers-icons/${hourlyIconTheme}/${getWeatherConditionIcon(data.hourly.weather_code[i])}.svg`;
        }

        hourlyForecastItems.append(forecastItem);

        const hourlyForecastItemDetailsTemplate = document.querySelector("#hourly-forecast-item-details-template");

        let hourlyForecastItemDetails = document.createElement("div");
        hourlyForecastItemDetails.classList.add("hourly-forecast-item-details");

        hourlyForecastItemDetails.append(hourlyForecastItemDetailsTemplate.content.cloneNode(true));

        hourlyForecastItemDetails.querySelector(".hourly-forecast-item-details__datetime").textContent = new Date(data.hourly.time[i]).toLocaleDateString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
        hourlyForecastItemDetails.querySelector(".hourly-forecast-item-details__condition").textContent = getWeatherConditionDescription(data.hourly.weather_code[i]);

        hourlyForecastItemDetails.querySelector(".precipitation").textContent = `${Math.round(data.hourly.precipitation[i])} mm`;
        hourlyForecastItemDetails.querySelector(".relative-humidity").textContent = `${Math.round(data.hourly.relative_humidity_2m[i])}%`;
        hourlyForecastItemDetails.querySelector(".dewpoint").textContent = `${Math.round(data.hourly.dew_point_2m[i])}°`;
        hourlyForecastItemDetails.querySelector(".apparent-temperature").textContent = settings.temperatureUnit === temperatureUnits.FAHRENHEIT ? `${Math.round(convertToFahrenheit(data.hourly.apparent_temperature[i]))}°` : `${Math.round(data.hourly.apparent_temperature[i])}°`;
        hourlyForecastItemDetails.querySelector(".precipitation-probability").textContent = `${Math.round(data.hourly.precipitation_probability[i])}%`;
        hourlyForecastItemDetails.querySelector(".pressure").textContent = settings.pressureUnit === pressureUnits.MBAR ? `${Math.round(data.hourly.surface_pressure[i])} mbar` : `${Math.round(data.hourly.surface_pressure[i])} hPa`;
        hourlyForecastItemDetails.querySelector(".cloud-cover").textContent = `${Math.round(data.hourly.cloud_cover[i])}%`;

        hourlyForecastItemDetails.querySelector(".visibility").textContent = `${Math.round(data.hourly.visibility[i])} m`;
        hourlyForecastItemDetails.querySelector(".wind-gusts").textContent = `${Math.round(data.hourly.wind_gusts_10m[i])} km/h`;
        hourlyForecastItemDetails.querySelector(".wind-speed").textContent = `${Math.round(data.hourly.wind_speed_10m[i])} km/h`;

        tippy(forecastItem, {
            content: hourlyForecastItemDetails,
            allowHTML: true,
            theme: 'custom',
            trigger: 'click',
            inertia: {
                duration: 250,
                easing: 'ease-out'
            },
            animation: 'scale',
            placement: 'left',
            interactive: true,
            interactiveDebounce: 75,
            arrow: tippy.roundArrow,
            onShow(instance) {
                document.querySelector('.hourly-forecast-items').addEventListener('scroll', () => {
                    instance.hide();
                }, { once: true });
            }
        });
    }
}

function displayCurrentData(data) {
    document.querySelector(".current-weather__location").textContent = `${settings.activeLocation.name}`;
    document.querySelector(".current-weather__temperature").textContent = settings.temperatureUnit === temperatureUnits.FAHRENHEIT ? `${Math.round(convertToFahrenheit(data["current"]["temperature_2m"]))}°F` : `${Math.round(data["current"]["temperature_2m"])}°C`;
    document.querySelector(".current-weather__weather-condition").textContent = `${getWeatherConditionDescription(data["current"]["weather_code"])}, feels like ${Math.round(data["current"]["apparent_temperature"])}°`;
    document.querySelector(".current-weather__max-min-temperature").textContent = `H: ${Math.round(data["daily"]["temperature_2m_max"][0])}° L: ${Math.round(data["daily"]["temperature_2m_min"][0])}°`;
}

function displayDailyWeather(data) {
    const dailyForecastItems = document.querySelector(".daily-forecast-items");
    const dailyForecastItemTemplate = document.querySelector("#daily-forecast-item-template");

    while (dailyForecastItems.firstChild) {
        dailyForecastItems.removeChild(dailyForecastItems.firstChild);
    }

    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    let iconTheme = theme === themes.DARK ? "dark-theme" : "light-theme";

    for (let i = 0; i < 7; i++) {
        let forecastItem = document.createElement("div");

        forecastItem.classList.add("daily-forecast-item");
        forecastItem.append(dailyForecastItemTemplate.content.cloneNode(true));

        let date = new Date(data["daily"]["time"][i]);
        forecastItem.querySelector(".daily-forecast-item__day").insertAdjacentText("afterbegin", date.toLocaleDateString("en-US", {weekday: "long"}));
        forecastItem.querySelector(".daily-forecast-item__day").insertAdjacentHTML("beforeend", `, ${date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        })}`);
        forecastItem.querySelector(".daily-forecast-item__weather-condition").insertAdjacentText("afterbegin", getWeatherConditionDescription(data["daily"]["weather_code"][i]));
        forecastItem.querySelector(".daily-forecast-item__icon img").src = `graphics/weathers-icons/${iconTheme}/${getWeatherConditionIcon(data["daily"]["weather_code"][i])}.svg`;
        forecastItem.querySelector(".daily-forecast-item__max-min-temperature").insertAdjacentText("afterbegin",  settings.temperatureUnit === temperatureUnits.FAHRENHEIT ? `H: ${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_max"][i]))}° L: ${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_min"][i]))}°` : `H: ${Math.round(data["daily"]["temperature_2m_max"][i])}° L: ${Math.round(data["daily"]["temperature_2m_min"][i])}°`);

        dailyForecastItems.append(forecastItem);
    }
}

function displayAirQuality(data) {
    document.querySelector(".aqi__value").textContent = data.current.european_aqi;
    document.querySelector(".aqi__description").textContent = `European Air Quality Index: ${getAQIDescription(data.current.european_aqi)}`;

    document.querySelector("#pm10 .aqi-pollutant__value").textContent = data.hourly.pm10[0];
    document.querySelector("#pm2_5 .aqi-pollutant__value").textContent = data.hourly.pm2_5[0];
    document.querySelector("#carbon-monoxide .aqi-pollutant__value").textContent = data.hourly.carbon_monoxide[0];
    document.querySelector("#nitrogen-dioxide .aqi-pollutant__value").textContent = data.hourly.nitrogen_dioxide[0];
    document.querySelector("#sulphur-dioxide .aqi-pollutant__value").textContent = data.hourly.sulphur_dioxide[0];
    document.querySelector("#ozone .aqi-pollutant__value").textContent = data.hourly.ozone[0];

    document.querySelector(".aqi-indicator__thumb").style.left = `${(data.current.european_aqi / 300) * 100}%`;
}

function displayWindData(data) {
    document.querySelector(".wind-speed__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_speed_10m))}` : `${Math.round(data.current.wind_speed_10m)}`;
    document.querySelector(".wind-gust__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_gusts_10m))}` : `${Math.round(data.current.wind_gusts_10m)}`;

    if (settings.windUnit === windUnits.MPH) {
        document.querySelector(".wind-speed__title .unit").textContent = "mph";
        document.querySelector(".wind-gust__title .unit").textContent = "mph";
    }

    document.querySelector(".wind__description").textContent = `${getWindDescription(data.current.wind_speed_10m)} - ${getWindDirection(data.current.wind_direction_10m)}`;

    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    if (theme === themes.DARK) {
        document.querySelector(".wind__direction").innerHTML = COMPASS_LIGHT;
    } else {
        document.querySelector(".wind__direction").innerHTML = COMPASS_DARK;
    }

    document.querySelector(".wind__direction .arrow").style.transform = `rotate(${data.current.wind_direction_10m}deg)`;
}

let sunProgress;

function displaySunriseAndSunset(data) {
    let sunrise = new Date(data.daily.sunrise[0]);
    let sunset = new Date(data.daily.sunset[0]);

    document.querySelector("#sunrise-value").textContent = sunrise.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
    document.querySelector("#sunset-value").textContent = sunset.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });

    sunProgress = (new Date() - sunrise) / (sunset - sunrise);
    updateSunPosition();
}

function updateSunPosition() {
    let dot = document.getElementById('dot');
    let curve = document.getElementById('curve');
    let totalLength = curve.getTotalLength();
    if (sunProgress > 1) {
        sunProgress = 1;
        document.querySelector(".spot3").style.display = "none";
    }
    let u = sunProgress ?? 0;
    let p = curve.getPointAtLength(u * totalLength);

    dot.setAttribute("transform", `translate(${p.x}, ${p.y})`);
}

function displayMoonData(isAfterSunset) {
    const date = new Date(); // Current date and time

    const observer = new Astronomy.Observer(settings.activeLocation.lat, settings.activeLocation.lon, 0);

    const illuminationInfo = Astronomy.Illumination('Moon', date, observer);
    const moonrise = Astronomy.SearchRiseSet('Moon', observer, +1, date, 300);
    const moonset = Astronomy.SearchRiseSet('Moon', observer, -1, date, 300);

    if (isAfterSunset) {
        changeAstronomyType(astronomyTypes.MOON);
        const segmentedButton = document.querySelector("#segmented-button--astronomy");
        segmentedButton.querySelectorAll(".segmented-button__item")[1].classList.add("segmented-button__item--selected");

        refreshSegmentedButton(segmentedButton);
    } else {
        changeAstronomyType(astronomyTypes.SUN);
        const segmentedButton = document.querySelector("#segmented-button--astronomy");
        segmentedButton.querySelectorAll(".segmented-button__item")[0].classList.add("segmented-button__item--selected");

        refreshSegmentedButton(segmentedButton);
    }

    // console.log(moonrise);
    // console.log(moonset);

    // console.log(`Visual Magnitude: ${illuminationInfo.mag}`);
    // console.log(`Phase Angle: ${illuminationInfo.phase_angle}`);
    // console.log(`Phase Name: ${getMoonPhaseName(illuminationInfo.phase_angle)}`);
    // console.log(`Illuminated Fraction: ${illuminationInfo.phase_fraction}`);
    // let moonrise = Astronomy.SearchRiseSet('Moon', observer, date);
    // console.log(moonrise)
    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    let moonPhasesTheme = theme === themes.DARK ? "moon-phases-dark" : "moon-phases";

    document.querySelector(".moon__phase-graphic").src = `graphics/weathers-icons/${moonPhasesTheme}/${getMoonPhaseName(illuminationInfo.phase_angle).toLowerCase().replace(" ", "-")}.svg`;

    const phase = Astronomy.MoonPhase(date);

    document.querySelector(".moon__phase").textContent = getMoonPhaseName(phase);
    document.querySelector(".moon__illumination").textContent = `${Math.round(illuminationInfo.phase_fraction * 100)}%`;
    document.querySelector(".moon__moonrise").textContent = moonrise.date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
    document.querySelector(".moon__moonset").textContent = moonset.date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function displayUVIndex(data, hour) {
    let uvIndex = data.hourly.uv_index[hour];
    console.log(uvIndex);
    document.querySelector(".uv-index__value").textContent = Math.round(uvIndex);
    document.querySelector(".uv-index__description").textContent = getUVIndexDescription(uvIndex);
    document.querySelector(".uv-index__advice").textContent = getUVIndexAdvice(uvIndex);

    document.querySelector(".uv-index-indicator__thumb").style.left = `${(uvIndex / 12) * 100}%`;
}

function displayPrecipitation(data, hour) {
    let precipitation = 0;
    for (let i = hour; i < 24 + hour; i++) {
        precipitation += data.hourly.precipitation[i];
    }
    document.querySelector(".forecast-precipitation__value").textContent = `${Math.round(precipitation)} mm`;
}

function displayWeatherData(data) {
    document.querySelector(".no-locations").classList.remove("no-locations--active");

    fetchedData = data;

    let currentTime = new Date();

    let isAfterSunset = new Date(data.daily.sunset[0]) < currentTime;

    // Display current weather data
    displayCurrentData(data);

    // Display hourly weather data
    displayHourlyForecast(currentTime, data);

    // Display daily weather data
    displayDailyWeather(data);

    // Display air quality data
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${settings.activeLocation.lat}&longitude=${settings.activeLocation.lon}&current=european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayAirQuality(data);
        })
        .catch(error => console.error("Error:", error));

    // Display wind data 
    displayWindData(data);

    // Display sunrise and sunset data
    displaySunriseAndSunset(data);

    // Display moon data
    displayMoonData(isAfterSunset);

    // Display UV index
    displayUVIndex(data, currentTime.getHours());

    // Display precipitation
    displayPrecipitation(data, currentTime.getHours());

    weatherPage.classList.add("weather-page--active");
}

function switchHourlyForecastLength(length) {
    displayHourlyForecast(new Date(), fetchedData, length);
}

function getWeatherConditionDescription(code) {
    const condition = weatherConditions.find(condition => condition[0] === code);
    return condition ? condition[1] : "Unknown";
}

function getWeatherConditionIcon(code) {
    const condition = weatherConditions.find(condition => condition[0] === code);
    return condition ? condition[2] : "Unknown";
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}

function getWindDirection(degrees) {
    if (degrees <= 22.5) return "N";
    if (degrees <= 67.5) return "NE";
    if (degrees <= 112.5) return "E";
    if (degrees <= 157.5) return "SE";
    if (degrees <= 202.5) return "S";
    if (degrees <= 247.5) return "SW";
    if (degrees <= 292.5) return "W";
    if (degrees <= 337.5) return "NW";
    return "N";
}

function getWindDescription(windSpeed) {
    if (windSpeed <= 1) return "Calm";
    if (windSpeed <= 5) return "Light Air";
    if (windSpeed <= 11) return "Light Breeze";
    if (windSpeed <= 19) return "Gentle Breeze";
    if (windSpeed <= 28) return "Moderate Breeze";
    if (windSpeed <= 38) return "Fresh Breeze";
    if (windSpeed <= 49) return "Strong Breeze";
    if (windSpeed <= 61) return "Moderate Gale";
    if (windSpeed <= 74) return "Gale";
    if (windSpeed <= 88) return "Strong Gale";
    if (windSpeed <= 102) return "Storm";
    if (windSpeed <= 117) return "Violent Storm";
    return "Hurricane";
}

function getUVIndexDescription(uvIndex) {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
}

function getUVIndexAdvice(uvIndex) {
    if (uvIndex <= 2) return "Low risk. No protection needed.";
    if (uvIndex <= 5) return "Moderate risk. Wear sunglasses and sunscreen.";
    if (uvIndex <= 7) return "High risk. Cover up, use sunscreen, and stay in shade.";
    if (uvIndex <= 10) return "Very high risk. Take extra precautions, avoid the sun.";
    return "Extreme risk. Avoid being outside during midday hours.";
}

function saveOrder(container) {
    const order = Array.from(container.children).map(item => item.dataset.id);
    localStorage.setItem(container.className, JSON.stringify(order));
}

function loadOrder(container) {
    const order = JSON.parse(localStorage.getItem(container.className));
    if (order) {
        order.forEach(id => {
            const item = container.querySelector(`[data-id="${id}"]`);
            if (item) {
                container.appendChild(item);
            }
        });
    }
}

function setActiveButton(segmentedButton, index) {
    setTimeout(() => {
        const buttons = segmentedButton.querySelectorAll(".segmented-button__item");
        buttons.forEach(btn => btn.classList.remove("segmented-button__item--selected"));

        buttons[index].classList.add("segmented-button__item--selected");
        let selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

        const buttonRect = selectedButton.getBoundingClientRect();
        const containerRect = segmentedButton.getBoundingClientRect();
        const offsetLeft = buttonRect.left - containerRect.left;

        segmentedButton.style.setProperty("--selected-index", index);
        segmentedButton.style.setProperty("--selected-width", `${buttonRect.width}px`);
        segmentedButton.style.setProperty("--selected-left", `${offsetLeft - 5}px`);
    }, 500);
}

function refreshSegmentedButton(segmentedButton) {
    const selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

    segmentedButton.style.setProperty("--selected-width", `${selectedButton.offsetWidth}px`);
    segmentedButton.style.setProperty("--selected-left", `${selectedButton.offsetLeft - 5}px`);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchWeather();

    document.querySelectorAll(".segmented-button").forEach(segmentedButton => {
        const buttons = segmentedButton.querySelectorAll(".segmented-button__item");

        const selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

        if (selectedButton) {
            segmentedButton.style.setProperty("--selected-width", `${selectedButton.offsetWidth}px`);
            segmentedButton.style.setProperty("--selected-left", `${selectedButton.offsetLeft - 5}px`);
        }

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("segmented-button__item--selected"));

                button.classList.add("segmented-button__item--selected");

                const buttonRect = button.getBoundingClientRect();
                const containerRect = segmentedButton.getBoundingClientRect();
                const offsetLeft = buttonRect.left - containerRect.left;

                segmentedButton.style.setProperty("--selected-index", index);
                segmentedButton.style.setProperty("--selected-width", `${buttonRect.width}px`);
                segmentedButton.style.setProperty("--selected-left", `${offsetLeft - 5}px`);
            });
        });
    });

    const weatherPageContainer = document.querySelector('.weather-page__container');
    new Sortable(weatherPageContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.weather-component',
        onStart: () => {
            hourlyForecastItems.classList.add("hourly-forecast-items--hidden-scroll")
        },
        onEnd: () => {
            saveOrder(weatherPageContainer);
            hourlyForecastItems.classList.remove("hourly-forecast-items--hidden-scroll")
        }
    });

    const weatherPageSection = document.querySelector('.weather-page__section');
    new Sortable(weatherPageSection, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.weather-component',
        onEnd: () => saveOrder(weatherPageSection)
    });

    loadOrder(weatherPageContainer);
    loadOrder(weatherPageSection);

    window.addEventListener("resize", updatePath);
    updatePath();
});

const sunriseLine = document.querySelector(".sunrise__line");
const path = document.getElementById("curve");

function updatePath() {
    const width = sunriseLine.offsetWidth;
    const height = sunriseLine.offsetHeight;
    sunriseLine.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const d = `M10 46 Q ${width / 2} -28 ${width - 10} 46`;
    path.setAttribute("d", d);

    updateSunPosition();
}

function getMoonPhaseName(angle) {
    angle = angle % 360;
    if (angle < 0) angle += 360;

    const phases = [
        {name: "New Moon", min: 0, max: 22.5},
        {name: "Waxing Crescent", min: 22.5, max: 67.5},
        {name: "First Quarter", min: 67.5, max: 112.5},
        {name: "Waxing Gibbous", min: 112.5, max: 157.5},
        {name: "Full Moon", min: 157.5, max: 202.5},
        {name: "Waning Gibbous", min: 202.5, max: 247.5},
        {name: "Last Quarter", min: 247.5, max: 292.5},
        {name: "Waning Crescent", min: 292.5, max: 337.5},
        {name: "New Moon", min: 337.5, max: 360}
    ];

    for (let phase of phases) {
        if (angle >= phase.min && angle < phase.max) {
            return phase.name;
        }
    }

    return "Unknown";
}

const astronomyTypes = Object.freeze({
    SUN: 0,
    MOON: 1
});

function changeAstronomyType(astronomyType) {
    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");

    if (astronomyType === astronomyTypes.SUN) {
        sun.style.display = "block";
        moon.style.display = "none";
        updatePath();
    } else if (astronomyType === astronomyTypes.MOON) {
        sun.style.display = "none";
        moon.style.display = "block";
    }
}

function convertToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32;
}

function convertToMilesPerHour(kph) {
    return kph * 0.621371;
}