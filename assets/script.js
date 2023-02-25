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
  console.log("Weather description:", weatherDescription);
  // Render the weather information
  // ...
};

// Function to initialize search history from local storage
const initSearchHistory = () => {
  renderSearchHistory();
};

// Add event listener to search button
searchBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const search = searchInput.value.trim();
  if (search) {
    appendHistory(search);
    renderWeather(search);
  }
});

initSearchHistory();

function appendHistory(search, history) {
  if (history.indexOf(search) !== -1) {
    return history;
  }
  const updatedHistory = [...history, search];
  localStorage.setItem('search-history', JSON.stringify(updatedHistory));
  return updatedHistory;
}

function getSearchHistory() {
  const storedHistory = localStorage.getItem('search-history');
  return storedHistory ? JSON.parse(storedHistory) : [];
}

function getCurrentWeather(cityName, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
 // return fetch(url)
    // .then(response => response.json())
    // .then(data => ({
    //   temperature: Math.round(data.main.temp),
    //   description: data.weather[0].description,
    // }))
//     .catch(error => {
//       console.log(`An error occurred while fetching the weather data: ${error}`);
//       return null;
//     });
// }

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
const cityName = 'Enter the name of a city';

//const apiKey = 'your-api-key';

//const searchHistory = getSearchHistory();

appendHistory(cityName, searchHistory);

getCurrentWeather(cityName, apiKey)
  .then(weather => {
    if (weather) {
      renderCurrentWeather(cityName, weather);
    }
  });

  const renderForecast = (dailyForecast) => {
    const startDt = dayjs().add(1, 'day').startOf('day').unix();
    const endDt = dayjs().add(6, 'day').startOf('day').unix();
  
    const headingCOl = document.createElement('div');
    const heading = document.createElement('h4');
    headingCOl.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast';
    headingCol.append(heading);
  
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  
    dailyForecast
      .filter(forecast => forecast.dt >= startDt && forecast.dt < endDt)
      .filter(forecast => forecast.dt_txt.slice(11, 13) == "12")
      .forEach(forecast => renderForecastCard(forecast));
  };
  
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
  
    //searchForm.addEventListener('submit', handleSearchFormSubmit);
    //searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
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
  
  searchBtn.addEventListener("click", () => {
    const cityName = cityNameInput.value.trim();
    if (cityName) {
      renderForecast(cityName);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initSearchHistory();
  });
//a
// const apiKey = "c27a90ea804668002c47cdb527b44811";
// const mainEl = document.querySelector('#main');
// const searchHistory = [];
// const weatherApiRootUrl = 'https://api.openweathermap.org';
// const weatherApiKey = apiKey;

// const cityNameInput = document.getElementById('city-input');
// const searchButton = document.getElementById('search-button');

// const searchForm = document.querySelector('#search-form');
// const searchInput = document.querySelector('#search-input');
// const today = document.querySelector('#today');
// const forecast = document.querySelector('#forecast');
// // const searchHistory = document.querySelector('#history');
// const searchHistoryContainer = document.querySelector('#history');

// //TimeZone plugins
// // Function to display t day.js
// //dayjs.extend(window.dayjs_plugin_utc);
// //dayjs.extend(window.dayjs_plugin_timezone);


// function renderSearchHistory() {
//   searchHistoryContainer.innerHTML = '';

//   //Start at the end of histry array and count down to show the most recent st the top.
//   for (var i = searchHistory.length -1; i >= 0; i--) {
//     var btn = document.createElement('button');
//     btn.setAttribute('type', 'button');
//     btn.setAttribute('aria-controls', 'today forecast');
//     btn.classList.add('history-btn', 'btn-history');

//     // `data-search` allows access to city name when click handler is invoked
//     btn.setAttribute('data-search', searchHistory[i]);
//     btn.textContent = searchHistory[i];
//     searchHistoryContainer.append(btn);
//   }
// }

// // Get the weather data for a city
// const getWeatherData = (city) => {
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
//   return fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       return data;
//     })
//     .catch((error) => {
//       console.log("An error occurred while fetching the weather data:", error);
//     });
// };

// // Render the weather information for a city
// const renderWeather = (city) => {
//   getWeatherData(city)
//     .then((data) => {
//       // Access the weather description
//       const weatherDescription = data.weather[0].description;
//       console.log("Weather description:", weatherDescription);
      
//       // Render the weather information
//       // ...
//     });
// };



// Function to update histroy in local storage then updates displayed history.

// function appendHistory(search) {

//     //If there is no search term return the function
//     if (searchHistory.indexOf(search) !== -1) {
//         return;
//     }
//     searchHistory.push(search);

//     localStorage.setItem('search-history', JSON.stringify (searchHistory));
//     renderSearchHistory();
// }

// //Funciton to get search history from local storage
// function initSearchHistory() {
//   var storedHistory = localStorage.getItem ('search-history');
//   if (storedHistory) {
//     searchHistory = JSON.parse(storedHistory);
//   }
//   renderSearchHistory();
// }

// //Funciton to display the current weather data fetched from OpenWeather api
// function renderCurrentWeather(city, weather) {
//     var date = dayjs().format('M/D/YYY');

//     //Store response ata from our fetch request in variables
//     var tempF = weather.main.temp;
//     var windMph = weather.wind.speed;
//     var humidity = weather.main.humidity;
//     var iconUrl = `https://openweathermap.org/img/w${weather.weather[0].icon}.png`;
//     var iconDescription = weather.weather[0].description || weather[0],main;

//     var card = document.createElement('div');
//     var cardBody = document.createElement('div');
//     var heading = document.createElement('h2');
//     var weatherIcon = document.createElement('img');
//     var tempEl = document.createElement('p');
//     var windEl = document.createElement('p');
//     var humidityEl = document.createElement('p');

//     card.setAttribute('class', 'card');
//     cardBody.setAttribute('class', 'card-body');
//     card.append(cardBody);

//     heading.setAttribute('class', 'card-body');
//     tempEl.setAttribute('class', 'card-body');
//     windEl.setAttribute('class', 'card-body');
//     humidityEl.setAttribute('class', 'card-body');

//     heading.textContent = `${city} (${date})`;
//     weatherIcon.setAttribute('src', iconUrl);
//     weatherIcon.setAttribute('alt', iconDescription);
//     weatherIcon.setAttribute('class', 'weather-img');
//     heading.append(weatherIcon);
//     tempEl.textContext = `Temp: ${tempF}°F`;
//     windEl.textContext = `Wind: ${windMph} MPH`;
//     humidityEl.textContext = `Humidity: ${humidity} %`;
//     cardBody.append(heading, tempEl, windEl, humidityEl);

//     today.innerHTML = '';
//     today.append(card);
// }

// // onload defaults
// /*let lat = "52.5";
// let lon = "-1.95";*/

// let cityName = ("Enter the name of a city");

// let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;


// //To use the city name to fetch the weather data
// fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
//   .then(response => response.json())
//   .then(data => {
//     // Extract the relevant weather information from the data
//     const temperature = Math.round(data.main.temp);
//     const description = data.weather[0].description;
//     console.log(`Temperature in ${cityName}: ${temperature}°C`);
//     console.log(`Description: ${description}`);

//     renderCurrentWeather(cityName, data);
//   })
//   .catch((error) => {
//     console.log(`An error occurred while fetching the weather data: ${error}`);
//   });

  //a
  //.catch((error) => {
    //console.log("An error occurred while fetching the weather data:", error);

   // const renderWeather = (cityName) => {
    // const apiKey = "YOUR_API_KEY_HERE";
     // const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
   
     
     //a
//       fetch(url)
//         .then((response) => response.json())
//         .then((data) => {
//           const weatherDescription = data.weather[0].description;
//           const temperature = data.main.temp;
//           const feelsLike = data.main.feels_like;
    
//           // Log the weather information to the console
//           console.log(`The weather in ${cityName} is currently ${weatherDescription}.`);
//           console.log(`The temperature is ${temperature} Fahrenheit.`);
//           console.log(`It feels like ${feelsLike} Fahrenheit.`);
//         })
//         .catch((error) => {
//           console.log(`An error occurred while fetching the weather data: ${error}`);
//         });
//    // };

// const weatherDescription = data.weather[0].description;
// //const temperature = data.main.temp;
// //const feelsLike = data.main.feels_like;

// // Log the weather information to the console
// console.log(`The weather in ${cityName} is currently ${weatherDescription}.`);
// console.log(`The temperature is ${temperature} Fahrenheit.`);
// console.log(`It feels like ${feelsLike} Fahrenheit.`);

//   // .catch((error) => {
//   //   console.log(`An error occurred while fetching the weather data: ${error}`);
//   // });

// let firstLoad = true;

// // elements required
// const searchBtn = $("#search-btn");
// const searchDiv = $("#search");
// const selectorDiv = $("#selector");
// const prevSearchDiv = $("#previous-searches");

// /*const kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel*/

// //const apiKey = `${apiKey}`;


//a
// const renderForecastCard = (forecast) => {

//   //variables for data from the api
//   const iconUrl = `https://openweathermap.org/img/w${weather.weather[0].icon}.png`;
//   var iconDescription = forecast.weather[0].description;
//   var tempF = forecast.main.temp;
//   var windMph = forecast.wind.speed;
//   var humidity = forecast.main.humidity;

//   var card = document.createElement('div');
//   var cardBody = document.createElement('div');
//   var heading = document.createElement('h2');
//   var weatherIcon = document.createElement('img');
//   var tempEl = document.createElement('p');
//   var windEl = document.createElement('p');
//   var humidityEl = document.createElement('p');

//  col.append(card);
//  card.append(cardBody);
//  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

//   col.setAttribute('class', 'col-md');
//   col.classList.add('five-day-card');
//   cardBody.setAttribute('class', 'card-body p-2');
//   card.setAttribute('class', 'card bg-primary h-100 text-white');
//   tempEl.setAttribute('class', 'card-text');
//   windEl.setAttribute('class', 'card-text');
//   humidityEl.setAttribute('class', 'card-text');

//   cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
//   weatherIcon.setAttribute('src', iconUrl);
//   weatherIcon.setAttribute('alt', iconDescription);
//   weatherIcon.setAttribute('class', 'weather-img');
//   heading.append(weatherIcon);
//   tempEl.textContext = `Temp: ${tempF}°F`;
//   windEl.textContext = `Wind: ${windMph} MPH`;
//   humidityEl.textContext = `Humidity: ${humidity} %`;
//  forecastContainer.append(col);
// }
//a


// //a

//   fetch(endpoint)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error("Unable to fetch weather data");
//       }
//     })
//     .then((data) => {
//       const cityLon = data.coord.lon;
//       const cityLat = data.coord.lat;
//       const cityName = data.name;
//       const cityCountry = data.sys.country;
//       const cityId = data.id;
//       const endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&exclude=current,minutely,hourly&units=imperial`;
//       return fetch(endpoint);
//     })
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error("Unable to fetch forecast data");
//       }
//     })
//     .then((data) => {
//       const dailyData = data.daily;
//       const forecast = dailyData.slice(0, 5).map((day) => {
//         const date = new Date(day.dt * 1000);
//         const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
//         const temperature = day.temp.day;
//         const weatherDescription = day.weather[0].description;
//         return { weekday, temperature, weatherDescription };
//       });
//       console.log(`The 5-day forecast for ${cityName} is:`, forecast);
//     })
//     .catch((error) => {
//       console.log(`An error occurred while fetching the weather data: ${error}`);
//     });
// };

// // Example usage
// renderForecast("London");

// const isInList = (currentId = "") => {
//     if($(`[data-city-id="${currentId}"]`).length){
//         return true;
//     }else{
//         return false;
//     }
//}

//a
// const addToPreviouslySearched = currentCityObj => {
    
//     const cityLon = currentCityObj.cityLon;
//     const cityLat = currentCityObj.cityLat;
//     const cityName = currentCityObj.cityName;
//     const cityCountry = currentCityObj.cityCountry;
//     const cityId = currentCityObj.cityId;
    
//     if(isInList(cityId)){
//         $(`[data-city-id="${cityId}"]`).remove();
//     }

//     prevSearchDiv.prepend($(`<span>${cityName}, ${cityCountry}</span>`)
//     .attr("data-city-lon", `${cityLon}`)
//     .attr("data-city-lat", `${cityLat}`)
//     .attr("data-city-name", `${cityName}`)
//     .attr("data-city-country", `${cityCountry}`)
//     .attr("data-city-id", `${cityId}`)
//     .attr("class", "prev-searched")
//     .on("click", loadNewData));
// }

// const addToLocalStorage = cityToAdd => {

//     let prevCitiesArr = getCitiesFromLocalStorage();
//     prevCitiesArr.push(cityToAdd);
//     prevCitiesStr = JSON.stringify(prevCitiesArr);
//     window.localStorage.setItem("prevCities", prevCitiesStr);
// }

// // Retrives previous city data from local storage, sets to empty array is nothing in local storage
// const getCitiesFromLocalStorage = () => {
//     prevCitiesArr = JSON.parse(window.localStorage.getItem("prevCities"));
//     if(!prevCitiesArr){
//         prevCitiesArr = [];
//     }
//     return prevCitiesArr;

// }

// const showFoundCities = () => {
//     selectorDiv.removeClass("selector-hidden").addClass("selector-visible");
//     $("#search").css({'display': 'none'});
// }
    
// const clearAndHideFoundCities = () => {
//     selectorDiv.empty();
//     selectorDiv.removeClass("selector-visible").addClass("selector-hidden");
//     $("#search").css({'display': 'flex'});
//     $("#search-btn").siblings("input")[0].value = "";
// }

// const getEndPoint = (cityLat, cityLon) => {
//     let endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&exclude=hourly&units=imperial`;
//     return endpoint;
// }

// // load new data by getting from new endpoint
// const loadNewData = event => {

//     const curCityLon = $(event.target).data("city-lon");
//     const curCityLat = $(event.target).data("city-lat");
//     const curCityName = $(event.target).data("city-name");
//     cityName = curCityName;
//     const curCityCountry = $(event.target).data("city-country");
//     const curCityId = $(event.target).data("city-id");

// }; 

// searchButton.addEventListener("click", () => {
//   const cityName = cityNameInput.value.trim();
//   if (cityName) {
//     renderForecast(cityName);
//   }
// });



// // Example usage
// renderWeather("London");
//a