const app = {};

app.apiEndpointListCountries = "https://api.airvisual.com/v2/countries";
app.apiEndpointListStates = "https://api.airvisual.com/v2/states";
app.apiEndpointListCities = "https://api.airvisual.com/v2/cities";
app.apiEndpointCityInfo = "https://api.airvisual.com/v2/city";
app.apiEndpointNearestCity = "https://api.airvisual.com/v2/nearest_city";

app.apiKey = "7dec7e98-1085-48d5-aee4-7dbbe99389a5";

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
    let cityLongitude = city.location.coordinates[0];
    let cityLatitude = city.location.coordinates[1];

    let cityName = city.city;
    let countryName = city.country;
    let cityWindDirection = city.current.weather.wd;
    let cityWindSpeed = city.current.weather.ws;
    let cityWindKMH = (cityWindSpeed * 3.6).toFixed(1); 
    let cityPollutionAQIUS = city.current.pollution.aqius;
    let cityTemperature = city.current.weather.tp;
    let cityHumidity = city.current.weather.hu;
    let cityPressure = city.current.weather.pr;

    let cityTimestampRaw = new Date (city.current.weather.ts);
    const dateFormatOptions = {
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour : 'numeric',
        minute : 'numeric'
    }
    const cityTimestamp = new Intl.DateTimeFormat("en-US", dateFormatOptions).format(cityTimestampRaw);

    let cityWeatherIcon = city.current.weather.ic;
    if (cityWeatherIcon == "03n"){
        cityWeatherIcon = "03d";
    }else if(cityWeatherIcon == "04n"){
        cityWeatherIcon = "04d";
    }else if(cityWeatherIcon == "09n"){
        cityWeatherIcon = "09d";
    }else if(cityWeatherIcon == "11n"){
        cityWeatherIcon = "11d";
    }else if(cityWeatherIcon == "13n"){
        cityWeatherIcon = "13d";
    }else if(cityWeatherIcon == "50n" ){
        cityWeatherIcon = "50d";
    }

    const header = document.querySelector('.header');
    const main = document.querySelector('.main');
    const mainSelection = document.querySelector('.main__selection');

    mainSelection.classList.add('main__container');
    main.classList.remove('displayNone');
    main.scrollIntoView();

    const mainUlElement = document.querySelector('.main__apiInfo ul');

    console.log(cityWeatherIcon);

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
    
    <h3>WEATHER</h3>
    <div class="weather__container">
        
        <div class="weatherBox">
            <img src="${'https://airvisual.com/images/'+cityWeatherIcon+".png"}" alt="weather icon" class="weatherIcon">
            <p><i class="fas fa-long-arrow-alt-down windDirection1"></i> ${cityWindKMH}<span> km/h</span></p>
            <li>${cityTimestamp}</li>
        </div>

        <div className="weatherText">
            <li>Current temperature is: ${cityTemperature}°C</li>
            <li>Current humidity is: ${cityHumidity}%</li>
            <li>Current Barometric Atmospheric Pressure is: ${cityPressure}hPa</li>
        </div>
    </div>
 
    `;

    const windDirectionElement = document.querySelector('.windDirection1');
    windDirectionElement.style.transform = `rotate(${cityWindDirection}deg)`;
    

    const movePollutionBar = function(){
        for (let i = 0; i < cityPollutionAQIUS+1; i++) {
            
            setTimeout(() => {
                let progressBar = document.querySelector('.pollutionBar');
                progressBar.style.left = (i/3)+"%";

                if (cityPollutionAQIUS > 100){
                    progressBar.style.transition = "ease all .05s";
                } else if (cityPollutionAQIUS < 100 && cityPollutionAQIUS > 50) {
                    progressBar.style.transition = "ease all 1s";
                } else if (cityPollutionAQIUS < 50) {
                    progressBar.style.transition = "ease all 3s";
                }
                
            }, 10 * i);
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
        const defaultOption = document.createElement('option');
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
