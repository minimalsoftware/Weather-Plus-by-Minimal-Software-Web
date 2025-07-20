let aqiChart;

/**
 * Display air quality chart in modal.
 * @param airQualityData - Air quality data object from API.
 * @param dayIndex - The index of the day for which to display data.
 */
function displayAirQualityChart(airQualityData, dayIndex) {
    if (aqiChart) aqiChart.destroy();

    let aqiIndexData = [];

    for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
        aqiIndexData.push(airQualityData.hourly.european_aqi[i]);
    }

    let style = getComputedStyle(document.body);
    let secondTextColor = style.getPropertyValue("--secondTextColor");
    let gridColor = style.getPropertyValue("--chartGridColor");

    const ctx = document.getElementById('aqi-chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(1, style.getPropertyValue("--airQualityVeryGood-border"));
    gradient.addColorStop(0.80, style.getPropertyValue("--airQualityModerate-border"));
    gradient.addColorStop(0.60, style.getPropertyValue("--airQualityBad-border"));
    gradient.addColorStop(0.40, style.getPropertyValue("--airQualityUnhealthy-border"));
    gradient.addColorStop(0.20, style.getPropertyValue("--airQualityVeryUnhealthy-border"));
    gradient.addColorStop(0, style.getPropertyValue("--airQualityHazardous-border"));

    Chart.defaults.font.family = "LexendDeca";

    aqiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            datasets: [{
                data: aqiIndexData,
                backgroundColor: gradient,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: secondTextColor
                    },
                    grid: {
                        color: gridColor,
                    }
                },
                y: {
                    min: 0,
                    max: 300,
                    ticks: {
                        color: secondTextColor,
                        stepSize: 50,
                        callback: value => `${value} AQI`
                    },
                    grid: {
                        color: gridColor,
                    },
                    border: {
                        color: gridColor,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: '#000000',
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 14,
                    },
                    callbacks: {
                        label: function (context) {
                            return `${context.raw} AQI`;
                        }
                    }
                },
            },
        }
    });
}

let windChart;

/**
 * Display wind chart in modal.
 * @param data - Weather data object from API.
 * @param dayIndex - The index of the day for which to display data.
 */
function displayWindChart(data, dayIndex) {
    if (windChart) windChart.destroy();

    let windData = [];

    for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
        windData.push(data.hourly.wind_speed_10m[i]);
    }

    let style = getComputedStyle(document.body);
    let secondTextColor = style.getPropertyValue("--secondTextColor");
    let gridColor = style.getPropertyValue("--chartGridColor");

    const ctx = document.getElementById('wind-chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(1, style.getPropertyValue("--borderColor"));
    gradient.addColorStop(0, style.getPropertyValue("--secondTextColor"));

    Chart.defaults.font.family = "LexendDeca";

    windChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            datasets: [{
                data: windData,
                backgroundColor: gradient,
                borderRadius: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: secondTextColor
                    },
                    grid: {
                        color: gridColor,
                    }
                },
                y: {
                    ticks: {
                        color: secondTextColor,
                        callback: value => `${value} ${settings.windUnit.value}`
                    },
                    grid: {
                        color: gridColor,
                    },
                    border: {
                        color: gridColor,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: '#000000',
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 14,
                    },
                    callbacks: {
                        label: function (context) {
                            return `${context.raw} ${settings.windUnit.value}`;
                        }
                    }
                },
            },
        }
    });
}

let uvIndexChart;

/**
 * Display UV index chart in modal.
 * @param data - Weather data object from API.
 * @param dayIndex - The index of the day for which to display data.
 */
