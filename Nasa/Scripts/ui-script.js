(function ($) {
    $(function () {
        //Save reference to every polygon
        var polygons = {
            solar: [],
            wind: [],
            geothermal: []
        };

        var state = {
            solar: false,
            wind: false,
            geothermal: false
        };

        var intensityColor = [
            "",
            "#FF0000",
            "#FF2000",
            "#FF4000",
            "#FF6000",
            "#FF8000",
            "#FFA000",
            "#FFC000",
            "#FFE000",
            "#FFFF00",
            "#FFFF80"
        ];

        var energyType = [
            "solar",
            "wind",
            "geothermal"
        ];

        var callbacks = {
            polygonClick: function (event) {
                var kb = Number(event.latLng.kb).toFixed(2),
                    jb = Number(event.latLng.jb).toFixed(2);

                $("#details-latiude").html(kb);
                $("#details-longtitude").html(jb);

                var element = $("#popup");
                element.css({
                    top: event.Sa.pageY,
                    left: event.Sa.pageX
                });
                element.show();
            },
            navigationClick: function () {
                var type = this.id;
                var typeLower = type.toLowerCase();
                if (state[typeLower]) {
                    //Clear
                    mapLoader.detachPolygon(typeLower);

                    //Change state
                    state[typeLower] = false;

                    //Visualization
                    $("img", this)[0].src = "/Images/" + typeLower + "Off.png";
                } else {
                    //Change state
                    state[typeLower] = true;

                    //Fetch data
                    var typeUpper = type.toUpperCase();
                    mapLoader.loadPolygons(typeUpper);

                    //Visualization
                    $("img", this)[0].src = "/Images/" + typeLower + "On.gif";
                }
            },
            codeAddress: function () {
                var address = document.getElementById('position').value;
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        map.fitBounds(results[0].geometry.viewport);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        };

        var mapLoader = {
            loadPolygons: function (type) {
                $.getJSON("/Administration/Data/GetPolygon", {
                    "type": type
                }, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var path = mapLoader.buildPath(data[i].Points);
                        var polygon = mapLoader.buildPolygons(path, data[i].Rate, data[i].Id, data[i].Type);

                        polygon.setMap(map);
                    }
                });
            },
            buildPath: function (points) {
                var coordsList = [];
                for (var i = 0; i < points.length; i++) {
                    coordsList.push(new google.maps.LatLng(points[i].latitude, points[i].longitude));
                }
                return coordsList;
            },
            buildPolygons: function (path, rate, id, type) {
                type = energyType[type];

                var polygon = new google.maps.Polygon({
                    paths: path,
                    strokeWeight: 0,
                    fillColor: intensityColor[rate],
                    fillOpacity: 0.3,
                    zIndex: rate
                });

                polygon.id = id;
                polygon.type = type;
                polygon.rate = rate;
                google.maps.event.addListener(polygon, "click", callbacks.polygonClick);

                //Push for delete
                polygons[type].push(polygon);

                return polygon;
            },
            buildMap: function (id) {
                var mapOptions = {
                    zoom: 2,
                    center: new google.maps.LatLng(0, 20),
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

                var canvas = document.getElementById(id);
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.style.position = "absolute";
                canvas.style.top = 0;

                var map = new google.maps.Map(canvas, mapOptions);
                return map;
            },
            detachPolygon: function (type) {
                var currentType = polygons[type];
                for (var i = 0; i < currentType.length; i++) {
                    currentType[i].setMap(null);
                }
                //Clear array
                currentType = [];
            }
        };

        //GLOBAL MAP
        var map = mapLoader.buildMap("map-canvas");
        //GLOBAL geocoder
        var geocoder = new google.maps.Geocoder();




        var infowindow = new google.maps.InfoWindow({
            content: "Some story from database"
        });

        
        function createMarker(latitude, longtitude, imagePath, story) {
            var iconLibrary = '../images/markers';
            var myLatLng = new google.maps.LatLng(latitude, longtitude);
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: iconLibrary + imagePath,
                title: story
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }

        createMarker(43.16, 23.57, '/solarMarker.png', 'Title (tooltip)');
        createMarker(43.99, 27.27, '/windMarker.png', 'Title (tooltip)');
        createMarker(42.04, 24.30, '/geothermalMarker.png', 'Title (tooltip)');


        //Attach events
        function menuAttacher(ids) {
            for (var i = 0; i < ids.length; i++) {
                $(document.getElementById(ids[i])).click(callbacks.navigationClick);
            }
        }
        menuAttacher(["solar", "wind", "geothermal"]);

        //Evlogi's work
        $("#position").bind("change", callbacks.codeAddress);

        //display: none for popup menu on click/drag/scroll
        function mapHandler(map, events) {
            for (var i = 0; i < events.length; i++) {
                google.maps.event.addListener(map, events[i], function (e) {
                    $("#popup").hide();
                });
            }
        }
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
    });
}(jQuery));