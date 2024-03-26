"use strict";
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

//Default city when the page loads
let cityInput = "Delhi";

//Add click events to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //change name from the default city to the clicked city
        cityInput = e.target.innerHTML;
        //Function call to fetch data of the giver city
        fetchWeatherData();

        //fade out the app (simple animation)
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    //if search bar remains empty then give alert
    if(search.value.length == 0){
        alert('Please type a city name!!');
    }
    else{
        //change name from the default city to the searched city
        cityInput = search.value;
        //Function call to fetch data of the giver city
        fetchWeatherData();
        //Remove the text from input field
        search.value = "";
        //fade out the app (simple animation)
        app.style.opacity = "0";
    };
    //Prevents the default behavior of the form
    e.preventDefault();
});

function dayOfTheWeek(day, month, year){
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const datee = new Date(`${month} ${day}, ${year}`);
    return weekday[datee.getDay()];
};

//function of fetching the data from api
function fetchWeatherData(){
    //fetch the api
    fetch(`https://api.weatherapi.com/v1/current.json?key=47d3445512f34e3cb5c63916242403&q=${cityInput}&aqi=no`)

    //take the data(which is in JSON format) and convert it into a regular JS object
    .then(response => response.json())
    .then(data => {
        //printing data in console
        console.log(data);

        //now add temperature and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176";
        conditionOutput.innerHTML = data.current.condition.text;

        //date as a string
        const date = data.location.localtime;

        //saving date month year in int form
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        console.log(dayOfTheWeek(d, m, y));
        timeOutput.innerHTML = time;

        //add name as location
        nameOutput.innerHTML = data.location.name;

        //now for the icon
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        icon.src = "./icons/" + iconId;

        //get weather details - wind and all
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //set default time of day
        let timeOfDay = "day";
        
        //get the unique id for each weather condition
        const code = data.current.condition.code;

        //change timeOfDay into night if night
        if(!data.current.is_day){
            timeOfDay = "night";
        }

        if(code == 1000){
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`
            //change the button color depending upon the night or day
            btn.style.background = "#e5ba92";
            if(timeOfDay == "night"){
                btn.style.background = "#181e27";
            }
        }

        //codes for cloudy weather
        else if(
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ){
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            if(timeOfDay == "night"){
                btn.style.background = "#181e27";
            }
        }

        else if(
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ){
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if(timeOfDay == "night"){
                btn.style.background = "#325c80";
            }
        }

        //finally snow
        else{
            app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if(timeOfDay == "night"){
                btn.style.background = "#1b1b1b";
            }
        }

        //fade the page once all is done
        app.style.opacity = "1";
    })

    //if user enter a city which is not valid then
    .catch((err) => {
        alert("City not found!Please try again");
        console.log(err);
        app.style.opacity = "1";
    });
}

//call the function when page loads
fetchWeatherData();


app.style.opacity = "1";