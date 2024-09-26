let fetchedData;
const weatherPage = document.querySelector(".weather-page");

const astronomyTypes = Object.freeze({
    SUN: 0,
    MOON: 1
});

/**
 * Fetches weather data for a given location from OpenMeteo API.
 * If no locations are available, it shows a "no locations" message.
 *
 * @param {Object} location - The location object containing name, latitude and longitude.
 */
function fetchWeather(location = settings.activeLocation) {
    if (settings.locations.length === 0 || !settings.activeLocation) {
        document.querySelector(".no-locations").classList.add("no-locations--active");
        return;
    }

    weatherPage.classList.remove("weather-page--active");

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_gusts_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,apparent_temperature_max,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=14&minutely_15=precipitation`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeatherData(data, location);
        })
        .catch(error => console.error("Error:", error));
}

/**
 * Displays the current weather data for a given location.
 *
 * @param {Object} data - The weather data object.
 * @param {Object} location - The location object containing name.
 */
function displayCurrentData(data, location) {
    document.querySelector(".current-weather__location").textContent = `${location.name}`;
    document.querySelector(".current-weather__temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["current"]["temperature_2m"]))}°F` : `${Math.round(data["current"]["temperature_2m"])}°C`;
    document.querySelector(".current-weather__weather-condition").textContent = `${getWeatherConditionDescription(data["current"]["weather_code"])}, feels like ${Math.round(data["current"]["apparent_temperature"])}°`;
    document.querySelector(".current-weather__max-min-temperature .max-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_max"][0]))}°` : `${Math.round(data["daily"]["temperature_2m_max"][0])}°`;
    document.querySelector(".current-weather__max-min-temperature .min-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_min"][0]))}°` : `${Math.round(data["daily"]["temperature_2m_min"][0])}°`;
}

const hourlyForecastItems = document.querySelector(".hourly-forecast-items");

/**
 * Displays the hourly weather forecast for a given time period.
 *
 * @param {Date} currentTime - The current date and time.
 * @param {Object} data - The weather data object.
 * @param {number} [length=24] - The number of hours to display.
 */
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

    document.querySelector(".hourly-forecast .weather-component__title").textContent = weatherInsights || "Hourly forecast"; // No significant weather conditions expected.

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
        forecastItem.querySelector(".hourly-forecast-item__temperature").insertAdjacentText("afterbegin", settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data.hourly.temperature_2m[i]))}°` : `${Math.round(data.hourly.temperature_2m[i])}°`);
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

        hourlyForecastItemDetails.querySelector(".hourly-forecast-item-details__datetime").textContent = new Date(data.hourly.time[i]).toLocaleDateString("en-GB", {
            year: "numeric",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).replace(/\//g, ".");

        hourlyForecastItemDetails.querySelector(".hourly-forecast-item-details__condition").textContent = getWeatherConditionDescription(data.hourly.weather_code[i]);

        hourlyForecastItemDetails.querySelector(".precipitation").textContent = `${data.hourly.precipitation[i]} mm`;
        hourlyForecastItemDetails.querySelector(".precipitation-probability").textContent = `${Math.round(data.hourly.precipitation_probability[i])}%`;
        hourlyForecastItemDetails.querySelector(".relative-humidity").textContent = `${Math.round(data.hourly.relative_humidity_2m[i])}%`;
        hourlyForecastItemDetails.querySelector(".dewpoint").textContent = `${Math.round(data.hourly.dew_point_2m[i])}°`;
        hourlyForecastItemDetails.querySelector(".apparent-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data.hourly.apparent_temperature[i]))}°` : `${Math.round(data.hourly.apparent_temperature[i])}°`;
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
                }, {once: true});
            }
        });
    }
}

/**
 * Displays the daily weather forecast for the next 7 days.
 *
 * @param {Object} data - The weather data object.
 * @param startIndex
 * @param endIndex
 */
