"use strict";

// getting elements
var notificationElement = document.querySelector(".notification");
var iconElem = document.querySelector(".weather-icon");
var tempElem = document.querySelector("#value-temp");
var descElem = document.querySelector(".temperature-description p");
var locationElem = document.querySelector("#location-value"); //store date

var weather = {};
weather.temperature = {
  unit: "celsius"
}; // evento listeners 

tempElem.addEventListener("click", function () {
  // esse código só vai rodar se a temperatura for indefinidade
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    var fahren = celsiusToFahren(weather.temperature.value); // convertendo celsius para fahren

    fahren = Math.floor(fahren); // jogando no html

    tempElem.innerHTML = "".concat(fahren, " \xB0 <span>F</span>"); //definindo o tipo da unidade

    weather.temperature.unit = "fahrenheit";
  } else {
    // apenas jogando o valor celsius de volta para o html
    tempElem.innerHTML = "".concat(weather.temperature.value, "\xB0 <span>C</span>");
    weather.temperature.unit = "celsius";
  }
}); // obtendo geolocalização

if ("geolocation" in navigator) {
  // estamos pergundando se o navegador suporta a geolozalização
  // se sim aqui obtemos a posição atual do usuário
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p> É necessário habilitar a sua localização </p>";
}

function setPosition(position) {
  // pegando as coordenadas
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude; //chamando a função getWeather

  getWeather(latitude, longitude);
}

function showError(error) {
  // é necessário settar como display block para poder mostrar a mensagem
  var elemP = document.createElement("P");
  var model_error = document.querySelector('.model-error');
  elemP.classList.add("error"); // mostra o erro que ocorreu 

  elemP.innerHTML = "".concat(error.message);
  model_error.classList.toggle("-hidden");
  model_error.appendChild(elemP);
}

var KELVIN = 273;
var key = "ca2f66db1ecb9b47a2e4e9aa16ae32eb"; // assim que obtermos a longitude e latitude esse código será executado

function getWeather(latitude, longitude) {
  //segue o corpo do link da api onde pegamos a longi + lat + key
  var api = "http://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(key);
  console.log(api);
  fetch(api).then(function (response) {
    var data = response.json();
    return data;
  }) // propriedades do objeto
  .then(function (data) {
    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.city = data.name;
    weather.country = data.sys.country;
  }) // mostrando na tela as informações
  .then(function () {
    displayWeather();
  });
}

function displayWeather() {
  iconElem.innerHTML = "<img scr=\"img/".concat(weather.icon - 1, ".png\"/>");
  tempElem.innerHTML = "".concat(weather.temperature.value, " \xB0 <span>C</span>");
  descElem.innerHTML = "".concat(weather.description);
  locationElem.innerHTML = "".concat(weather.city, ",").concat(weather.country);
}
