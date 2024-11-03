async function getCurrentWeatherByCity(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=fecb46fea0eb49978b870133240211&q=${city}&aqi=no&hours=24`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.querySelector('.location-input');
    const locationButton = document.querySelector('.location-button'); 

    console.log('locationInput:', locationInput);
    console.log('locationButton:', locationButton);

    if (locationInput && locationButton) {
        locationButton.addEventListener('click', async () => {
            const locationInputValue = locationInput.value.trim();
            if (locationInputValue) {
                const weatherData = await getCurrentWeatherByCity(locationInputValue);

                const currentWeatherIcon = `https:${weatherData.current.condition.icon}`;
                const currentWeatherTemperature = weatherData.current.temp_c;
                const currentWeatherStatus = weatherData.current.condition.text;

                renderCurrentWeather(currentWeatherIcon, currentWeatherTemperature, currentWeatherStatus);
                renderForecast(weatherData.forecast.forecastday[0].hour);
            } else {
                console.error('Please enter a valid city name');
            }
        });
    } else {
        console.error('Location input or button not found');
    }
});

function renderCurrentWeather(iconSrc, temperature, status) {
    const currentWeatherIconEl = document.createElement('img');
    currentWeatherIconEl.setAttribute('class', "current-weather-icon");
    currentWeatherIconEl.setAttribute('src', iconSrc);

    const currentWeatherTemperatureEl = document.createElement('p');
    currentWeatherTemperatureEl.setAttribute('class', "current-weather-temperature");
    currentWeatherTemperatureEl.innerHTML = `${temperature}°C`;

    const currentWeatherStatusEl = document.createElement('p');
    currentWeatherStatusEl.setAttribute('class', "current-weather-status");
    currentWeatherStatusEl.innerHTML = status;

    const currentWeather = document.querySelector('.current-weather');
    if (currentWeather) {
        currentWeather.innerHTML = '';
        currentWeather.appendChild(currentWeatherIconEl);
        currentWeather.appendChild(currentWeatherTemperatureEl);
        currentWeather.appendChild(currentWeatherStatusEl);
    } else {
        console.error('Current weather container not found');
    }
}

function renderForecast(hourlyForecast) {
    const forecastContainer = document.querySelector('.forecast');
    if (forecastContainer) {
        forecastContainer.innerHTML = ''; 

        hourlyForecast.forEach(hour => {
            const forecastElement = document.createElement('div');
            forecastElement.setAttribute('class', 'forecast-element');

            const forecastTimeEl = document.createElement('p');
            forecastTimeEl.setAttribute('class', 'forecast-time');
            forecastTimeEl.innerHTML = new Date(hour.time).getHours() + ':00';

            const forecastIconEl = document.createElement('img');
            forecastIconEl.setAttribute('class', 'forecast-icon');
            forecastIconEl.setAttribute('src', `https:${hour.condition.icon}`);

            const forecastTemperatureEl = document.createElement('p');
            forecastTemperatureEl.setAttribute('class', 'forecast-temperature');
            forecastTemperatureEl.innerHTML = `${hour.temp_c}°C`;

            forecastElement.appendChild(forecastTimeEl);
            forecastElement.appendChild(forecastIconEl);
            forecastElement.appendChild(forecastTemperatureEl);

            forecastContainer.appendChild(forecastElement);
        });

        forecastContainer.style.display = 'flex';
    } else {
        console.error('Forecast container not found');
    }
}
