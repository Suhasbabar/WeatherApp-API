import React, { useState, useEffect } from "react";
import "./App.css";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import LocationPinIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AirSharpIcon from "@mui/icons-material/AirSharp";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = "20b16dc7cf5342a298f14038251907";

  // Auto-fetch on load using geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied. Please enter a city.");
        }
      );
    } else {
      setError("Geolocation is not supported.");
    }
  }, []);

  // Fetch weather using coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
        setCity(data.location.name);
      }
    } catch (err) {
      setError("Failed to fetch weather for your location.");
    }

    setLoading(false);
  };

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (name) => {
    setCity(name);
    setSuggestions([]);
    fetchWeather();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center relative">
        <h1 className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          Weather App 🌤️
        </h1>

        <div className="flex gap-2 items-center mb-1">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  fetchWeatherByCoords(
                    pos.coords.latitude,
                    pos.coords.longitude
                  );
                },
                (err) => {
                  setError("Failed to get current location.");
                }
              );
            }}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            <LocationPinIcon style={{ fontSize: "1.2rem" }} />
            <span className="text-sm">Current</span>
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute left-6 right-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl z-10 shadow-lg mt-2 max-h-60 overflow-auto transition-all duration-300 ease-out transform opacity-0 scale-95 animate-[fadeSlideDown_0.3s_ease-out_forwards]">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.name)}
                className="px-4 py-2 text-left hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
              >
                {item.name}, {item.country}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={fetchWeather}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-xl w-full hover:bg-red-600 transition"
        >
          Get Weather
        </button>

        {loading && <p className="mt-4 text-gray-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {weather && (
          <div className="mt-6 border-t pt-4 border-gray-300 dark:border-gray-600">
            <div className="mt-3 bg-blue-500 text-white px-4 py-3 rounded-xl flex justify-between items-start">
              {/* Left Side: Location + Time + Condition */}
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <LocationPinIcon style={{ fontSize: "1.5rem" }} />
                  <span className="font-semibold text-base">
                    {weather.location.name}, {weather.location.country}
                  </span>
                </div>
                <p className="flex items-center gap-2">
                  <DateRangeIcon style={{ fontSize: "1.2rem" }} />
                  {new Date(weather.location.localtime).toLocaleTimeString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <AirSharpIcon style={{ fontSize: "1.2rem" }} />
                  {weather.current.condition.text}
                </p>
              </div>

              {/* Right Side: Temperature in Separate Div */}
              <div className="flex flex-col items-end justify-start text-xl font-bold text-white">
                <DeviceThermostatIcon style={{ fontSize: "1.5rem" }} />
                <span>{weather.current.temp_c}°C</span>
              </div>
            </div>

            {/* Icon below card */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
              <img src={weather.current.condition.icon} alt="icon" />
              <p>{weather.current.condition.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
