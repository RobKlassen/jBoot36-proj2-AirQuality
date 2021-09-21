const app = {};

app.apiUrl = "http://api.airvisual.com/v2/nearest_city";
app.apiKey = "a2793ab9-eff7-4732-9994-6e2320b1f247";

app.getApiData = function(){
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        key: app.apiKey
        ,
        lat: 43.196
        ,
        lon: -79.222
        ,
        country: null
        ,
        state: null
        ,
        city: null
        ,
        lat: null
        ,
        lon: null
        // 'x-forwarded-for': , 
        //   IP FORWARDING
    });

    fetch(url)
    .then(function(response){
        console.log(response);
        return response.json();
    }).then(function(jsonResponse){
        console.log(jsonResponse);
        console.log(jsonResponse.data.current.pollution.aqicn);
    });
}

app.init = function(){
    app.getApiData();
}

app.init();































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

