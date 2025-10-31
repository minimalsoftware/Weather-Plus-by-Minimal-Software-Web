const aqiModal = document.querySelector("#modal--air-quality");

/**
 * Displays air quality data in the air quality modal.
 *
 * @param {Object} airQualityData - The air quality data object fetched from API.
 * @param {number} dayIndex - The index of the day for which to display data. If 0, displays current data.
 */
function displayAirQualityModalData(airQualityData, dayIndex) {
    let daily = false;
    let avgAQI = 0, avgPM10 = 0, avgPM2_5 = 0, avgCO = 0, avgNO2 = 0, avgSO2 = 0, avgO3 = 0;

    if (dayIndex > 0) {
        for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
            avgAQI += airQualityData.hourly.european_aqi[i];
            avgPM10 += airQualityData.hourly.pm10[i];
            avgPM2_5 += airQualityData.hourly.pm2_5[i];
            avgCO += airQualityData.hourly.carbon_monoxide[i];
            avgNO2 += airQualityData.hourly.nitrogen_dioxide[i];
            avgSO2 += airQualityData.hourly.sulphur_dioxide[i];
            avgO3 += airQualityData.hourly.ozone[i];
        }
        avgAQI = Math.round(avgAQI / 24);
        avgPM10 = Math.round(avgPM10 / 24);
        avgPM2_5 = Math.round(avgPM2_5 / 24);
        avgCO = Math.round(avgCO / 24);
        avgNO2 = Math.round(avgNO2 / 24);
        avgSO2 = Math.round(avgSO2 / 24);
        avgO3 = Math.round(avgO3 / 24);

        daily = true;
    }

    aqiModal.querySelector(".aqi__value").textContent = daily ? avgAQI : airQualityData.current.european_aqi;
    aqiModal.querySelector(".aqi__description").textContent = `European Air Quality Index: ${getAQIDescription(daily ? avgAQI : airQualityData.current.european_aqi)}`;
    aqiModal.querySelector(".aqi-indicator__thumb").style.left = daily ? `${(avgAQI / 300) * 100}%` : `${(airQualityData.current.european_aqi / 300) * 100}%`;

    aqiModal.querySelector(".pm10 .aqi-pollutant__value").textContent = daily ? avgPM10 : airQualityData.hourly.pm10[dayIndex];
    aqiModal.querySelector(".pm2_5 .aqi-pollutant__value").textContent = daily ? avgPM2_5 : airQualityData.hourly.pm2_5[dayIndex];
    aqiModal.querySelector(".carbon-monoxide .aqi-pollutant__value").textContent = daily ? avgCO : airQualityData.hourly.carbon_monoxide[dayIndex];
    aqiModal.querySelector(".nitrogen-dioxide .aqi-pollutant__value").textContent = daily ? avgNO2 : airQualityData.hourly.nitrogen_dioxide[dayIndex];
    aqiModal.querySelector(".sulphur-dioxide .aqi-pollutant__value").textContent = daily ? avgSO2 : airQualityData.hourly.sulphur_dioxide[dayIndex];
    aqiModal.querySelector(".ozone .aqi-pollutant__value").textContent = daily ? avgO3 : airQualityData.hourly.ozone[dayIndex];

    displayAirQualityChart(airQualityData, dayIndex);
}

const windModal = document.querySelector("#modal--wind");

/**
 * Displays wind data in the wind modal.
 * @param data - The weather data object fetched from API.
 * @param dayIndex - The index of the day for which to display data. If 0, displays current data.
 */
function displayWindModalData(data, dayIndex) {
    let daily = false;
    let avgWindSpeed = 0, avgWindGust = 0, avgDirection = 0;

    if (dayIndex > 0) {
        for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
            avgWindSpeed += data.hourly.wind_speed_10m[i];
            avgWindGust += data.hourly.wind_gusts_10m[i];
            avgDirection += data.hourly.wind_direction_10m[i];
        }
        avgWindSpeed = Math.round(avgWindSpeed / 24);
        avgWindGust = Math.round(avgWindGust / 24);
        avgDirection = Math.round(avgDirection / 24);

        daily = true;
    }

    windModal.querySelector(".wind-speed__value").textContent = daily ? avgWindSpeed : Math.round(data.current.wind_speed_10m);
    windModal.querySelector(".wind-gust__value").textContent = daily ? avgWindGust : Math.round(data.current.wind_gusts_10m);
    windModal.querySelector(".wind__description").textContent = `${getWindDescription(daily ? avgWindSpeed : data.current.wind_speed_10m)} - ${getWindDirection(daily ? avgDirection : data.current.wind_direction_10m)}`;
    windModal.querySelector(".wind__direction .arrow").style.transform = `rotate(${daily ? avgDirection : data.current.wind_direction_10m}deg)`;

    displayWindChart(data, dayIndex);
}

