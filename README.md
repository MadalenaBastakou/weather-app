# Weather App

This is a weather app that allows users to fetch the current weather conditions either based on their location or by searching for a specific city. It provides real-time weather information such as temperature, humidity, wind speed, and weather description.

## Features

- **Geolocation:** Users can fetch the weather based on their current location using the browser's geolocation feature.
- **City Search:** Users can also search for weather information in a specific city by typing its name into the search bar.
- **Temperature Units:** The app supports both Celsius and Fahrenheit temperature units, allowing users to toggle between them.
- **Dynamic Weather Data:** Weather information is dynamically updated based on user actions, providing up-to-date weather conditions.

## Technologies Used

- **React:** The app is built using React, a popular JavaScript library for building user interfaces.
- **Sass:** Cascading Style Sheets (CSS) are written using the Sass preprocessor for easier styling and maintenance.
- **OpenWeatherMap API:** Weather data is fetched from the OpenWeatherMap API, providing accurate and reliable weather information.
- **Geolocation API:** The browser's geolocation API is utilized to fetch the user's current location for weather data.
- **HTML5:** The app uses modern HTML5 features for semantic markup and structure.

## Usage

- Upon opening the app, users will be prompted to allow access to their location. They can either allow or deny this request.
- If allowed, the app will fetch weather data for the user's current location automatically.
- Alternatively, users can use the search bar to look up weather information for a specific city by typing its name and pressing Enter.
- Temperature units can be toggled between Celsius and Fahrenheit using the provided toggle switch.

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Built with [Vite](https://vitejs.dev/)