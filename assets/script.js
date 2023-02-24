const apiKey = "c27a90ea804668002c47cdb527b44811";
const mainEl = ('#main');
const searchHistory = [];
const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = apiKey;

const cityNameInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
// const searchHistory = document.querySelector('#history');
const searchHistoryContainer = document.querySelector('#history');

//TimeZone plugins

//dayjs.extend(window.dayjs_plugin_utc);
//dayjs.extend(window.dayjs_plugin_timezone);

// Get the weather data for a city
const getWeatherData = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("An error occurred while fetching the weather data:", error);
    });
};

// Render the weather information for a city
const renderWeather = (city) => {
  getWeatherData(city)
    .then((data) => {
      // Access the weather description
      const weatherDescription = data.weather[0].description;
      console.log("Weather description:", weatherDescription);
      
      // Render the weather information
      // ...
    });
};

// Function to display t day.js
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';

  //Start at the end of histry array and count down to show the most recent st the top.
  for (var i = searchHistory.length -1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// Function to update histroy in local storage then updates displayed history.

function appendHistory(search) {

    //If there is no search term return the function
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify (searchHistory));
    renderSearchHistory();
}

//Funciton to get search history from local storage
function initSearchHistory() {
  var storedHistory = localStorage.getItem ('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

//Funciton to display the current weather data fetched from OpenWeather api
function renderCurrentWeather(city, weather) {
    var date = date.js().format('M/D/YYY');

    //Store response ata from our fetch request in variables
    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0],main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'card-body');

}
// onload defaults
/*let lat = "52.5";
let lon = "-1.95";*/

let cityName = ("Enter the name of a city");

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;


//To use the city name to fetch the weather data
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    // Extract the relevant weather information from the data
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    console.log(`Temperature in ${cityName}: ${temperature}°C`);
    console.log(`Description: ${description}`);
  
  //.catch((error) => {
    //console.log("An error occurred while fetching the weather data:", error);
  })
const weatherDescription = data.weather[0].description;
const temperature = data.main.temp;
const feelsLike = data.main.feels_like;

// Log the weather information to the console
console.log(`The weather in ${cityName} is currently ${weatherDescription}.`);
console.log(`The temperature is ${temperature} Fahrenheit.`);
console.log(`It feels like ${feelsLike} Fahrenheit.`);

  // .catch((error) => {
  //   console.log(`An error occurred while fetching the weather data: ${error}`);
  // });

let firstLoad = true;

// elements required
const searchBtn = $("#search-btn");
const searchDiv = $("#search");
const selectorDiv = $("#selector");
const prevSearchDiv = $("#previous-searches");

/*const kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel*/

const isInList = (currentId = "") => {
    if($(`[data-city-id="${currentId}"]`).length){
        return true;
    }else{
        return false;
    }
}

const addToPreviouslySearched = currentCityObj => {
    
    const cityLon = currentCityObj.cityLon;
    const cityLat = currentCityObj.cityLat;
    const cityName = currentCityObj.cityName;
    const cityCountry = currentCityObj.cityCountry;
    const cityId = currentCityObj.cityId;
    
    if(isInList(cityId)){
        $(`[data-city-id="${cityId}"]`).remove();
    }

    prevSearchDiv.prepend($(`<span>${cityName}, ${cityCountry}</span>`)
    .attr("data-city-lon", `${cityLon}`)
    .attr("data-city-lat", `${cityLat}`)
    .attr("data-city-name", `${cityName}`)
    .attr("data-city-country", `${cityCountry}`)
    .attr("data-city-id", `${cityId}`)
    .attr("class", "prev-searched")
    .on("click", loadNewData));
}

const addToLocalStorage = cityToAdd => {

    let prevCitiesArr = getCitiesFromLocalStorage();
    prevCitiesArr.push(cityToAdd);
    prevCitiesStr = JSON.stringify(prevCitiesArr);
    window.localStorage.setItem("prevCities", prevCitiesStr);
}

// Retrives previous city data from local storage, sets to empty array is nothing in local storage
const getCitiesFromLocalStorage = () => {
    prevCitiesArr = JSON.parse(window.localStorage.getItem("prevCities"));
    if(!prevCitiesArr){
        prevCitiesArr = [];
    }
    return prevCitiesArr;

}

const showFoundCities = () => {
    selectorDiv.removeClass("selector-hidden").addClass("selector-visible");
    $("#search").css({'display': 'none'});
}
    
const clearAndHideFoundCities = () => {
    selectorDiv.empty();
    selectorDiv.removeClass("selector-visible").addClass("selector-hidden");
    $("#search").css({'display': 'flex'});
    $("#search-btn").siblings("input")[0].value = "";
}

const getEndPoint = (cityLat, cityLon) => {
    let endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&exclude=hourly&units=imperial`;
    return endpoint;
}

// load new data by getting from new endpoint
const loadNewData = event => {

    const curCityLon = $(event.target).data("city-lon");
    const curCityLat = $(event.target).data("city-lat");
    const curCityName = $(event.target).data("city-name");
    cityName = curCityName;
    const curCityCountry = $(event.target).data("city-country");
    const curCityId = $(event.target).data("city-id");

}; 

searchButton.addEventListener("click", () => {
  const cityName = cityNameInput.value.trim();
  if (cityName) {
    renderForecast(cityName);
  }
});



// Example usage
renderWeather("London");