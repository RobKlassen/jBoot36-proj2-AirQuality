// http://api.airvisual.com/v2/countries?

// http://api.airvisual.com/v2/states?
    // needs country

// http://api.airvisual.com/v2/cities?
    // needs state
    // needs country

// http://api.airvisual.com/v2/city?
    // needs state
    // needs country
    // needs city

// http://api.airvisual.com/v2/nearest_city?

// app.apiUrl = "http://api.airvisual.com/v2/";


// TEST SEARCH PARAMS
// app.apiCountry = "Canada";
// app.apiState = "Ontario";
// app.apiCity = "Toronto";
// app.apiLat = 43.69309370534632;
// app.apiLon = -79.43223323783614;



const app = {};

app.apiEndpointListCountries = "http://api.airvisual.com/v2/countries";
app.apiEndpointListStates = "http://api.airvisual.com/v2/states";
app.apiEndpointListCities = "http://api.airvisual.com/v2/cities";
app.apiEndpointCityInfo = "http://api.airvisual.com/v2/city";
app.apiEndpointNearestCity = "http://api.airvisual.com/v2/nearest_city";

app.apiKey = "f54d55f6-4ef0-4a18-baa0-cf8f3273a20a";

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
        else if (step =="getInfo"){
            console.log(listItem);
        }
        else{
            console.log("ERRORS ALL AROUND");
        }
        nextSelection.append(options);
    });
    nextSelection.append(defaultOption)
}

app.printInfo = function(city) {
    console.log(city.city);
    console.log(city.country);
    console.log("aqius is", city.current.pollution.aqius);
    console.log("humidity is", city.current.weather.hu);
    const header = document.querySelector('.header');
    const main = document.querySelector('.main');
    const mainSelection = document.querySelector('.main__selection');

    header.classList.add('header__animation');
    mainSelection.classList.add('main__container');
    main.classList.remove('displayNone');

    const mainUlElement = document.querySelector('.main__apiInfo ul');
    mainUlElement.innerHTML = `
    <li>${city.city}</li>
    <li>${city.country}</li>
    <li>${city.current.pollution.aqius}</li>
    <li>${city.current.weather.hu}</li>
    `
}

app.accessApi = async function(url){
    const res = await fetch(url);
    const jsonData = await res.json();
    return jsonData;
}

app.checkIfValidAPI = function(validateMe){
    console.log(validateMe);
    if (validateMe.status == "success"){
        // console.log(validateMe.data);
        return validateMe.data;
    }
    else if(validateMe.status == "fail"){
        return false;
    }
    else{console.log("HARD ERRORS");}
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


        console.log(apiObject);
        selectList = app.checkIfValidAPI(apiObject);
        // let selectList = apiObject.data;

        console.log(selectList);

        if (step == "getInfo") {
            app.printInfo(selectList);
        }
        else if(selectList == false){
//========
//========
//========
            console.log("YOU FINALLY CAUGHT THIS ERROR");
            console.log(currentDropdown);
            console.log("YOU FINALLY CAUGHT THIS ERROR");
            console.log("you finally caught this error");
//========
//========
//========
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
    app.getApiData(app.apiEndpointListCountries, '#countrySelection', "getCountries", null);
    app.clearSelection('#stateSelection');
    app.clearSelection('#citySelection');
    app.getSelection();
}

app.init();