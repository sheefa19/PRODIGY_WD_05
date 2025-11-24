
const apiKey = "70f496fd19cab031631ebc74f9d8d10c"; 
const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");

getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        weatherResult.innerHTML = "<p style='color:red;'>Please enter a city name!</p>";
        return;
    }
    fetchWeatherByCity(city);
});

currentLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        weatherResult.innerHTML = "<p style='color:red;'>Geolocation not supported by your browser.</p>";
        return;
    }
    loading.style.display = "block";
    weatherResult.innerHTML = "";
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        },
        error => {
            loading.style.display = "none";
            weatherResult.innerHTML = "<p style='color:red;'>Unable to get your location.</p>";
        }
    );
});

function fetchWeatherByCity(city) {
    loading.style.display = "block";
    weatherResult.innerHTML = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(err => {
            weatherResult.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        })
        .finally(() => loading.style.display = "none");
}

function fetchWeatherByCoords(lat, lon) {
    loading.style.display = "block";
    weatherResult.innerHTML = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Location not found");
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(err => {
            weatherResult.innerHTML = `<p style='color:red;'>${err.message}</p>`;
        })
        .finally(() => loading.style.display = "none");
}

function displayWeather(data) {
    const { name } = data;
    const { temp, humidity, pressure } = data.main;
    const { description, icon } = data.weather[0];
    const windSpeed = data.wind.speed;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    weatherResult.innerHTML = `
        <div class="weather-card">
            <h3>${name}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${description.toUpperCase()}</p>
            <p>🌡 Temperature: ${temp} °C</p>
            <p>💧 Humidity: ${humidity}% | ⚖ Pressure: ${pressure} hPa</p>
            <p>💨 Wind Speed: ${windSpeed} m/s</p>
            <p>🌅 Sunrise: ${sunrise} | 🌇 Sunset: ${sunset}</p>
        </div>
    `;
}
