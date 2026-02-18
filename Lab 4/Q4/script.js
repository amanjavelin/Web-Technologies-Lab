const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");

const API_KEY = "53850e50136d4bc62ff03b34facae094";

let cachedCity = null;
let cachedData = null;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) return;
    if (city === cachedCity) {
        displayWeather(cachedData);
        return;
    }
    fetchWeather(city);
});

function fetchWeather(city) {
    loader.classList.remove("hidden");
    resultDiv.innerHTML = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(response => {
            if (response.status === 404) {
                throw new Error("City not found (404)");
            }
            if (!response.ok) {
                throw new Error("Server error (500)");
            }
            return response.json();
        })
        .then(data => {
            loader.classList.add("hidden");
            cachedCity = city;
            cachedData = data;
            displayWeather(data);
        })
        .catch(error => {
            loader.classList.add("hidden");
            resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
}

function displayWeather(data) {
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].description;
    resultDiv.innerHTML = `
        <div class="weather-box">
            <h3>${data.name}</h3>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Condition:</strong> ${condition}</p>
        </div>
    `;
}