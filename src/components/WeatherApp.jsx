import { useEffect, useState } from "react";
import { getDate } from "../utils/date.js";
import { Loader } from "./Loader.jsx";
import {celsiusToFahrenheit} from "../utils/tempSwitch.js"
import { MdErrorOutline } from "react-icons/md";
import ToggleButton from "./ToggleButton.jsx";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [error, setError] = useState(null);
  const [celcius, setCelcius] = useState(true);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchData(location);
    }
  }, [location]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchData = async (location) => {
    try{

        let response;
        if (location) {
          response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
          );
        } else {
          response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`
          );
        }
        const responseBody = await response.json();
        console.log(responseBody);
        if(responseBody.cod === '404'){
            setError("City not found")
        }
        setWeatherInfo({
          name: responseBody.name,
          country: responseBody.sys.country,
          temp: Math.round(responseBody.main.temp),
          condition: responseBody.weather[0].main,
          humidity: Math.round(responseBody.main.humidity),
          description: responseBody.weather[0].description,
          icon: responseBody.weather[0].icon,
          windSpeed: Math.round(responseBody.wind.speed),
          date: getDate(),
        });
        setQuery("");
    } catch(error) {
        console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleTemp = () => {
    setCelcius((prevTemp) => !prevTemp)
  }


  return (
    <div className="container">
      <div className="container__toggle">
        <ToggleButton handleTemp={handleTemp}/>
      </div>
      <div className="container__search">
        <form onSubmit={handleSubmit}>
          <button type="submit"></button>
          <input
            type="search"
            placeholder="Search city"
            name="city"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </form>
      </div>
      {error && <span className="error"><MdErrorOutline className="error-icon"/>{error}</span>}
      {!weatherInfo && <Loader />}
      {weatherInfo && (
        <>
          <div className="container__area">
            {weatherInfo.name}, {weatherInfo.country}
          </div>
          <div className="container__time">{weatherInfo.date}</div>
          <div className="container__weather">
            <div className="temperature">
              <img
                src={`https://openweathermap.org/img/wn/${weatherInfo.icon}.png`}
                alt="weather condition icon"
              />
              <div className="temp">
                {celcius ? `${weatherInfo.temp} °C` : celsiusToFahrenheit(weatherInfo.temp)}
              </div>
            </div>
            <span className="weather-description">
              {weatherInfo.description}
            </span>
          </div>
          <div className="container__more">
            <div className="humidity">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADlklEQVR4nO2YWYhNcRzHz5ixZAtNJsYWY4gYNZasebDEgwdFjRc8WIoIJZrQNKKUbA+mhrLkwV6GEpFsJVJ2IbvsWxrLGD766Ts53c6999x7HM6t+b7M3PNbzvf/P///b3OcetTDAbIydhuAocAlYHnGLQRoD7zgD5Y4mQKgAXBSxO8DP4HvwGAnEwAsE/lPQA9grX4/Blo7UQYwQLttKNGzRsDF309gW5gvD3TRRPSaiO6IkRUCXyQbE5hsjPMsYAuwDxgRwM8CEfwItPOQl0t+G2gYmLjL8WL+wCJHXho+WgJv5GNuHJ2mwEPpzPpb5AcBNXJ6T3+PpnqcgHmyvQpkJ9CbJL1bgXMD0AS4K4d7gFzgmX7PTtHXZdlNS6KXDTyQ7sCgC1ghR0+BVno2Vs/e2oJSuLw1ivetfOhvCnyMgK6uqDA5RmZfw1CZwvk3fPNzLIAy6S8KsoAKOTnuIesIVGtX8336eyV/vX3oVkl3QpCw+V5ORsbRqZR8jk+fW/18NaCXEp1l6WbpLqCtXvYjXjwGpkpnvU+fhTpCdg9mJCjwbshvWVrk5aixXmYojKOzUvKlKfidqQUY9gPjgQKgn1WjwGvJTgVOZMAROdvpIcvTy4xMnxT9TgHe4Q3zt90SWiDyelGx6yvsBYYAnSwiueL09gT2caMN0EZlRZXyw2lgHdA/MPGYF01UtPFCVbydAjoAV6yy9BP3Q4VC5hrgPHBdBd3EeDus+3PBtdBDGdUuAhtF/CXwQf8vdDIBwARdRAu/o1yFmd2lYifKAPJdYXCVR8KzSralE+Em/ZSI2l3Jianxb4beLgaBq9a38qOLh7wI+CqdcU6UAHRR3WKYnkCvVDqPgOZOVAAcFLETSZJXjqupKXciNBpEZXV3H/rDpG/J0VcZHipcF3dDCjaWCA0V4bJLTqTItZu5Kdj1VK6o/q9TOFfHVpmGrU01DPPDYeePxBORGJKGbYlsj4XDLjkBS06G2nRqd7vwKKSGwzA5gYaqd2oTDakS2HfWAu6Ew9Afieci0S0NWyv0DCfDYeePxK50S2XX4Ko0HHb+SFhDjkaNvscf6tY+a3RSEC7L5GTOaBG7fU7crFs7J5vN/4Zl8vFj3cj8QKLEpNb0rHStNW3hRAE2QXZdaBv4rgaGa0hlpEfrzNuxqRuvd3aiBJ3rva6hlRdq1C9HY+e9APTVZPm4RoS224dtyhy5Xa9HPRznF3mo8twdGsDnAAAAAElFTkSuQmCC"
                alt="humidity icon"
              />

              <span className="percentage">{weatherInfo.humidity} %</span>
            </div>
            <div className="wind-speed">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChElEQVR4nO2aPWtUQRSGxwh+YYyK30Q3CoJiI2KlhR+NpbEw+AfUQtEfoNiI+APSSEDQSrDQqIiCBhUhErVRixR+QjRq0ICKbhp55LDv4mVh785m711m9D5wi+WenTPvzpwzM2fWuYKCgswAZgK9wHXgDTAFjOvzAaDDhQ5QAh6RzhOgx4UK0A18VGffAkeAtcBsYDVwEHit95+CFQMMq5N3gK46NvOBW7J7HOQ0A57p6Wpg16nYMfqa9LEHuAi8AsrAD2AUGAB2tywiEeRevzBwSEKuetpvTIx4GkPAetcugDVyPO5huwv4LvsJ4DSwFVikqboZOKG4M74A29slZJacTnmMxDfZ3kibtsAC4LJsv1qiyaXzNU4tmxljDeweym7QZ9oCHQkx9zLtdB2Hx31iREFtqXxxE213Ap/V/s5MOlzH0dLEfO5tYDsPmDsNHyfV/rmWOpviYJVW9mqGmZGTny3yMZplo3OATcApYFIOXgLLMnNSgyUF+Zn0CcDpYpvHJS5HqKRl42eWQsoK2vPAjjwFVNE6Y7xwMQOckZABFyvAikQsbnMxQuXIMFSNRRcjVM48DyTivZ2PXCxQWVxtU9kP/JKIMUv3Pl9uNf3mxW/gkndqD0zIBPAUOOs1CgUFBf8h5Je1yioTXbC1IWYhtdy0Bc9Fuk/aoGOqlXTQ9n+5ixVgpUqqxv28jsRtwbYaiaL4PhczwDEJGXQxA/T4FPKCx7e0GjzNFLvbTpPXD4cl5IoLDeC5noUeNVyr+xr7XWjw98Lmbj0xEnFbdiOhXtF1J9aHd8BRYJ1W9pKmU3UkzK7kAg/iYdIZCVpETdDvBa4l/ljwQZc6fUFOp4KCf5w/mfND6EUvV+UAAAAASUVORK5CYII="
                alt="wind icon"
              />

              <span className="km">{weatherInfo.windSpeed} km/h</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
