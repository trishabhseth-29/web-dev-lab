
async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";
    document.getElementById("weatherResult").style.display = "none";

    try {

        // Get city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather information
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

        const weatherResponse = await fetch(weatherURL);
        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display weather information
        document.getElementById("cityName").textContent =
            location.name + ", " + location.country;

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("condition").textContent =
            getCondition(current.weather_code);

        document.getElementById("humidity").textContent =
            "Humidity: " + current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            "Wind Speed: " + current.wind_speed_10m + " km/h";

        document.getElementById("weatherResult").style.display = "block";

        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

    }
}

// Convert weather code into description
function getCondition(code) {

    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rainy";
    if ([71, 73, 75, 77].includes(code)) return "Snowy";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([85, 86].includes(code)) return "Snow Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown Weather";
}
