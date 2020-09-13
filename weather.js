//==============================================================================================================//
// Name:                    PHUOC NGUYEN
// APP NAME:                DEMO - RESPONSIVE WEATHER FORECAST APP
// DATA SOURCE:             https://api.openweathermap.org
// STYLESHEET CSS SOURCE:   author - JonUK
//                          link-github: https://github.com/JonUK/responsive-web-weather-app
//                   AND:   https://materializecss.com/
// EXTERNAL JS SOURCE:      JS moment.js
// CREATED DATE:            Sept 13 2020
// FILE NAME:               weather.js
//==============================================================================================================//

// APIKEY, APIURL FOR OPENWEATHERMAP
const APIKEY = "934d535f99533d481523b48e0baab140";
const APIURL = "https://api.openweathermap.org/data/2.5/";
const ICONURL = "http://openweathermap.org/img/wn/";

// Function to convert the Kelvin degree to Celcius degree
function Kelvin2Celcius(degree) {
    return Math.round(degree - 273.15);
}

// Function to convert the Kelvin degree to Fahrenheit degree
function Kelvin2Fahrenheit(degree) {
    return Math.round((degree - 273.15)*9/5 + 32);
}

// Function to convert Time
function dateConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    return a.toDateString();
}

// Function to reset the main tag html
function resetMainHTML() {
    const main = document.querySelector("main");
    main.parentNode.removeChild(main);
    const new_main = document.createElement("main");
    new_main.classList.add("main-container");
    document.querySelector("body").appendChild(new_main);
}

// Function to get the weather data by location
function getWeatherByLocation(location_name) {
    fetch(APIURL + "weather?q=" + location_name + "&appid=" + APIKEY, 
        {origin: "cors"})
        .then(response => response.json())
        .then(function(obj) {
            addLocationToPage(obj);
            var lat = obj.coord.lat;
            var lon = obj.coord.lon;
            getInfoByCoordinations(lat, lon);
        })
        .catch(() => {
            alert("No city found!");
        });
}

// Function to get the weather location by its lattitude and longtitude
function getInfoByCoordinations(lattitude, longtitude) {
    fetch(APIURL + "onecall?lat=" + lattitude + "&lon=" + longtitude + "&appid=" + APIKEY, 
        {origin: "cors"})
        .then(response => response.json())
        .then(function(obj) {
            addInfoToPage(obj);
        })
        .catch(function(err) {
            console.error("Something wrong!");
            console.error(err);
        });
}

// Function to add the location name to page
function addLocationToPage(data) {
    const {name, sys} = data;

    // Create a div tag, its class and HTML content, then add them into page
    const div = document.createElement("div");
    div.classList.add("location-and-date");
    const markup = `
        <h1 class="location-and-date__location">${name}, ${sys.country}</h1>
    `;
    div.innerHTML = markup;
    document.querySelector(".main-container").appendChild(div);
}