function displayUVIndexChart(data, dayIndex) {
    if (uvIndexChart) uvIndexChart.destroy();

    let uvIndexData = [];

    for (let i = dayIndex * 24; i < 24 + 24 * dayIndex; i++) {
        uvIndexData.push(Math.round(data.hourly.uv_index[i]));
    }

    let style = getComputedStyle(document.body);
    let secondTextColor = style.getPropertyValue("--secondTextColor");
    let gridColor = style.getPropertyValue("--chartGridColor");

    let uvIndexColors = [
        style.getPropertyValue("--uvIndexLow"),
        style.getPropertyValue("--uvIndexModerate"),
        style.getPropertyValue("--uvIndexHigh"),
        style.getPropertyValue("--uvIndexVeryHigh"),
        style.getPropertyValue("--uvIndexExtreme"),
        style.getPropertyValue("--uvIndexHazardous")
    ];

    const ctx = document.getElementById('uv-index-chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

    gradient.addColorStop(1, uvIndexColors[0]);
    gradient.addColorStop(0.8, uvIndexColors[1]);
    gradient.addColorStop(0.6, uvIndexColors[2]);
    gradient.addColorStop(0.4, uvIndexColors[3]);
    gradient.addColorStop(0.2, uvIndexColors[4]);
    gradient.addColorStop(0, uvIndexColors[5]);

    Chart.defaults.font.family = "LexendDeca";

    uvIndexChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            datasets: [{
                data: uvIndexData,
                backgroundColor: gradient,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: secondTextColor
                    },
                    grid: {
                        color: gridColor,
                    }
                },
                y: {
                    min: 0,
                    max: 12,
                    ticks: {
                        color: secondTextColor,
                        stepSize: 1,
                        callback: value => `${value}`
                    },
                    grid: {
                        color: gridColor,
                    },
                    border: {
                        color: gridColor,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: '#000000',
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 14,
                    },
                    callbacks: {
                        label: function (context) {
                            return `${context.raw}`;
                        }
                    }
                },
            },
        },
    });
}

let precipitationChart;
let selectedPrecipitationDay = 0;
let isQuarterlyForecast = false;

/**
 * Display precipitation chart in modal.
 * @param data - Weather data object from API.
 * @param day - The index of the day for which to display data.
 */
function displayPrecipitationChart(data, day) {
    selectedPrecipitationDay = day;

    if (precipitationChart) precipitationChart.destroy();

    let precipitationData = [];

    if (isQuarterlyForecast) {
        for (let i = day * 96; i < 96 + 96 * day; i++) {
            precipitationData.push(data.minutely_15.precipitation[i]);
        }
    } else {
        for (let i = day * 24; i < 24 + 24 * day; i++) {
            precipitationData.push(data.hourly.precipitation[i]);
        }
    }

    let style = getComputedStyle(document.body);
    let mainColor = style.getPropertyValue("--mainColor");
    let secondBorderColor = style.getPropertyValue("--secondBorderColor");
    let secondTextColor = style.getPropertyValue("--secondTextColor");
    let gridColor = style.getPropertyValue("--chartGridColor");

    const ctx = document.getElementById('precipitation-chart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, mainColor);
    gradient.addColorStop(1, secondBorderColor);

    Chart.defaults.font.family = "LexendDeca";

    let quarterlyLabels = [];
    if (isQuarterlyForecast) {
        let hour = 0;
        let minutes = 0;
        for (let i = 0; i < 96; i++) {
            if (minutes === 60) {
                minutes = 0;
            }
            if (i % 4 === 0 && i !== 0) {
                hour++;
            }
            quarterlyLabels.push(`${String(hour).padStart(2, "0")}:${String(minutes).padEnd(2, "0")}`);
            minutes += 15;
        }
    }

    let hourlyLabels = [];
    for (let i = 0; i < 24; i++) {
        hourlyLabels.push(`${String(i).padStart(2, "0")}:00`);
    }

    precipitationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: isQuarterlyForecast ? quarterlyLabels : hourlyLabels,
            datasets: [{
                data: precipitationData,
                backgroundColor: gradient,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: secondTextColor
                    },
                    grid: {
                        color: gridColor,
                    },
                },
                y: {
                    ticks: {
                        color: secondTextColor,
                        callback: value => `${value} mm`
                    },
                    grid: {
                        color: gridColor,
                    },
                    border: {
                        color: gridColor,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: '#000000',
                    titleFont: {
                        size: 14,
                    },
                    bodyFont: {
                        size: 14,
                    },
                    callbacks: {
                        label: function (context) {
                            return `${context.raw} mm`;
                        }
                    }
                },
            },
        }
    });
}