let moonPhaseCalendarSelectedDate = new Date();

/**
 * Displays the moon phases calendar.
 */
function displayMoonPhasesCalendar() {
    const daysInMonth = new Date(moonPhaseCalendarSelectedDate.getFullYear(), moonPhaseCalendarSelectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(moonPhaseCalendarSelectedDate.getFullYear(), moonPhaseCalendarSelectedDate.getMonth(), 1).getDay();
    const weekdayOfFirstDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    const daysNeeded = daysInMonth + weekdayOfFirstDay - 1;
    const weeksNeeded = Math.ceil(daysNeeded / 7);
    const itemCount = weeksNeeded * 7;

    let fullMoon = false;

    let calendarItemTemplate = document.querySelector("#template--moon-phase-calendar-item");
    let moonPhasesCalendarContent = document.querySelector(".moon-phases-calendar__content");
    moonPhasesCalendarContent.innerHTML = "";

    document.querySelector(".moon-phases-calendar__month").textContent = moonPhaseCalendarSelectedDate.toLocaleDateString("en-US", {month: "long"});

    for (let i = 1; i <= itemCount; i++) {
        let day = i - weekdayOfFirstDay + 1;

        let targetDateMoonPhase = Astronomy.MoonPhase(new Date(moonPhaseCalendarSelectedDate.getFullYear(), moonPhaseCalendarSelectedDate.getMonth(), day));

        if (i < weekdayOfFirstDay || i >= daysInMonth + weekdayOfFirstDay) {
            const day = document.createElement("div");
            day.classList.add("moon-phases-calendar__item", "moon-phases-calendar__item--empty");
            day.append(calendarItemTemplate.content.cloneNode(true));

            moonPhasesCalendarContent.appendChild(day);
        } else {
            const day = document.createElement("div");
            day.classList.add("moon-phases-calendar__item");
            day.append(calendarItemTemplate.content.cloneNode(true));
            day.querySelector(".day").textContent = `${i - weekdayOfFirstDay + 1}`;
            day.querySelector(".moon-phase").src = `graphics/weathers-icons/moon-phases/${getMoonPhaseName(targetDateMoonPhase, fullMoon).toLowerCase().replace(" ", "-")}.svg`;

            if (getMoonPhaseName(targetDateMoonPhase) === "Full Moon") fullMoon = true;

            tippy(day, {
                content: getMoonPhaseName(targetDateMoonPhase, fullMoon),
                allowHTML: true,
                theme: 'main-color',
                inertia: {
                    duration: 250,
                    easing: 'ease-out'
                },
                animation: 'scale',
                interactive: true,
                arrow: tippy.roundArrow,
            });

            moonPhasesCalendarContent.appendChild(day);
        }

    }

    document.querySelector(".moon-phases-calendar__info--next-new-moon span").textContent = getNextNewMoonDate().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
    });
    document.querySelector(".moon-phases-calendar__info--next-full-moon span").textContent = getNextFullMoonDate().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
    });
}

/**
 * Changes the displayed month in the moon phases calendar.
 * @param direction - The direction in which to change the month. -1 for the previous month, 1 for the next month.
 * @param currentMonth - If true, displays the current month.
 */
function changeMoonPhaseCalendarMonth(direction, currentMonth = false) {
    let moonPhasesCalendarFooter = document.querySelector(".moon-phases-calendar__footer");
    if (currentMonth) {
        moonPhaseCalendarSelectedDate = new Date();
        moonPhasesCalendarFooter.classList.remove("moon-phases-calendar__current-month-button--active");
    } else {
        moonPhaseCalendarSelectedDate.setMonth(moonPhaseCalendarSelectedDate.getMonth() + direction);
        if (moonPhaseCalendarSelectedDate.getMonth() === new Date().getMonth() && moonPhaseCalendarSelectedDate.getFullYear() === new Date().getFullYear()) {
            moonPhasesCalendarFooter.classList.remove("moon-phases-calendar__current-month-button--active");
        } else {
            moonPhasesCalendarFooter.classList.add("moon-phases-calendar__current-month-button--active");
        }
    }

    displayMoonPhasesCalendar();
}

/**
 * Returns date of the next new moon.
 * @returns {Date} - The date of the next new moon.
 */
function getNextNewMoonDate() {
    let targetDate = new Date();
    let response = getMoonPhaseName(Astronomy.MoonPhase(targetDate));
    while (response !== "New Moon") {
        targetDate.setDate(targetDate.getDate() + 1);
        response = getMoonPhaseName(Astronomy.MoonPhase(targetDate));
    }
    return targetDate;
}

/**
 * Returns date of the next full moon.
 * @returns {Date} - The date of the next full moon.
 */
