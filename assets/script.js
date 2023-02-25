const apiKey = "c27a90ea804668002c47cdb527b44811";
const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = apiKey;

const cityNameInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
const searchHistoryContainer = document.querySelector('#history');

let searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];

// Function to display search history
const renderSearchHistory = () => {
  if (!searchHistoryContainer) {
    return;
  }
  searchHistoryContainer.innerHTML = '';

  if (searchBtn) {
    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const search = searchInput.value.trim();
      if (search) {
        appendHistory(search);
        renderWeather(search);
      }
    });
  }

  for (let i = searchHistory.length - 1; i >= 0; i--) {
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
};

// Get the weather data for a city
const getWeatherData = async (city) => {
  try {
    const url = `${weatherApiRootUrl}/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("An error occurred while fetching the weather data:", error);
  }
};

// Render the weather information for a city
const renderWeather = async (city) => {
  const data = await getWeatherData(city);
  const weatherDescription = data.weather[0].description;
  console.log('Weather description', weatherDescription);
  // Render the weather information
  function renderWeather(city) {
    fetch(`${apiUrl}?q=${city}&units=metric&appid=${apiKey}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // rest of the function
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
};


// Function to initialize search history from local storage
const initSearchHistory = () => {
  renderSearchHistory();
};

// Add event listener to search button
searchBtn.addEventListener('click', (event) => {
  document.addEventListener('DOMContentLoaded', function() {
  event.preventDefault();
  const search = searchInput.value.trim();
  if (search) {
    appendHistory(search);
    renderWeather(search);
  }
});
});

initSearchHistory();

// function appendHistory(search, history) {
//   if (history.indexOf(search) !== -1) {
//     return history;
//   }
//   const updatedHistory = [...history, search];
//   localStorage.setItem('search-history', JSON.stringify(updatedHistory));
//   return updatedHistory;
// }

function getSearchHistory() {
  const storedHistory = localStorage.getItem('search-history');
  return storedHistory ? JSON.parse(storedHistory) : [];
}


function renderCurrentWeather(cityName, weather) {
  const date = dayjs().format('M/D/YYY');
  const {
    temperature: tempF,
    wind: { speed: windMph },
    main: { humidity },
    weather: [{ icon, description: iconDescription }],
  } = weather;

  const card = document.createElement('div');
  card.setAttribute('class', 'card');

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  const heading = document.createElement('h2');
  heading.setAttribute('class', 'card-body');
  heading.textContent = `${cityName} (${date})`;
  cardBody.append(heading);

  const weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);

  const tempEl = document.createElement('p');
  tempEl.setAttribute('class', 'card-body');
  tempEl.textContent = `Temp: ${tempF}°F`;
  cardBody.append(tempEl);

  const windEl = document.createElement('p');
  windEl.setAttribute('class', 'card-body');
  windEl.textContent = `Wind: ${windMph} MPH`;
  cardBody.append(windEl);

  const humidityEl = document.createElement('p');
  humidityEl.setAttribute('class', 'card-body');
  humidityEl.textContent = `Humidity: ${humidity} %`;
  cardBody.append(humidityEl);

  today.innerHTML = '';
  today.append(card);
}

// onload defaults
const cityName = 'Previous searches';

//const searchHistory = getSearchHistory();
const appendHistory = (search) => {
  if (searchHistory instanceof HTMLElement && searchHistory.prepend instanceof Function) {
    const li = document.createElement('li');
    li.textContent = search;
    li.classList.add('history-item');
    searchHistory.prepend(li);
  }
};
appendHistory(cityName, searchHistory);

