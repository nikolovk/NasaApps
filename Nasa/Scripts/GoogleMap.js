function loadPolygons(type) {
    $.getJSON("/Administration/Data/GetPolygon", {
        "type": type
    }, function (data) {
        $.each(data, function (key, value) {
            var path = buildCoords(value.Points);
            var type;
            switch (value.Type) {
                case 0:
                    type = "Solar";
                    break;
                case 1:
                    type = "Wind";
                    break;
                case 2:
                    type = "Geothermal";
                    break;
                default:
                    type = "Solar";
                    break;
            }
            //TODO
            //Polygon color should be choose by value.Rate and value.Type
            //should nave scale of colors
            var color = "#FF0000";
            var polygon = new google.maps.Polygon({
                paths: path,
                //strokeColor: "#FF0000",
                //strokeOpacity: 0.8,
                //strokeWeight: 0,
                fillColor: color,
                fillOpacity: 0.35
            });
            polygon.Type = type;
            polygon.Rate = value.Rate;
            mouseClickHandler(polygon); // Do we need to add to every polygon? can be global?
            polygon.setMap(map);
        });
    });
}

//Function to build polygon list
function buildCoords(points) {
    var coordsList = [];
    for (var i = 0; i < points.length; i++) {
        coordsList.push(new google.maps.LatLng(points[i].latitude, points[i].longitude));
    }
    return coordsList;
}

//Initialize Google maps
var map;
var geocoder;
function initialize() {
    //geocoder = new google.maps.Geocoder();
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(-25.397, 120.644),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        streetViewControl: false,
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var image = '../images/beachflag.png';
    var myLatLng = new google.maps.LatLng(-33.890542, 151.274856);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });

    //display: none for popup menu on click/drag
    mapHandler(map, ["click", "drag", "zoom_changed"]);

    //button Additional Information event
    $('#button-details').bind('click', function () {
        $('#layer').fadeIn(200);
        $('#additional-information').show();
        $('#popup').hide();
    });

    //PopUpMenu button close event
    $('#button-close').bind('click', function () {
        $('#popup').hide();
    });

    //event for hiding the details information window
    $('#layer').click(function () {
        $(this).fadeOut(200);
    });
}

//methods to zoomin to the country selected
function codeAddress() {
    var address = document.getElementById('position').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            var ne = results[0].geometry.viewport.getNorthEast();
            var sw = results[0].geometry.viewport.getSouthWest();
            map.fitBounds(results[0].geometry.viewport);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//Add Handler on mouse click
function mouseClickHandler(polygon) {
    google.maps.event.addListener(polygon, "click", function (event) {

        $("#details-latiude").html(Number(event.latLng.kb).toFixed(2));
        $("#details-longtitude").html(Number(event.latLng.jb).toFixed(2));

        console.log(this.specialId);
        var element = $("#popup");
        element.css({
            top: event.Sa.pageY,
            left: event.Sa.pageX
        });
        element.show();
    });
}


function mapHandler(map, events) {
    for (var i = 0; i < events.length; i++) {
        google.maps.event.addListener(map, events[i], function (e) {
            $("#popup").hide();
        });
    }
}

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCUfc-_3HKYKOq66wpHsgUr-mJ5hcQaTzs&sensor=false&callback=initialize";
    document.body.appendChild(script);
}

window.onload = loadScript;

function coordinate(x, y) {
    this.x = x;
    this.y = y;
}

