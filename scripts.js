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

app.apiKey = "a2793ab9-eff7-4732-9994-6e2320b1f247";

app.apiCountry = null;
app.apiState = null;
app.apiCity = null;
app.apiLat = null;
app.apiLon = null;

app.accessApi = async function(url){
    const res = await fetch(url);
    const jsonData = await res.json();
    return jsonData;
}

app.getApiData = async function(endpoint, selector, step){
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

        let selectList = apiObject.data;

        const nextSelection = document.querySelector(selector);
        const defaultOption = document.createElement('option')
        defaultOption.selected = true;
        defaultOption.disabled = true;
        defaultOption.defaultSelected = true;
        defaultOption.hidden = true;
        defaultOption.text = "please select from dropdown";

        if (step == "getInfo") {
            console.log(selectList);
            console.log(selectList.city);
            console.log(selectList.country);
            console.log("aqius is", selectList.current.pollution.aqius);
            console.log("humidity is", selectList.current.weather.hu);
        }
//<option selected disabled>Choose here</option>

        else {   
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
            console.log("here we are");
            nextSelection.append(defaultOption)
        }
    });
}

app.clearSelection = function(elementToSelect){
    const dropdown = document.querySelector(elementToSelect)
    dropdown.disabled = true;
    while (dropdown.hasChildNodes()) {  
        dropdown.removeChild(dropdown.firstChild);
    }
}

app.getSelection = function(){
    
    document.querySelector('#countrySelection').addEventListener('change', function(){
        app.apiCountry = this.value;
        app.getApiData(app.apiEndpointListStates, '#stateSelection', "getStates")
        app.clearSelection('#stateSelection');
        app.clearSelection('#citySelection');
    });

    document.querySelector('#stateSelection').addEventListener('change', function(){
        app.apiState = this.value;
        app.getApiData(app.apiEndpointListCities, '#citySelection', "getCities");
        app.clearSelection('#citySelection');
    });

    document.querySelector('#citySelection').addEventListener('change', function(){
        app.apiCity = this.value;
        app.getApiData(app.apiEndpointCityInfo, null, "getInfo");
    });

}

app.init = function(){
    app.getApiData(app.apiEndpointListCountries, '#countrySelection', "getCountries");
    app.clearSelection('#stateSelection');
    app.clearSelection('#citySelection');
    app.getSelection();
}


app.init();