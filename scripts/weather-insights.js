function getHourlyWeatherInsights(data, isAfterSunset, isBeforeSunrise, sunsetHour) {
    let weatherInsights = "";

    const sunnyConditionsCodes = [0];
    const rainyConditionsCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
    const snowyConditionsCodes = [71, 73, 75, 77, 85, 86];
    const stormyConditionsCodes = [95, 96, 99];

    let conditionsCount = new Map();
    let conditionsHours = new Map();

    let avgTemperature = 0;
    let count = 0;

    let currentTime = new Date();

    function updateConditionsHours(condition, hour) {
        if (!conditionsHours.has(condition)) {
            conditionsHours.set(condition, []);
        }
        conditionsHours.get(condition).push(hour);
    }

    if (isAfterSunset && !isBeforeSunrise) {
        count = 0;
    } else {
        for (let i = currentTime.getHours(); i <= sunsetHour; i++) {
            avgTemperature += data.hourly.temperature_2m[i];
        }
    }

    for (let i = currentTime.getHours(); i < 24; i++) {
        const code = data.hourly.weather_code[i];
        const isDay = data.hourly.is_day[i];
        if (rainyConditionsCodes.includes(code)) {
            conditionsCount.set('rain', (conditionsCount.get('rain') || 0) + 1);
            updateConditionsHours('rain', i);
        } else if (snowyConditionsCodes.includes(code)) {
            conditionsCount.set('snow', (conditionsCount.get('snow') || 0) + 1);
            updateConditionsHours('snow', i);
        } else if (stormyConditionsCodes.includes(code)) {
            conditionsCount.set('thunderstorm', (conditionsCount.get('thunderstorm') || 0) + 1);
            updateConditionsHours('thunderstorm', i);
        } else if (sunnyConditionsCodes.includes(code) && isDay) {
            updateConditionsHours('sun', i);
        }
    }

    let maxKey = "";
    let max = 0;

    conditionsCount.forEach((value, key) => {
        if (value > max) {
            maxKey = key;
            max = value;
        }
    });

    if (maxKey === 'rain') {
        weatherInsights += `Rain conditions expected around ${formatTimeRanges(conditionsHours.get('rain'))}. `;
    } else if (maxKey === 'snow') {
        weatherInsights += `Snow conditions expected around ${formatTimeRanges(conditionsHours.get('snow'))}. `;
    } else if (maxKey === 'thunderstorm') {
        weatherInsights += `Thunderstorm expected around ${formatTimeRanges(conditionsHours.get('thunderstorm'))}. `;
    } else if (conditionsHours.has('sun')) {
        weatherInsights += `Sunny conditions expected around ${formatTimeRanges(conditionsHours.get('sun'))}. `;
    }

    if (count > 1) {
        avgTemperature /= count;
        avgTemperature = Math.round(avgTemperature);
        weatherInsights += `${AppLocalizations.of(context).averageTemperatureForRestOfTheDayIs} ${avgTemperature}°.`;
    }

    return weatherInsights;
}

function formatTimeRanges(hours) {
    if (hours.length === 0) return '';

    let result = [];
    let start = hours[0];
    let end = hours[0];

    for (let i = 1; i < hours.length; i++) {
        if (hours[i] === end + 1) {
            end = hours[i];
        } else {
            if (start === end) {
                result.push(`${start}:00`);
            } else {
                result.push(`${start}:00-${end}:00`);
            }
            start = end = hours[i];
        }
    }

    if (start === end) {
        result.push(`${start}:00`);
    } else {
        result.push(`${start}:00-${end}:00`);
    }

    if (result.length <= 2) {
        return result.join(` and `);
    } else {
        let resultString = "";
        for (let i = 0; i < result.length; i++) {
            if (i === result.length - 2) {
                resultString += `${result[i]} and `;
            } else if (i === result.length - 1) {
                resultString += result[i];
            } else {
                resultString += `${result[i]}, `;
            }
        }
        return resultString;
    }
}