document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelectorAll('#map').length > 0){
        if (document.querySelector('html').lang)
            lang = document.querySelector('html').lang;
        else
            lang = 'en';

        var js_file = document.createElement('script');
        js_file.type = 'text/javascript';
        js_file.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCf2EfICdl2cDVAOxXNNmHjYpB_qBLGcgY&callback=initMap&language=' + lang;
        document.getElementsByTagName('head')[0].appendChild(js_file);
    }
});

var map;
var markers = []
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.960395, lng: -83.921026},
    zoom: 10
  });
  newMarker(35.958469, -83.925152);
}

function newMarker(lat, long){
    var ptr = {lat: lat, lng: long};
    var icon = {
        url: './assets/pothole.jpg',
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
    };
    var marker = new google.maps.Marker(
        {
            position: ptr, 
            map: map,
            label: "Latitude: " + lat + ", Longitude: " + long,
            icon: icon
        }
    );
    google.maps.event.addDomListener(marker, 'click', function() {
        console.log(marker.label);
        var iw = new google.maps.InfoWindow({
            content: marker.label,
        });
        iw.open(map, marker);
    });    
    markers.push(marker);
}