const getCurrentWeather = (city, apiKey) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    
    .then(data => {
      console.log(data);
      const weather = {
        description: data.weather[0].description,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        icon: data.weather[0].icon,
      };
      return weather;
    })
    .catch(error => console.error('Error:', error));
    
};
     
  // const renderForecast = (dailyForecast) => {
  //   const startDt = dayjs().add(1, 'day').startOf('day').unix();
  //   const endDt = dayjs().add(6, 'day').startOf('day').unix();
  
  //   const headingCOl = document.createElement('div');
  //   const heading = document.createElement('h4');
  //   headingCOl.setAttribute('class', 'col-12');
  //   heading.textContent = '5-Day Forecast';
  //   headingCol.append(heading);
  
  //   forecastContainer.innerHTML = '';
  //   forecastContainer.append(headingCol);
  
  //   dailyForecast
  //     .filter(forecast => forecast.dt >= startDt && forecast.dt < endDt)
  //     .filter(forecast => forecast.dt_txt.slice(11, 13) == "12")
  //     .forEach(forecast => renderForecastCard(forecast));
  // };

  //previous
  // async function renderForecast(cityName) {
  //   try {
  //     const currentDayWeather = await getCurrentDayWeather(cityName);
  //     const fiveDayWeather = await getFiveDayWeather(cityName);
  
  //     displayCurrentDayWeather(currentDayWeather);
  //     displayFiveDayWeather(fiveDayWeather);
  
  //     // Show the weather display section
  //     document.querySelector('#weather-display').style.display = 'block';
  //   } catch (error) {
  //     console.log(error);
  //     alert('Could not get weather data. Please try again later.');
  //   }
  // }
  //end previous

  function renderForecast(cityName) {
    // const apiKey = ${apiKey};
    // const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const cityName = data.city.name;
        const currentDayData = data.list[0];
        const forecastData = data.list.slice(1, 6);
  
        // populate today's data
        const todayImg = document.getElementById('today-img');
        todayImg.src = `https://openweathermap.org/img/w/${currentDayData.weather[0].icon}.png`;
  
        const currentDayMax = document.getElementById('currentDay-max');
        currentDayMax.textContent = `High: ${Math.round(currentDayData.main.temp_max)}°F`;
  
        const currentDayMin = document.getElementById('currentDay-min');
        currentDayMin.textContent = `Low: ${Math.round(currentDayData.main.temp_min)}°F`;
  
        const currentDayWind = document.getElementById('currentDay-wind');
        currentDayWind.textContent = `Wind: ${Math.round(currentDayData.wind.speed)} mph`;
  
        const currentDayHumidity = document.getElementById('currentDay-humidity');
        currentDayHumidity.textContent = `Humidity: ${currentDayData.main.humidity}%`;
  
        const currentDayUV = document.getElementById('currentDay-uv');
        currentDayUV.textContent = `UV: ${getUVIndexText(currentDayData)}`;
  
        // populate daily forecast data
        const dailyCards = document.querySelectorAll('.daily-card');
        forecastData.forEach((forecast, index) => {
          const dailyCard = dailyCards[index];
  
          const dayName = dailyCard.querySelector('.day');
          dayName.textContent = getDayOfWeek(forecast.dt);
  
          const weatherImg = dailyCard.querySelector('.weather-img');
          weatherImg.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  
          const maxTemp = dailyCard.querySelector('.max');
          maxTemp.textContent = `High: ${Math.round(forecast.main.temp_max)}°F`;
  
          const minTemp = dailyCard.querySelector('.min');
          minTemp.textContent = `Low: ${Math.round(forecast.main.temp_min)}°F`;
  
          const wind = dailyCard.querySelector('.wind');
          wind.textContent = `Wind: ${Math.round(forecast.wind.speed)} mph`;
  
          const humidity = dailyCard.querySelector('.humidity');
          humidity.textContent = `Humidity: ${forecast.main.humidity}%`;
        });
  
        // show hidden cards
        const today = document.getElementById('today');
        today.style.display = 'block';
  
        const containerDailyCards = document.getElementById('container-daily-cards');
        containerDailyCards.style.display = 'flex';
  
        // update city name
        const cityNameEl = document.getElementById('city-name');
        cityNameEl.textContent = cityName;
  
        // save search history
        saveSearchHistory(cityName);
      })
      .catch(error => console.error('Error:', error));

  }
