async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`https://www.7timer.info/bin/civillight.php?lon=${longitude}&lat=${latitude}&ac=0&unit=metric&output=json&tzshift=0`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const json = await response.json();
        const weatherData = json.dataseries;
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


document.getElementById("citySelect").addEventListener("change", async function() {
    const selectedValue = this.value;
    const [latitude, longitude] = selectedValue.split(",");
    const weatherData = await fetchWeatherData(latitude, longitude);
    displayWeatherData(weatherData);
});


function displayWeatherData(weatherData) {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = ''; 

    weatherData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-entry'); 
        const dateString = day.date.toString();
        const year = dateString.substr(0, 4);
        const month = dateString.substr(4, 2);
        const dayOfMonth = dateString.substr(6, 2);
        dayDiv.innerHTML = `
        <img src="../images/${day.weather}.png" alt="${day.weather}">
            <p>Date: ${dayOfMonth}-${month}-${year}</p>
            <p>Weather: ${day.weather}</p>
            <p>Max Temp: ${day.temp2m.max}°C</p>
            <p>Min Temp: ${day.temp2m.min}°C</p>
            <p>Max Wind Speed: ${day.wind10m_max} m/s</p>
        `;
        weatherDiv.appendChild(dayDiv);
    });
}


async function fetchCityData() {
    try {
        const response = await fetch('city_coordinates.csv'); // Change the file path as needed
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}


async function populateDropdown() {
    const citySelect = document.getElementById("citySelect");
    const cityData = await fetchCityData();
    const lines = cityData.split("\n");
    lines.forEach((line) => {
        const [latitude, longitude, city, country] = line.split(",");
        if (latitude && longitude && city && country) {
            const option = document.createElement("option");
            option.value = `${latitude},${longitude}`;
            option.textContent = `${city.trim()}, ${country.trim()}`;
            citySelect.appendChild(option);
        }
    });
}


populateDropdown();
