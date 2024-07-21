let map;
let marker;
let lat1 = 0;
let lon1 = 0;

let lat2 = 0;
let lon2 = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 0, lng: 0 },
    });

    marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        title: "ISS",
    });

    fetchISSLocation();
}

function distance(lat1,lat2, lon1, lon2){
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula 
    let dlon = lon2 - lon1; 
    let dlat = lat2 - lat1;

    let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2),2);
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
}

function fetchISSLocation() {
    $.getJSON('http://api.open-notify.org/iss-now.json', function(data) {
        let lat = parseFloat(data.iss_position.latitude);
        let lng = parseFloat(data.iss_position.longitude);

        lat1 = lat2;
        lat2 = lat;

        lon1 = lon2;
        lon2 = lng;

        time_in_hr = (5/60)/60
        
        let distance_in_km = distance(lat1, lat2, lon1, lon2);
        let speed_in_km = Math.round(distance_in_km/time_in_hr);

        document.getElementById('speed').innerHTML = String(speed_in_km).concat(" ", "km/h.")

        let latLng = new google.maps.LatLng(lat, lng);

        marker.setPosition(latLng);
        map.setCenter(latLng);

        setTimeout(fetchISSLocation, 5000);  // Refresh every 5 seconds
    });
}

function distance_from_me(){
    user_lat = parseFloat(document.getElementById('lat').value);
    user_lon = parseFloat(document.getElementById('lon').value);

    console.log(user_lat);
    console.log(user_lon);

    $.getJSON('http://api.open-notify.org/iss-now.json', function(data) {
        let lat = parseFloat(data.iss_position.latitude);
        let lng = parseFloat(data.iss_position.longitude);

        console.log(lat);
        console.log(lng);

        distance_from_user_loc = Math.round(distance(user_lat, lat, user_lon, lng));

        document.getElementById('distance').innerHTML = String(distance_from_user_loc).concat(" ", "km.")
    });    

    setTimeout(distance_from_me, 5000);
}

$(document).ready(function() {
    initMap();
});