function getNextFullMoonDate() {
    let targetDate = new Date();
    let response = getMoonPhaseName(Astronomy.MoonPhase(targetDate));
    while (response !== "Full Moon") {
        targetDate.setDate(targetDate.getDate() + 1);
        response = getMoonPhaseName(Astronomy.MoonPhase(targetDate));
    }
    return targetDate;
}

const uvIndexModal = document.querySelector("#modal--uv-index");

/**
 * Displays UV index data in the UV index modal.
 * @param data - The weather data object fetched from API.
 * @param dayIndex - The index of the day for which to display data. If 0, displays current data.
 * @param currentUVIndex - The current UV index.
 */
function displayUVIndexModalData(data, dayIndex, currentUVIndex) {
    let daily = false;
    let avgUVIndex = 0;

    if (dayIndex > 0) {
        for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
            avgUVIndex += data.hourly.uv_index[i];
        }
        avgUVIndex = Math.round(avgUVIndex / 24);

        daily = true;
    }

    uvIndexModal.querySelector(".uv-index__value").textContent = daily ? avgUVIndex : `${Math.round(currentUVIndex)}`;
    uvIndexModal.querySelector(".uv-index__description").textContent = daily ? `Average UV Index: ${getUVIndexDescription(daily ? avgUVIndex : currentUVIndex)}` : getUVIndexDescription(daily ? avgUVIndex : currentUVIndex);
    uvIndexModal.querySelector(".uv-index__advice").textContent = getUVIndexAdvice(daily ? avgUVIndex : currentUVIndex);

    uvIndexModal.querySelector(".uv-index-indicator__thumb").style.left = daily ? `${(avgUVIndex / 12) * 100}%` : `${(Math.round(currentUVIndex) / 12) * 100}%`;

    displayUVIndexChart(data, dayIndex);
}

const precipitationModal = document.querySelector("#modal--precipitation");

/**
 * Displays precipitation data in the precipitation modal.
 * @param data - The weather data object fetched from API.
 * @param dayIndex - The index of the day for which to display data. If 0, displays current data.
 */
function displayPrecipitationModalData(data, dayIndex) {
    let precipitationSum = 0;
    let offset = dayIndex === 0 ? new Date().getHours() : 0;

    for (let i = dayIndex * 24 + offset; i < 24 + 24 * dayIndex; i++) {
        precipitationSum += data.hourly.precipitation[i];
    }
    precipitationSum = Math.round(precipitationSum);

    precipitationModal.querySelector(".total-precipitation__value").textContent = `${precipitationSum} mm`;

    displayPrecipitationChart(data, dayIndex);
}

/**
 * Creates date picker items in a date picker element.
 * @param datePickerId - ID of the date picker element.
 * @param onClickAction - Function to execute on click.
 * @param days - Number of days to display.
 */
function loadDayPicker(datePickerId, onClickAction, days = 14) {
    const dayPicker = document.querySelector(`#${datePickerId}`);
    const dayPickerScroll = dayPicker.querySelector(".day-picker__scroll");

    dayPickerScroll.innerHTML = "";

    const dayPickerItemTemplate = document.querySelector("#day-picker-item-template");

    const today = new Date();
    today.setDate(today.getDate() - 1);

    for (let i = 0; i < days; i++) {
        today.setDate(today.getDate() + 1);

        const dayPickerItem = document.createElement("div");
        dayPickerItem.classList.add("day-picker-item");
        if (i === 0) dayPickerItem.classList.add("day-picker-item--active");
        dayPickerItem.append(dayPickerItemTemplate.content.cloneNode(true));
        dayPickerItem.addEventListener("click", () => {
            dayPicker.querySelectorAll(".day-picker-item").forEach(item => item.classList.remove("day-picker-item--active"));
            dayPickerItem.classList.add("day-picker-item--active");
            onClickAction(i);
        });

        dayPickerItem.querySelector(".day-picker-item__day").insertAdjacentText("beforeend", `${today.getDate()}`);
        dayPickerItem.querySelector(".day-picker-item__weekday").insertAdjacentText("beforeend", `${today.toLocaleDateString("en-US", {weekday: "short"})}`);

        dayPickerScroll.appendChild(dayPickerItem);
    }

    let isDragging = false;
    let startX;
    let scrollLeft;
    dayPickerScroll.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - dayPickerScroll.offsetLeft;
        scrollLeft = dayPickerScroll.scrollLeft;
    });
    dayPickerScroll.addEventListener("mouseleave", () => {
        isDragging = false;
    });
    dayPickerScroll.addEventListener("mouseup", () => {
        isDragging = false;
    });
    dayPickerScroll.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - dayPickerScroll.offsetLeft;
        const walk = (x - startX) * 3;
        dayPickerScroll.scrollLeft = scrollLeft - walk;
    });
}