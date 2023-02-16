const apiKey = "c27a90ea804668002c47cdb527b44811";
const mainEl = $("#main")
const searchHistory = [];
const weatherApiRootUrl = 'https://api.openweather.org';



// onload defaults
/*let lat = "52.5";
let lon = "-1.95";*/

let cityName = prompt("Enter the name of a city");

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&${apiKey}`;


//To use the city name to fetch the weather data
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    // Extract the relevant weather information from the data
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    console.log(`Temperature in ${cityName}: ${temperature}°C`);
    console.log(`Description: ${description}`);
  })
  .catch((error) => {
    console.log("An error occurred while fetching the weather data:", error);
  });
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;

    // Log the weather information to the console
    console.log(`The weather in ${cityName} is currently ${weatherDescription}.`);
    console.log(`The temperature is ${temperature} Fahrenheit.`);
    console.log(`It feels like ${feelsLike} Fahrenheit.`);

  .catch(error => {
    console.error(`An error occurred while fetching the weather data: ${error}`);
  });
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

const populatePreviouslySearched = () => {
    let prevCitiesArr = getCitiesFromLocalStorage();
    for (i in prevCitiesArr) {

        const currentCityObj = {
        "cityLat" : prevCitiesArr[i].cityLat,
        "cityLon" : prevCitiesArr[i].cityLon,
        "cityName" : prevCitiesArr[i].cityName,
        "cityCountry" : prevCitiesArr[i].cityCountry,
        "cityId" : prevCitiesArr[i].cityId 
        };
    
        addToPreviouslySearched(currentCityObj);
    }
}

const clearPreviouslySearched = () => {
    window.localStorage.setItem("prevCities", "[]");
    $("#previous-searches").text("");
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

    getDataThenPopulatePage(getEndPoint(curCityLat, curCityLon));
    
    clearAndHideFoundCities();
    currentCityObj = {
    "cityLat" : curCityLat,
    "cityLon" : curCityLon,
    "cityName" : curCityName,
    "cityCountry" : curCityCountry,
    "cityId" : curCityId 
    };

    addToLocalStorage(currentCityObj);
    addToPreviouslySearched(currentCityObj);
}

// displays cities in a div and makes them selectable
const showCitiesFound = currentCity => {

    const cityId = currentCity.id;
    const cityLon = currentCity.coord.lon;
    const cityLat = currentCity.coord.lat;
    const cityName = currentCity.name;
    const cityCountry = currentCity.country;

    showFoundCities();

    selectorDiv.append($(`<span>${cityName}, ${cityCountry}</span><br>`)
    .attr("data-city-lon", `${cityLon}`)
    .attr("data-city-lat", `${cityLat}`)
    .attr("data-city-name", `${cityName}`)
    .attr("data-city-country", `${cityCountry}`)
    .attr("data-city-id", `${cityId}`)
    .on("click", loadNewData));

}

// uses cities object to find matching cities
const searchCity = () => {
        selectorDiv.empty();
        const arrCity = cities.filter(city => city.name == cityName);
           
        if (arrCity.length > 0 && cityName != ""){
            for (i in arrCity){
                showCitiesFound(arrCity[i]);
            }
        }else{
            showFoundCities();

            selectorDiv.append($(`<p>City not found, Please search again</p>`));
            selectorDiv.on("click", clearAndHideFoundCities);
        }
}     

// returns string reprenting the month from interger
const intToMonth = monthAsInt => {
    let month = "";
    switch(monthAsInt){
        case 0:
            month  = "January";
            break;
        case 1:
            month  = "Febuary";
            break;
        case 2:
            month  = "March";
            break;
        case 3:
            month  = "April";
            break;
        case 4:
            month  = "May";
            break;
        case 5:
            month  = "June";
            break;
        case 6:
            month  = "July";
            break;
        case 7:
            month  = "August";
            break;
        case 8:
            month  = "September";
            break;
        case 9:
            month  = "October";
            break;
        case 10:
            month  = "Novemeber";
            break;
        case 11:
            month  = "December";
    }
    return month ;
}
// returns string reprenting the day from interger
const intToDay = dayAsInt => {
    let day = "Weather";
    switch(dayAsInt){
        case 0:
            day = "Sunday";
            break;
          case 1:
            day = "Monday";
            break;
          case 2:
            day = "Tuesday";
            break;
          case 3:
            day = "Wednesday";
            break;
          case 4:
            day = "Thursday";
            break;
          case 5:
            day = "Friday";
            break;
          case 6:
            day = "Saturday";
    }
    return day;
}

// updates 5 day forecast cards with data
const updateFiveDay = daysData => {
    for (let i = 0; i < 5; i++){
      
        const currentDiv = $(`div[data-fiveday="${i}"]`);

        const currentMax = daysData[i].temp.max;
        const currentMin = daysData[i].temp.min;
        const currentWind = daysData[i].wind_speed;
        const currentHumidity = daysData[i].humidity;
        const currentIcon = daysData[i].weather[0].icon;
        const currentIconSrc = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
        const date = new Date(daysData[i].dt * 1000);
        const day = intToDay(date.getDay())

        $(currentDiv).children(".max")[0].textContent = `Max: ${currentMax}°C`
        $(currentDiv).children(".min")[0].textContent = `Min: ${currentMin}°C`
        $(currentDiv).children(".wind")[0].textContent = `Wind: ${currentWind}mph`
        $(currentDiv).children(".humidity")[0].textContent = `Humidity: ${currentHumidity}%`
        $(currentDiv).children(".weather-img")[0].src = currentIconSrc;
        $(currentDiv).children(".day")[0].textContent = day;

        
    }
}

// updates todays forecast card
const updateToday = todayData => {
    
    // 
    const max = Math.round(kevlinToCelsius(todayData.temp.max));
    const min = Math.round(kevlinToCelsius(todayData.temp.min));
    const wind = todayData.wind_speed;
    const humidity = todayData.humidity;
    const iconSrc = todayData.weather[0].icon;
  
    
    const uv = todayData.uvi;

    // Getting today as a day, DoM and month
    const date = new Date(todayData.dt * 1000);
    
    const day = intToDay(date.getDay());
    const dayMonth = date.getDate();
    const month = intToMonth(date.getMonth());

    // Populating all todays information
    $("#today-max")[0].textContent = `Max: ${max}°C`;
    $("#today-min")[0].textContent = `Min: ${min}°C`;
    $("#today-wind")[0].textContent = `Wind: ${wind}mph`;
    $("#today-humidity")[0].textContent = `Humidity: ${humidity}%`;
    $("#today-img")[0].src = `http://openweathermap.org/img/wn/${iconSrc}@2x.png`;
    $("#city-name")[0].textContent = `${cityName}`;
    $("#today-uv")[0].textContent = `UV: ${uv}`;
    $("#todays-date")[0].textContent = `${day}, ${dayMonth} ${month}`;
 
  
    if (uv < 3){
        $("#today-uv").removeClass("moderate-uv severe-uv").addClass("favorable-uv");
    }else if (uv < 6){
        $("#today-uv").removeClass("favorable-uv severe-uv").addClass("moderate-uv");
    }else{
        $("#today-uv").removeClass("favorable-uv moderate-uv").addClass("severe-uv");
    }

    
}

// fetch json from API and calls functions to populate the DOM
const getDataThenPopulatePage = (givenUrl = url) => {

    fetch(givenUrl)
    .then(reponse => reponse.json())
    .then(data => {

        updateFiveDay(data.daily);
        updateToday(data.daily[0]);

        if (firstLoad){
            populatePreviouslySearched();
            firstLoad = false;
        }
        
    })
}

getDataThenPopulatePage(); // call function to populate on load

// create event listerner for the search button
searchBtn.click(event => { 
    event.preventDefault();
   
    // Ensure correct formatting of search string
    let tmpCityName = $("#search-btn").siblings("input")[0].value;

    // Checks for a input with atleast one none-whitespace char
    if(tmpCityName.trim()){
        tmpCityName = tmpCityName.trim();
        tmpCityName = tmpCityName.toLowerCase();
        cityName = tmpCityName[0].toUpperCase() + tmpCityName.slice(1);
        searchCity()
    }

});
 
$("#clear-history").on("click", clearPreviouslySearched)