function displayDailyForecast(data, startIndex = 0, endIndex = 7) {
    const dailyForecastItems = document.querySelector(".daily-forecast-items");
    const dailyForecastItemTemplate = document.querySelector("#daily-forecast-item-template");

    while (dailyForecastItems.firstChild) {
        dailyForecastItems.removeChild(dailyForecastItems.firstChild);
    }

    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    let iconTheme = theme === themes.DARK ? "dark-theme" : "light-theme";

    for (let i = startIndex; i < endIndex; i++) {
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

        forecastItem.querySelector(".daily-forecast-item__max-min-temperature .max-temperature").insertAdjacentText("afterbegin", settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_max"][i]))}°` : `${Math.round(data["daily"]["temperature_2m_max"][i])}°`);
        forecastItem.querySelector(".daily-forecast-item__max-min-temperature .min-temperature").insertAdjacentText("afterbegin", settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_min"][i]))}°` : `${Math.round(data["daily"]["temperature_2m_min"][i])}°`);

        dailyForecastItems.append(forecastItem);

        const dailyForecastItemDetailsTemplate = document.querySelector("#daily-forecast-item-details-template");

        let dailyForecastItemDetails = document.createElement("div");
        dailyForecastItemDetails.classList.add("daily-forecast-item-details");

        dailyForecastItemDetails.append(dailyForecastItemDetailsTemplate.content.cloneNode(true));

        dailyForecastItemDetails.querySelector(".daily-forecast-item-details__day").textContent = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
        dailyForecastItemDetails.querySelector(".daily-forecast-item-details__condition").textContent = getWeatherConditionDescription(data["daily"]["weather_code"][i]);
        dailyForecastItemDetails.querySelector(".sunrise").textContent = new Date(data["daily"]["sunrise"][i]).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
        dailyForecastItemDetails.querySelector(".sunset").textContent = new Date(data["daily"]["sunset"][i]).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
        dailyForecastItemDetails.querySelector(".precipitation").textContent = `${data["daily"]["precipitation_sum"][i]} mm`;
        dailyForecastItemDetails.querySelector(".max-precipitation-probability").textContent = `${Math.round(data["daily"]["precipitation_probability_max"][i])}%`;
        dailyForecastItemDetails.querySelector(".dewpoint").textContent = `${Math.round(data["hourly"]["dew_point_2m"][i])}°`;
        dailyForecastItemDetails.querySelector(".apparent-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["apparent_temperature_max"][i]))}°` : `${Math.round(data["daily"]["apparent_temperature_max"][i])}°`;
        dailyForecastItemDetails.querySelector(".pressure").textContent = `${Math.round(data["hourly"]["surface_pressure"][i])} ${settings.pressureUnit.value}`;
        dailyForecastItemDetails.querySelector(".cloud-cover").textContent = `${Math.round(data["hourly"]["cloud_cover"][i])}%`;
        dailyForecastItemDetails.querySelector(".visibility").textContent = `${Math.round(data["hourly"]["visibility"][i])} m`;
        dailyForecastItemDetails.querySelector(".wind-speed").textContent = `${Math.round(data["hourly"]["wind_speed_10m"][i])} ${settings.windUnit.value}`;
        dailyForecastItemDetails.querySelector(".uv-index").textContent = `${Math.round(data["daily"]["uv_index_max"][i])}`;
        dailyForecastItemDetails.querySelector(".min-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_min"][i]))}°` : `${Math.round(data["daily"]["temperature_2m_min"][i])}°`;
        dailyForecastItemDetails.querySelector(".max-temperature").textContent = settings.temperatureUnit.value === temperatureUnits.FAHRENHEIT.value ? `${Math.round(convertToFahrenheit(data["daily"]["temperature_2m_max"][i]))}°` : `${Math.round(data["daily"]["temperature_2m_max"][i])}°`;

        tippy(forecastItem, {
            content: dailyForecastItemDetails,
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
            appendTo: document.querySelector(".daily-forecast"),
            arrow: tippy.roundArrow,
            onShow(instance) {
                document.querySelector('.daily-forecast-items').addEventListener('scroll', () => {
                    instance.hide();
                }, {once: true});
            }
        });
    }
    if (theme === themes.DARK) {
        changeIconColor();
    }
}

/**
 * Display data in ari quality component
 * @param airQualityData - air quality data object fetched from OpenMeteo API
 */
function displayAirQuality(airQualityData) {
    weatherPage.querySelector(".aqi__value").textContent = airQualityData.current.european_aqi;
    weatherPage.querySelector(".aqi__description").textContent = `European Air Quality Index: ${getAQIDescription(airQualityData.current.european_aqi)}`;

    weatherPage.querySelector("#pm10 .aqi-pollutant__value").textContent = airQualityData.hourly.pm10[0];
    weatherPage.querySelector("#pm2_5 .aqi-pollutant__value").textContent = airQualityData.hourly.pm2_5[0];
    weatherPage.querySelector("#carbon-monoxide .aqi-pollutant__value").textContent = airQualityData.hourly.carbon_monoxide[0];
    weatherPage.querySelector("#nitrogen-dioxide .aqi-pollutant__value").textContent = airQualityData.hourly.nitrogen_dioxide[0];
    weatherPage.querySelector("#sulphur-dioxide .aqi-pollutant__value").textContent = airQualityData.hourly.sulphur_dioxide[0];
    weatherPage.querySelector("#ozone .aqi-pollutant__value").textContent = airQualityData.hourly.ozone[0];

    weatherPage.querySelector(".aqi-indicator__thumb").style.left = `${(airQualityData.current.european_aqi / 300) * 100}%`;

    displayAirQualityModalData(airQualityData, 0);

    loadDayPicker("day-picker--air-quality", function (dayIndex) {
        displayAirQualityModalData(airQualityData, dayIndex);
    }, 5);
}

/**
 * Displays wind data in the wind component
 * @param data - weather data object fetched from OpenMeteo API
 */
function displayWindData(data) {
    weatherPage.querySelector(".wind-speed__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_speed_10m))}` : `${Math.round(data.current.wind_speed_10m)}`;
    weatherPage.querySelector(".wind-gust__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_gusts_10m))}` : `${Math.round(data.current.wind_gusts_10m)}`;

    windModal.querySelector(".wind-speed__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_speed_10m))}` : `${Math.round(data.current.wind_speed_10m)}`;
    windModal.querySelector(".wind-gust__value").textContent = settings.windUnit === windUnits.MPH ? `${Math.round(convertToMilesPerHour(data.current.wind_gusts_10m))}` : `${Math.round(data.current.wind_gusts_10m)}`;
    windModal.querySelector(".wind__description").textContent = `${getWindDescription(data.current.wind_speed_10m)} - ${getWindDirection(data.current.wind_direction_10m)}`;

    if (settings.windUnit === windUnits.MPH) {
        weatherPage.querySelector(".wind-speed__title .unit").textContent = "mph";
        weatherPage.querySelector(".wind-gust__title .unit").textContent = "mph";

        windModal.querySelector(".wind-speed__title .unit").textContent = "mph";
        windModal.querySelector(".wind-gust__title .unit").textContent = "mph";
    }

    weatherPage.querySelector(".wind__description").textContent = `${getWindDescription(data.current.wind_speed_10m)} - ${getWindDirection(data.current.wind_direction_10m)}`;

    let theme = settings.theme;
    if (theme === themes.AUTO) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.DARK : themes.LIGHT;

    if (theme === themes.DARK) {
        weatherPage.querySelector(".wind__direction").innerHTML = COMPASS_LIGHT;
        windModal.querySelector(".wind__direction").innerHTML = COMPASS_LIGHT;
    } else {
        weatherPage.querySelector(".wind__direction").innerHTML = COMPASS_DARK;
        windModal.querySelector(".wind__direction").innerHTML = COMPASS_DARK;
    }

    weatherPage.querySelector(".wind__direction .arrow").style.transform = `rotate(${data.current.wind_direction_10m}deg)`;
    windModal.querySelector(".wind__direction .arrow").style.transform = `rotate(${data.current.wind_direction_10m}deg)`;

    displayWindChart(data, 0);

    loadDayPicker("day-picker--wind", function (dayIndex) {
        displayWindModalData(data, dayIndex);
    }, 14);
}

let sunProgress;

/**
 * Displays sunrise and sunset data in the astronomy component
 * @param data - weather data object fetched from OpenMeteo API
 */
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

/**
 * Updates the position of the sun on the curve based on the sun's progress.
 */
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

/**
 * Displays moon data in the astronomy component
 * @param {boolean} isAfterSunset - Whether the current time is after sunset.
 */
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

    displayMoonPhasesCalendar();
}

/**
 * Displays the UV index data in the UV index component
 * @param data - Weather data object fetched from OpenMeteo API.
 * @param hour - The current hour.
 */
function displayUVIndex(data, hour) {
    let uvIndex = data.hourly.uv_index[hour];

    weatherPage.querySelector(".uv-index__value").textContent = Math.round(uvIndex);
    weatherPage.querySelector(".uv-index__description").textContent = getUVIndexDescription(uvIndex);
    weatherPage.querySelector(".uv-index__advice").textContent = getUVIndexAdvice(uvIndex);

    weatherPage.querySelector(".uv-index-indicator__thumb").style.left = `${(uvIndex / 12) * 100}%`;

    displayUVIndexModalData(data, 0, uvIndex);

    loadDayPicker("day-picker--uv-index", function (dayIndex) {
        displayUVIndexModalData(data, dayIndex, uvIndex);
    }, 14);
}

/**
 * Displays the precipitation data in the precipitation component
 * @param {Object} data - Weather data object fetched from OpenMeteo API.
 * @param {number} hour - The current hour
 */
function displayPrecipitation(data, hour) {
    let precipitation = 0;
    for (let i = hour; i < 24 + hour; i++) {
        precipitation += data.hourly.precipitation[i];
    }
    document.querySelector(".total-precipitation__value").textContent = `${Math.round(precipitation)} mm`;
    document.querySelector(".forecast-precipitation__value").textContent = `${Math.round(precipitation)} mm`;

    loadDayPicker("day-picker--precipitation", function (dayIndex) {
        displayPrecipitationChart(fetchedData, dayIndex, quarterlyForecast);
        displayPrecipitationModalData(fetchedData, dayIndex);
    }, 14);

    displayPrecipitationChart(data, 0);
}

/**
 * Calls the necessary functions to display the weather page data.
 * @param {Object} data - The weather data object fetched from OpenMeteo API.
 * @param {Location} location - The location object containing name, latitude and longitude.
 */
function displayWeatherData(data, location = settings.activeLocation) {
    document.querySelector(".no-locations").classList.remove("no-locations--active");

    fetchedData = data;

    let currentTime = new Date();
    document.querySelector(".weather-data-fetch-time span").textContent = `${currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;

    let isAfterSunset = new Date(data.daily.sunset[0]) < currentTime;

    // Display current weather data
    displayCurrentData(data, location);

    // Display hourly weather data
    displayHourlyForecast(currentTime, data);

    // Display daily weather data
    displayDailyForecast(data);

    // Display air quality data
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${settings.activeLocation.lat}&longitude=${settings.activeLocation.lon}&current=european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi&forecast_days=7`)
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

/**
 * Adjusts the number of hours shown in the hourly forecast.
 * @param {number} length - The number of hours to display.
 */
function switchHourlyForecastLength(length) {
    displayHourlyForecast(new Date(), fetchedData, length);
}

function switchDailyForecastPeriod(startIndex, endIndex) {
    displayDailyForecast(fetchedData, startIndex, endIndex);
}

/**
 * Returns condition description based on WMO weather interpretation code.
 * @param {number} code - WMO weather interpretation code.
 * @returns {*|string} - The weather condition description.
 */
function getWeatherConditionDescription(code) {
    const condition = weatherConditions.find(condition => condition[0] === code);
    return condition ? condition[1] : "Unknown";
}

/**
 * Returns condition icon name based on WMO weather interpretation code.
 * @param {number} code - WMO weather interpretation code.
 * @returns {*|string} - The weather condition icon name.
 */
function getWeatherConditionIcon(code) {
    const condition = weatherConditions.find(condition => condition[0] === code);
    return condition ? condition[2] : "Unknown";
}

/**
 * Returns aqi description based on the European air quality index.
 * @param {number} aqi - European air quality index.
 * @returns {string} - The air quality index description.
 */
function getAQIDescription(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}

/**
 * Converts a wind direction to a cardinal direction.
 * @param degrees - The wind direction in degrees.
 * @returns {string} - The cardinal direction.
 */
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

/**
 * Reruns wind speed description based on the Beaufort scale.
 * @param {number} windSpeed - The wind speed in km/h.
 * @returns {string} - The wind speed description.
 */
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

/**
 * Returns UV index description based on the UV index value.
 * @param {number} uvIndex - The UV index value.
 * @returns {string} - The UV index description.
 */
function getUVIndexDescription(uvIndex) {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
}

/**
 * Returns UV index advice based on the UV index value.
 * @param {number} uvIndex - The UV index value.
 * @returns {string} - The UV index advice.
 */
function getUVIndexAdvice(uvIndex) {
    if (uvIndex <= 2) return "Low risk. No protection needed.";
    if (uvIndex <= 5) return "Moderate risk. Wear sunglasses and sunscreen.";
    if (uvIndex <= 7) return "High risk. Cover up, use sunscreen, and stay in shade.";
    if (uvIndex <= 10) return "Very high risk. Take extra precautions, avoid the sun.";
    return "Extreme risk. Avoid being outside during midday hours.";
}

/**
 * Saves the order of weather components in the layout.
 * @param container - Parent of the weather components.
 */
function saveWeatherComponentsLayoutOrder(container) {
    const order = Array.from(container.children).map(item => item.dataset.id);
    localStorage.setItem(container.className, JSON.stringify(order));
}

/**
 * Loads the order of weather components in the layout.
 * @param container - Parent of the weather components.
 */
function loadWeatherComponentsLayoutOrder(container) {
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

const weatherPageContainer = document.querySelector('.weather-page__container');
const weatherPageSection = document.querySelector('.weather-page__section');

let sortableWeatherPageContainer, sortableWeatherPageSection;

/**
 * Initialises the sortable library to make weather components reoderable.
 */
function initializeSortable() {
    if (sortableWeatherPageContainer && settings.weatherPageLayoutLocked) {
        sortableWeatherPageContainer.destroy();
    }
    if (sortableWeatherPageSection && settings.weatherPageLayoutLocked) {
        sortableWeatherPageSection.destroy();
    }

    if (!settings.weatherPageLayoutLocked) {
        sortableWeatherPageContainer = new Sortable(weatherPageContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.weather-component',
            onStart: () => {
                hourlyForecastItems.classList.add("hourly-forecast-items--hidden-scroll")
            },
            onEnd: () => {
                saveWeatherComponentsLayoutOrder(weatherPageContainer);
                hourlyForecastItems.classList.remove("hourly-forecast-items--hidden-scroll")
            }
        });

        sortableWeatherPageSection = new Sortable(weatherPageSection, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.weather-component',
            onEnd: () => saveWeatherComponentsLayoutOrder(weatherPageSection)
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeSortable();

    loadWeatherComponentsLayoutOrder(weatherPageContainer);
    loadWeatherComponentsLayoutOrder(weatherPageSection);

    document.addEventListener("resize", () => {
        loadSegmentedButtons();
        updateSunPathWidth();
    })

    updateSunPathWidth();
});

window.onload = () => {
    loadSegmentedButtons();
}

const sunriseLine = document.querySelector(".sunrise__line");
const path = document.getElementById("curve");

/**
 * Updates the width of the sun path to make it fit an astronomy component.
 */
function updateSunPathWidth() {
    const width = sunriseLine.offsetWidth;
    const height = sunriseLine.offsetHeight;
    sunriseLine.setAttribute("viewBox", `0 0 ${width} ${height}`);
    const d = `M10 46 Q ${width / 2} -28 ${width - 10} 46`;
    path.setAttribute("d", d);

    updateSunPosition();
}

/**
 * Returns moon phase name based on the moon phase angle.
 * @param angle - The moon phase angle.
 * @param fullMoon - Whether the moon phase name is full moon.
 * @returns {string|*|string} - The moon phase name.
 */
function getMoonPhaseName(angle, fullMoon = false) {
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
            if (fullMoon) return "Waning Gibbous";
            return phase.name;
        }
    }

    return "Unknown";
}

/**
 * Switches displayed an astronomy type to the sun or moon.
 * @param astronomyType - The desired astronomy type.
 * @param event - The event that triggered the function.
 */
function changeAstronomyType(astronomyType, event) {
    if (event) {
        event.stopPropagation();
    }
    const sun = weatherPage.querySelector(".sun");
    const moon = weatherPage.querySelector(".moon");

    if (astronomyType === astronomyTypes.SUN) {
        sun.style.display = "block";
        moon.style.display = "none";
        updateSunPathWidth();
    } else if (astronomyType === astronomyTypes.MOON) {
        sun.style.display = "none";
        moon.style.display = "block";
    }
}

/**
 * Converts Celsius to Fahrenheit.
 * @param {number} celsius - The temperature in Celsius.
 * @returns {number} - The temperature in Fahrenheit.
 */
function convertToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32;
}

/**
 * Converts kilometers per hour to miles per hour.
 * @param {number} kph - The speed in kilometers per hour.
 * @returns {number} - The speed in miles per hour.
 */
function convertToMilesPerHour(kph) {
    return kph * 0.621371;
}