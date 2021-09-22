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

const app = {};

app.apiEndpointListCountries = "http://api.airvisual.com/v2/countries";
app.apiEndpointListStates = "http://api.airvisual.com/v2/states";
app.apiEndpointListCities = "http://api.airvisual.com/v2/cities";
app.apiEndpointCityInfo = "http://api.airvisual.com/v2/city";
app.apiEndpointNearestCity = "http://api.airvisual.com/v2/nearest_city";

app.apiKey = "a2793ab9-eff7-4732-9994-6e2320b1f247";
// app.apiCountry = "Canada";
// app.apiState = "Ontario";
// app.apiCity = "Toronto";
// app.apiLat = 43.69309370534632;
// app.apiLon = -79.43223323783614;
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

        selectList.forEach(function(listItem){
            const selection = document.querySelector(selector) 
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
            selection.append(options);
            console.log(listItem);
        });
    });
}

app.getSelection = function(){
    
    document.querySelector('#countrySelection').addEventListener('change', function(){
        app.apiCountry = this.value;
        app.getApiData(app.apiEndpointListStates, '#stateSelection', "getStates")
    });

    document.querySelector('#stateSelection').addEventListener('change', function(){
        app.apiState = this.value;
        app.getApiData(app.apiEndpointListCities, '#citySelection', "getCities")
    });

}

app.init = function(){
    app.getApiData(app.apiEndpointListCountries, '#countrySelection', "getCountries");
    app.getSelection();
}


app.init();





// app.accessApi(url)
//     .then(function(apiObject){
//         let selectList = apiObject.data;
//         selectList.forEach(function(listItem){
//             const countrySelection = document.querySelector('#countrySelection') 
//             const options = document.createElement('option');

//             // options.innerText = listItem;
//             console.log(options);
//         });
//     })




























// const galleryApp = {}

// galleryApp.apiUrl = "https://api.unsplash.com/photos";
// galleryApp.apiKey = "24hJVNhuvMBZwTqryXAtdpqiPpvgcpO9tR4b6ZKelUo";
// // galleryApp.apiSecretKey = "v_s67e8KHCRfNAg28SknUvoxFOxmI6TZVp9YsIn9Fd0";

// galleryApp.getPhotos = function(){
//     const url = new URL(galleryApp.apiUrl);
//     url.search = new URLSearchParams({
//         client_id: galleryApp.apiKey
//         // client_idSecret: galleryApp.apiSecretKey,
//     });

//     fetch(url)
//     .then(function(response){

//         return response.json();
//     }).then(function(jsonResponse){
//         console.log(jsonResponse);
//     });
// }




// galleryApp.init = function(){
//     galleryApp.getPhotos();
// }

// galleryApp.init();










// fetch('https://www.septastats.com/api/current/system/latest')
//     .then(function(response){
//         return response.json();
//     }).then(function(jsonData){

//         // const route = jsonData.data[0].id;
//         // const startStation = jsonData.data[0].source;
//         // const endStation = jsonData.data[0].dest;
//         // const minsLate = jsonData.data[0].late;

//         // const paragraphEl = document.querySelector('p.nextDeparture');

//         // paragraphEl.innerHTML = `The ${route} train from ${startStation} to ${endStation} is running ${minsLate} minutes late.`


//         console.log(jsonData.data);
        
//         let paragraphEl = document.querySelector('p.nextDeparture');

//         for (i=0; i<jsonData.data.length; i++){

//             let trainDest2 = jsonData.data[i].dest;
//             let trainLate2 = jsonData.data[i].late;

//             console.log(`The train heading to ${trainDest2} and is ${trainLate2} minutes late`);
//         }
//     });

