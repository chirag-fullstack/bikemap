// JS file to create a map using leaflet.js (https://leafletjs.com/index.html)

// Global variable to hold the plotted map
var lMap;
function createMap(latlongs) {
    // function to create a map and plot the path using latlongs Array

    if (lMap) {
        // remove any existing maps
        lMap.remove();
    }

    lMap = L.map('L-map').setView([51.505, -0.09], 15);

    // street view tile for the map
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={access_token}', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        access_token: MAPBOX_ACCESS_TOKEN,
        tileSize: 512,
        zoomOffset: -1
    }).addTo(lMap);

    // Add markers for the starting and ending points of paths
    for(let i=0; i < latlongs.length; i++) {
        L.marker(latlongs[i][0]).addTo(lMap)
            .bindPopup("<b>Start Point!</b>").openPopup();
        L.marker(latlongs[i][latlongs[i].length - 1]).addTo(lMap)
            .bindPopup("<b>End Point!</b>").openPopup();
    }

    // draw a path using polyline api on created map
    polyline = L.polyline(latlongs, {color: 'blue'}).addTo(lMap);
    lMap.fitBounds(polyline.getBounds()); // fit path in map view
}
