//After the page loads, the location is fetched.
window.addEventListener('load', ()=> {
    //Variables and Constants declaration.
    let longitude;
    let latitude;
    //let temperature;
    const KELVIN = 273;


    //App data
    const weather = {};
    const location = {};

    weather.temperature = {
        unit: "celcius"
    }

    // SELECT ELEMENTS
    const iconElement = document.querySelector(".weather-icon");
    const tempElement = document.querySelector(".temperature-value p");
    const descElement = document.querySelector(".temperature-description p");
    const feelsLikeElement = document.querySelector(".temperature-feelsLike p");
    const tempMaxElement = document.querySelector("temperature-max p");
    const tempMinElement = document.querySelector("temperature-min p");
    const humidityElement = document.querySelector("temperature-humidity p");
    const locationAreaElement = document.querySelector(".location-area p");
    const locationCountryElement = document.querySelector(".location-state-country p");
    const notificationElement = document.querySelector(".notification");


    // API KEY
    const key_OpenWeather = "e894d0938fda45b8b566b35be69a287a";
    const key_AccuWeather = "Fg3L2uGD1QxqMj5JlB48y3USjSNrp9kF";

    


    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            console.log(position);
            longitude = position.coords.longitude;
            latitude = position.coords.latitude;

            const temperatureApi = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key_OpenWeather}`;
            fetch(temperatureApi)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log("OpenWeatherAPI_Output: ");
                    console.log(data);
                    // const {name} = data;
                    // const {temp_max, temp_min, humidity} = data.main;
                    // const {description, icon} = data.weather[0];
                    // const {country} = data.sys;
                    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                    weather.temperature.feelsLike = Math.floor(data.main.feels_like - KELVIN);
                    weather.temperature.maxTemp = Math.floor(data.main.temp_max - KELVIN);
                    weather.temperature.minTemp = Math.floor(data.main.temp_min - KELVIN);
                    weather.humidity = data.main.humidity;
                    weather.description = data.weather[0].description;
                    weather.iconId = data.weather[0].icon;
                    weather.city = data.name;
                    weather.country = data.sys.country;
                    console.log(weather.city + ", " + weather.country + " | Temperature: " + weather.temperature.value + ", Description: " + weather.description + ", Feels_Like: " + weather.humidity);

                    // Set the DOM elements.
                    // iconElement.textContent = icon;
                    // tempElement.textContent = Math.floor(temp_max - KELVIN);
                    // celsiusToFahrenheit(tempElement.textContent);
                    // descElement.textContent = description;
                    // locationElement.textContent = name + "," + country;
                })
                .then(function(){
                    displayWeather();
                });

            const locationApi = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${key_AccuWeather}&q=${latitude}, ${longitude}`;
            fetch(locationApi)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log("AccuWeatherAPI_Output: ");
                    console.log(data);
                    location.state = data.AdministrativeArea.EnglishName;
                    location.country = data.Country.EnglishName;
                    console.log("State: " + location.state + ", " + location.country);
                })
                .then(function() {
                    displayWeather();
                });
        });
        
    } else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }

    // DISPLAY WEATHER TO UI
    function displayWeather(){
        iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = weather.description;
        feelsLikeElement.innerHTML = `Feels Like: ${weather.temperature.feelsLike}°<span>C</span>`;
        // tempMaxElement.innerHTML = `Max Temp: ${weather.temperature.maxTemp}°<span>C</span>`;
        // tempMinElement.innerHTML = `Min Temp: ${weather.temperature.minTemp}°<span>C</span>`;
        // humidityElement.innerHTML = `${weather.humidity}`;
        locationAreaElement.innerHTML = `${weather.city}`;
        locationCountryElement.innerHTML = `${location.state} , ${location.country}`;
    }

    //C to F Conversion
    function celsiusToFahrenheit(temperature){
        return((temperature * 9/5) + 32);
    }

    // WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
    tempElement.addEventListener("click", function(){
        if(weather.temperature.value === undefined && weather.temperature.feelsLike === undefined) return;
        
        if(weather.temperature.unit == "celsius"){
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);
            let fahrenheit_feelsLike = celsiusToFahrenheit(weather.temperature.feelsLike);
            fahrenheit_feelsLike = Math.floor(fahrenheit_feelsLike);
            
            tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";

            feelsLikeElement.innerHTML = `Feels Like: ${fahrenheit_feelsLike}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        }else{
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius"
            feelsLikeElement.innerHTML = `Feels Like: ${weather.temperature.feelsLike}°<span>C</span>`;
            weather.temperature.unit = "celsius";
        }
    });
});