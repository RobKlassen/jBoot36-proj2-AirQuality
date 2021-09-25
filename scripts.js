const app = {};

app.apiEndpointListCountries = "http://api.airvisual.com/v2/countries";
app.apiEndpointListStates = "http://api.airvisual.com/v2/states";
app.apiEndpointListCities = "http://api.airvisual.com/v2/cities";
app.apiEndpointCityInfo = "http://api.airvisual.com/v2/city";
app.apiEndpointNearestCity = "http://api.airvisual.com/v2/nearest_city";

app.apiKey = "a2793ab9-eff7-4732-9994-6e2320b1f247";

app.apiCountry = null;
app.apiState = null;
app.apiCity = null;
app.apiLat = null;
app.apiLon = null;

const countrySelector = document.querySelector('#countrySelection');
const stateSelector = document.querySelector('#stateSelection');
const citySelector = document.querySelector('#citySelection');

app.createDropdown = function(selectList, defaultOption, nextSelection, step){
    selectList.forEach(function(listItem){
        nextSelection.disabled = false;
        const options = document.createElement('option');

        if (step == "getCountries"){
            options.innerText = listItem.country;
            options.value = listItem.country;
        }
        else if (step == "getStates"){
            options.innerText = listItem.state;
            options.value = listItem.state;
        }
        else if (step == "getCities"){
            options.innerText = listItem.city;
            options.value = listItem.city;
        }
        else{
            console.log("ERRORS ALL AROUND");
        }
        nextSelection.append(options);
    });
    nextSelection.append(defaultOption)
}

app.printInfo = function(city) {
    let cityName = city.city;
    let countryName = city.country;
    let cityWindDirection = city.current.weather.wd;
    let cityWindSpeed = city.current.weather.ws;
    let cityWindKMH = (cityWindSpeed * 3.6).toFixed(1); 
    let cityPollutionAQIUS = city.current.pollution.aqius;
    let cityTemperature = city.current.weather.tp;
    let cityHumidity = city.current.weather.hu;
    let cityPressure = city.current.weather.pr;
    let cityTimestamp = city.current.weather.ts;
    let cityLongitude = city.location.coordinates[0];
    let cityLatitude = city.location.coordinates[1];
    let cityWeatherIcon = city.current.weather.ic;

    const header = document.querySelector('.header');
    const main = document.querySelector('.main');
    const mainSelection = document.querySelector('.main__selection');

    mainSelection.classList.add('main__container');
    main.classList.remove('displayNone');
    main.scrollIntoView();

    const mainUlElement = document.querySelector('.main__apiInfo ul');

    mainUlElement.innerHTML = 

    `
    <h2>${cityName}, ${countryName}</h2>
    
    <li>Current AQIUS Pollution Index is: ${cityPollutionAQIUS}</li>
    <div class="aqi">
        <li class="aqi__bar">
            <span>Very Good</span>
            <span class="pollutionBar" style="left: 0%"></span>
            <span>Very Bad</span>
        </li>
    </div>
    
    <li>WEATHER</li>

    <div class="weatherBox">
    <img src="${'https://airvisual.com/images/'+cityWeatherIcon+".png"}" alt="weather icon" class="weatherIcon">
    <p><i class="fas fa-long-arrow-alt-down windDirection1"></i> ${cityWindKMH}<span> km/h</span></p>
    </div>

    <li>Weather information from: ${cityTimestamp}</li>
    <li>Current temperature is: ${cityTemperature}°C</li>
    <li>Current humidity is: ${cityHumidity}%</li>
    <li>Current Barometric Atmospheric Pressure is: ${cityPressure}hPa</li>
 
    `;

    const windDirectionElement = document.querySelector('.windDirection1');
    windDirectionElement.style.transform = `rotate(${cityWindDirection}deg)`;
    

    const movePollutionBar = function(){
        for (let i = 0; i < cityPollutionAQIUS+1; i++) {
            moveBar(i)
        }
        function moveBar(i) {
            setTimeout(() => {
                let progressBar = document.querySelector('.pollutionBar');
                progressBar.style.left = (i/2)+"%";
                progressBar.style.transition = "ease all 0.15s";
                let aqiLevel = 0;
                return (aqiLevel + i)
            }, 25 * i);
        }
    }
    movePollutionBar();
}

app.checkIfValidAPI = function(validateMe){
    console.log(validateMe);
    if (validateMe.status == "success"){
        return validateMe.data;
    }
    else if(validateMe.status == "fail"){
        return false;
    }
    else{console.log("HARD ERRORS");}
}

app.accessApi = async function(url){
    const res = await fetch(url);
    const jsonData = await res.json();
    return jsonData;
}

app.getApiData = async function(endpoint, nextSelectorID, step, currentDropdown){
    const url = new URL(endpoint);
    url.search = new URLSearchParams({
        key: app.apiKey,
        country: app.apiCountry,
        state: app.apiState,
        city: app.apiCity,
        lat: app.apiLat,
        lon: app.apiLon
    });

    app.accessApi(url)
    .then(function(apiObject){

        const nextSelection = document.querySelector(nextSelectorID);
        const defaultOption = document.createElement('option')
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.defaultSelected = true;
        defaultOption.hidden = true;
        defaultOption.text = "please select from dropdown";

        const selectList = app.checkIfValidAPI(apiObject);

        if (step == "getInfo") {
            app.printInfo(selectList);
        }
        else if (step == "getNearest") {
            app.printInfo(selectList);
        }
        else if(selectList == false){
            defaultOption.text = "No entries found";
            currentDropdown.append(defaultOption);
        }
        else { 
            app.createDropdown(selectList, defaultOption, nextSelection, step);   
        }
    })
}

app.clearSelection = function(elementToSelect){
    const dropdown = document.querySelector(elementToSelect)
    dropdown.disabled = true;
    while (dropdown.hasChildNodes()) {  
        dropdown.removeChild(dropdown.firstChild);
    }
}

app.getSelection = function(){

    countrySelector.addEventListener('change', function(){
        app.apiCountry = this.value;
        app.getApiData(app.apiEndpointListStates, '#stateSelection', "getStates", countrySelector)
        app.clearSelection('#stateSelection');
        app.clearSelection('#citySelection');
    });

    stateSelector.addEventListener('change', function(){
        app.apiState = this.value;
        app.getApiData(app.apiEndpointListCities, '#citySelection', "getCities", stateSelector);
        app.clearSelection('#citySelection');
    });

    citySelector.addEventListener('change', function(){
        app.apiCity = this.value;
        app.getApiData(app.apiEndpointCityInfo, null, "getInfo", citySelector)
    });
}

app.init = function(){   
    app.getApiData(app.apiEndpointNearestCity, null, "getNearest", null);
    app.getApiData(app.apiEndpointListCountries, '#countrySelection', "getCountries", null);
    app.clearSelection('#stateSelection');
    app.clearSelection('#citySelection');
    app.getSelection();
}

app.init();