function renderForecastData(data) {
  const dailyCards = document.querySelectorAll('.daily-card');
  dailyCards.forEach((card, index) => {
    const forecast = data.daily[index + 1];
    const date = new Date(forecast.dt * 1000);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const maxTemp = Math.round(forecast.temp.max);
    const minTemp = Math.round(forecast.temp.min);
    const windSpeed = Math.round(forecast.wind_speed);
    const humidity = forecast.humidity;
    const icon = forecast.weather[0].icon;
    const description = forecast.weather[0].description;
    
    const img = card.querySelector('.weather-img');
    const day = card.querySelector('.day');
    const max = card.querySelector('.max');
    const min = card.querySelector('.min');
    const wind = card.querySelector('.wind');
    const humid = card.querySelector('.humidity');

    img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    day.textContent = dayOfWeek;
    max.textContent = `High: ${maxTemp}°F`;
    min.textContent = `Low: ${minTemp}°F`;
    wind.textContent = `Wind: ${windSpeed} mph`;
    humid.textContent = `Humidity: ${humidity}%`;
    card.setAttribute('title', `${description}`);
  });

  const containerDailyCards = document.getElementById('container-daily-cards');
  containerDailyCards.style.display = 'block';
}


  const fetchWeather = (location) => {
    const { lat, lon, name: city } = location;
    const apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  
    fetch(apiUrl)
      .then(res => res.json())
      .then(renderForecast)
      .catch(console.error);
  };
  
  const fetchCoords = async (search) => {
    const apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
  
      if (!data[0]) {
        alert('Location not found');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    const search = searchInput.value.trim();
    if (search) {
      fetchCoords(search);
      searchInput.value = '';
    }
  };
  
  const handleSearchHistoryClick = (e) => {
    const btn = e.target.closest('.btn-history');
    if (btn) {
      const search = btn.getAttribute('data-search');
      fetchCoords(search);
    }
  };
  
  //initSearchHistory();
  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#search-form');
    const searchHistoryContainer = document.querySelector('#search-history-container');
  
  });

  const addToPreviouslySearched = currentCityObj => {
    const cityLon = currentCityObj.cityLon;
    const cityLat = currentCityObj.cityLat;
    const cityName = currentCityObj.cityName;
    const cityCountry = currentCityObj.cityCountry;
    const cityId = currentCityObj.cityId;
  
    if (isInList(cityId)) {
      document.querySelector(`[data-city-id="${cityId}"]`).remove();
    }
  
    const span = document.createElement("span");
    span.textContent = `${cityName}, ${cityCountry}`;
    span.setAttribute("data-city-lon", `${cityLon}`);
    span.setAttribute("data-city-lat", `${cityLat}`);
    span.setAttribute("data-city-name", `${cityName}`);
    span.setAttribute("data-city-country", `${cityCountry}`);
    span.setAttribute("data-city-id", `${cityId}`);
    span.setAttribute("class", "prev-searched");
    span.addEventListener("click", loadNewData);
  
    prevSearchDiv.prepend(span);
  };
  
  const addToLocalStorage = cityToAdd => {
    let prevCitiesArr = getCitiesFromLocalStorage();
    prevCitiesArr.push(cityToAdd);
    prevCitiesStr = JSON.stringify(prevCitiesArr);
    window.localStorage.setItem("prevCities", prevCitiesStr);
  };
  
  const getCitiesFromLocalStorage = () => {
    let prevCitiesArr = JSON.parse(window.localStorage.getItem("prevCities"));
    if (!prevCitiesArr) {
      prevCitiesArr = [];
    }
    return prevCitiesArr;
  };
  
  const showFoundCities = () => {
    selectorDiv.classList.remove("selector-hidden");
    selectorDiv.classList.add("selector-visible");
    document.getElementById("search").style.display = "none";
  };
  
  const clearAndHideFoundCities = () => {
    selectorDiv.innerHTML = "";
    selectorDiv.classList.remove("selector-visible");
    selectorDiv.classList.add("selector-hidden");
    document.getElementById("search").style.display = "flex";
    document.getElementById("search-btn").previousElementSibling.value = "";
  };
  
  const getEndPoint = (cityLat, cityLon) => {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&exclude=hourly&units=imperial`;
  };
  
  const loadNewData = event => {
    const curCityLon = event.target.dataset.cityLon;
    const curCityLat = event.target.dataset.cityLat;
    const curCityName = event.target.dataset.cityName;
    cityName = curCityName;
    const curCityCountry = event.target.dataset.cityCountry;
    const curCityId = event.target.dataset.cityId;
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const cityNameInput = document.getElementById('city-name-input');
    const searchBtn = document.getElementById('search-btn');
  
  //   searchBtn.addEventListener("click", () => {
  //     const cityName = cityNameInput.value.trim();
  //     if (cityName) {
  //       renderForecast(cityName);
  //     }
  //   });
  // });
  });