// Function to add the spectific information to page
function addInfoToPage(data) {
    const {current, daily, hourly, timezone} = data;
    const icon = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;


    // Add the current time at specific location in search
    const date_hour_tag = document.createElement("div");
    const date_hour_tag_markup = `
        ${moment(current.dt * 1000).tz(timezone).format('llll')}
    `;
    date_hour_tag.innerHTML = date_hour_tag_markup;
    document.querySelector(".location-and-date").appendChild(date_hour_tag);


    // Add the detailed information at specific location at current time
    // Add the current temperature and description
    const temp_tag = document.createElement("div");
    temp_tag.classList.add("current-temperature");
    const temp_markup = `
        <div class="current-temperature__icon-container">
            <img src=${icon} alt=${current.weather[0].main} class="current-temperature__icon">
        </div>
        <div class="current-temperature__content-container">
            <div class="current-temperature__value">${Kelvin2Celcius(current.temp)}&#176;</div>
            <div class="current-temperature__summary">${current.weather[0].description}</div>
        </div>
    `;
    temp_tag.innerHTML = temp_markup;


    // Add the max, min, wind speed, feel like, humidity and visibility to page
    const status = document.createElement("div");
    status.classList.add("current-stats");
    const status_markup = `
        <div>
        <div class="current-stats__value">${Kelvin2Celcius(daily[0].temp.max)}&#176;</div>
        <div class="current-stats__label">High</div>
        <div class="current-stats__value">${Kelvin2Celcius(daily[0].temp.min)}&#176;</div>
        <div class="current-stats__label">Low</div>
        </div>
        <div>
        <div class="current-stats__value">${current.wind_speed}mph</div>
        <div class="current-stats__label">Wind</div>
        <div class="current-stats__value">${Kelvin2Celcius(current.feels_like)}&#176;</div>
        <div class="current-stats__label">Feel like</div>
        </div>
        <div>
        <div class="current-stats__value">${current.humidity}%</div>
        <div class="current-stats__label">Humidity</div>
        <div class="current-stats__value">${current.visibility / 1000}km</div>
        <div class="current-stats__label">Visibility</div>
        </div>
    `;
    status.innerHTML = status_markup;


    // Add the weather information for the next 36 hours to page
    const weather_hour_tag = document.createElement("div");
    weather_hour_tag.classList.add("weather-by-hour");
    const weather_hour_tag_markup = `
        <h2 class="weather-by-hour__heading">Next 36 hours' weather</h2>
        <div class="weather-by-hour__container">
    `;
    weather_hour_tag.innerHTML = weather_hour_tag_markup
    document.querySelector(".main-container").appendChild(temp_tag);
    document.querySelector(".main-container").appendChild(status);
    document.querySelector(".main-container").appendChild(weather_hour_tag);

    
    // For loop to add the temperature and time for 36 hours' weather
    for (var i = 1; i <= 36; i+=3) {
        var weather_hour_item = document.createElement("div");
        weather_hour_item.classList.add("weather-by-hour__item");
        var icon_parse = hourly[i].weather[0].icon;
        var weather_hour_item_markup = `
            <div class="weather-by-hour__hour" id="hour${i}">${moment(hourly[i].dt*1000).tz(timezone).format('LT')}</div>
            <img src="https://openweathermap.org/img/wn/${icon_parse}@2x.png" alt=${hourly[i].weather[0].main}>
            <div>${Kelvin2Celcius(hourly[i].temp)}&#176;</div>
        `;
        weather_hour_item.innerHTML = weather_hour_item_markup;
        document.querySelector(".weather-by-hour__container").appendChild(weather_hour_item);
    }


    // Add the information of weather forecast for a week ahead
    const forecast_tag = document.createElement("div");
    forecast_tag.classList.add("next-5-days");

    const forecast_heading_markup = `
        <h2 class="next-5-days__heading">Next 5 days</h2>
        <div class="next-5-days__container">
    `;
    forecast_tag.innerHTML = forecast_heading_markup;
    document.querySelector(".main-container").appendChild(forecast_tag);

    for (var i = 1; i <= 8; i++) {
        var forecast_item = document.createElement("div");
        forecast_item.classList.add("next-5-days__row");
        var icon_daily_parse = daily[i].weather[0].icon;
        var forecast_daily_item_markup = `
            <div class="next-5-days__date">
                ${moment(daily[i].dt*1000).tz(timezone).format('dddd')}
                <div class="next-5-days__label">30/7</div>
            </div>
            <div class="next-5-days__low">
                ${Kelvin2Celcius(daily[i].temp.min)}&#176;
                <div class="next-5-days__label">Low</div>
            </div>
            <div class="next-5-days__high">
                ${Kelvin2Celcius(daily[i].temp.max)}&#176;
                <div class="next-5-days__label">High</div>
            </div>
            <div class="next-5-days__icon">
                <img src="https://openweathermap.org/img/wn/${icon_daily_parse}@2x.png" alt=${daily[i].weather[0].main}>
            </div>
            <div class="next-5-days__rain">
                ${daily[i].humidity}%
                <div class="next-5-days__label">Humidity</div>
            </div>
            <div class="next-5-days__wind">
                ${daily[i].wind_speed}mph
                <div class="next-5-days__label">Wind</div>
            </div>
        `;
        forecast_item.innerHTML = forecast_daily_item_markup;
        document.querySelector(".next-5-days__container").appendChild(forecast_item);
    }
}

// Function to load the content
window.addEventListener("DOMContentLoaded", (function() {
    const form = document.getElementById("form");
    const search_location = document.getElementById("search");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const location_name = search_location.value;
        if (location_name) {
            resetMainHTML();
            getWeatherByLocation(location_name);
        }
    });
}));