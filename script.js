
let inputEl = document.querySelector("#autocomplete-input")

inputEl.addEventListener("input", onInputChange);

getCountryData();

let countryNames = [];

//--

async function getCountryData() {
  const countryRes = await fetch("https://restcountries.com/v3.1/all");
  const data = await countryRes.json();

  countryNames = data.map((country) => {
    return country.name.common;
  });
}
//-----

function onInputChange() {
  removeAutocompleteDropdown();

  const value = inputEl.value.toLowerCase();

  if (value.length === 0) return;

  const filteredNames = [];

  countryNames.forEach((countryName) => {
    if (countryName.substr(0, value.length).toLowerCase() === value)
      filteredNames.push(countryName);
  });
  createAutocompleteDropdown(filteredNames);
}

//-----

function createAutocompleteDropdown(List) {
  const listEl = document.createElement("ul");
  listEl.className = "autocomplete-list";
  listEl.id = "autocomplete-list";

  List.forEach((country) => {
    const listItem = document.createElement("li");

    const countryButton = document.createElement("button");
    countryButton.innerHTML = country;
    countryButton.addEventListener('click', onCountryButtonClick);
    listItem.appendChild(countryButton);

    listEl.appendChild(listItem);
  });

  document.querySelector("#autocomplete-wrapper").appendChild(listEl);
};

//----

function removeAutocompleteDropdown() {
  const listEl = document.querySelector('#autocomplete-list')
  if (listEl) listEl.remove();
};

//---

function onCountryButtonClick(e) {
  e.preventDefault();


  const buttonEl = e.target;
  inputEl.value = buttonEl.innerHTML;

  removeAutocompleteDropdown();

}

//----
let startingCurrency = document.querySelector("#start_currency_selector");
let finalCurrency = document.querySelector("#final_currency_selector");
let convertCurrencyButton = document.querySelector("#convert_currency");
let startingCurrencyValue = document.querySelector("#starting_currency_value")
let finalCurrencyValue = document.querySelector("#final_currency_value")

// Currency list creation
const currencyBaseURL = "https://api.exchangerate.host/"
const currencyList = () => {
  fetch(`${currencyBaseURL}symbols`)
    .then(response => response.json())
    .then(data => {
      let countryCode = Object.keys(data.symbols)
      for (currentCountry of countryCode) {
        startingCurrency.innerHTML += `<option value=${currentCountry}>${currentCountry}</option>`
        finalCurrency.innerHTML += `<option value=${currentCountry}>${currentCountry}</option>`
      }
    });
}
currencyList()

// Currency conversion - uses same base URL from list creator

const currencyConvert = () => {
  console.log(startingCurrency.value, finalCurrency.value, startingCurrencyValue.value)
  fetch(`${currencyBaseURL}convert?amount=${startingCurrencyValue.value}&from=${startingCurrency.value}&to=${finalCurrency.value}`)
    .then(response => response.json())
    .then(data =>
      finalCurrencyValue.value = data.result
    )
}
convertCurrencyButton.addEventListener('click', currencyConvert)
// --------country info
const sendButton = document.querySelector(".btn-submit");
const countryDiv = document.querySelector(".country_info_container");
const countryData = document.querySelector("#Country_data");
let countryCapital = document.querySelector('#Capital');
let countryContinent = document.querySelector('#Continent');
let countryPopulation = document.querySelector('#Population')
let countryCurrency = document.querySelector('#Country-Currency')
let countryFlag = document.querySelector('#flag-container')

let countryName = null 

function countryInfo(countryName) {
if (!countryName){
  countryName = inputEl.value;
}
// function countryInfo() {

  // let countryName = inputEl.value;
  console.log(countryName);

  let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  fetch(finalURL)
    .then((response) => response.json())
    .then((data) => {

      function addComma(num) {
        if (num === null) return;
        return (
          num
            .toString()
            .split("")
            .reverse()
            .map((digit, index) =>
              index != 0 && index % 3 === 0 ? `${digit},` : digit
            )
            .reverse()
            .join("")
        )
      }

      countryFlag.innerHTML = `<img src="${data[0].flags.png}" id="Country-flag" class="country_flag align-items-center" alt="flag-picture">`

      countryCapital.innerText = "Capital: " + data[0].capital

      countryContinent.innerText = "Continent: " + data[0].continents

      countryPopulation.innerText = "Population: " + addComma(data[0].population)

      countryCurrency.innerText = "Currency: " + Object.keys(data[0].currencies)[0]

      finalCurrency.innerHTML = `<option>${Object.keys(data[0].currencies)[0]}</option>`;

    })
};

var map = L.map('map').setView([51.505, -0.09], 3);

sendButton.addEventListener("click", ()=> countryInfo(countryName));

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup()

function onMapClick(e) {
  console.log("hi")
  fetch(`http://api.geonames.org/countryCodeJSON?&lat=${e.latlng.lat}&lng=${e.latlng.lng}&username=stephendoty826`)
  .then(response => response.json())
  .then(data=>{
      // console.log(data.countryName)
    
      popup
        .setLatLng(e.latlng)
        .setContent(`${data.countryName}`)
        .openOn(map)

      countryInfo(data.countryName)
  })
}

map.on('click', onMapClick);

