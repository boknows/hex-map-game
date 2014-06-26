


        $(function() {

            var map;

            var hexagons = new Array();
            var hexagonsIndexed = new Array();

            var hex;

            var startlat = 71.0;
            var startLon = -10.0;
            var levelOfDetail = 10;

            var selectedHex;
            //var hoverHex;
            var tiles;

            function createHexagon(offset, hex, u, v) {

                var center = hex.getPixelCoordinates(u, v);

                var point1 = { x: (center.x - hex.b / 2.0) + offset.x, y: center.y + offset.y };
                var point2 = { x: (center.x - hex.s / 2.0) + offset.x, y: (center.y - hex.a / 2.0) + offset.y };
                var point3 = { x: (center.x + hex.s / 2.0) + offset.x, y: (center.y - hex.a / 2.0) + offset.y };
                var point4 = { x: (center.x + hex.b / 2.0) + offset.x, y: center.y + offset.y };
                var point5 = { x: (center.x + hex.s / 2.0) + offset.x, y: (center.y + hex.a / 2.0) + offset.y };
                var point6 = { x: (center.x - hex.s / 2.0) + offset.x, y: (center.y + hex.a / 2.0) + offset.y };
                var point7 = { x: (center.x - hex.b / 2.0) + offset.x, y: center.y + offset.y };

                var coordinate1 = PixelXYToLatLong(point1.x, point1.y, 10);
                var coordinate2 = PixelXYToLatLong(point2.x, point2.y, 10);
                var coordinate3 = PixelXYToLatLong(point3.x, point3.y, 10);
                var coordinate4 = PixelXYToLatLong(point4.x, point4.y, 10);
                var coordinate5 = PixelXYToLatLong(point5.x, point5.y, 10);
                var coordinate6 = PixelXYToLatLong(point6.x, point6.y, 10);
                var coordinate7 = PixelXYToLatLong(point7.x, point7.y, 10);

                return {
                    center: PixelXYToLatLong(center.x + offset.x, center.y + offset.y, 10),
                    coordinates: [coordinate1, coordinate2, coordinate3, coordinate4, coordinate5, coordinate6, coordinate7],
                    selected: false
                };
            }


            loadHexagons = function() {


                var levelOfDetail = 10;

                var sizeInMeters = 50000.0;

                var rows = 30;
                var columns = 30;

                var offset = LatLongToPixelXY(startlat, startLon, levelOfDetail);

                var size = sizeInMeters / GroundResolution(startlat, levelOfDetail);

                hex = new hexDefinition(size);

                for (var i = 0; i < columns; i++) {
                    for (var j = Math.round(0 - (i / 2)); j < Math.round(rows - (i / 2)); j++) {

                        var hexagon = createHexagon(offset, hex, i, j);

                        hexagons.push(hexagon);
                        hexagonsIndexed['' + i + ',' + j] = hexagon;
                    }
                }

                tiles = new L.TileLayer.Canvas();

                tiles.drawTile = function(canvas, tile, zoom) {

                    var context = canvas.getContext('2d');

                    var tileSize = this.options.tileSize;

                    for (var i = 0; i < hexagons.length; i++) {
                        var point = new L.LatLng(hexagons[i].center.lat, hexagons[i].center.lng);

                        var point1 = hexagons[i].coordinates[0];
                        var point2 = hexagons[i].coordinates[1];
                        var point3 = hexagons[i].coordinates[2];
                        var point4 = hexagons[i].coordinates[3];
                        var point5 = hexagons[i].coordinates[4];
                        var point6 = hexagons[i].coordinates[5];
                        var point7 = hexagons[i].coordinates[6];

                        var p1 = LatLongToPixelXY(point1.lat, point1.lng, zoom);
                        var p2 = LatLongToPixelXY(point2.lat, point2.lng, zoom);
                        var p3 = LatLongToPixelXY(point3.lat, point3.lng, zoom);
                        var p4 = LatLongToPixelXY(point4.lat, point4.lng, zoom);
                        var p5 = LatLongToPixelXY(point5.lat, point5.lng, zoom);
                        var p6 = LatLongToPixelXY(point6.lat, point6.lng, zoom);
                        var p7 = LatLongToPixelXY(point7.lat, point7.lng, zoom);

                        var start = tile.multiplyBy(tileSize);
                        context.moveTo(Math.round(p1.x - start.x), Math.round(p1.y - start.y));
                        context.lineTo(Math.round(p2.x - start.x), Math.round(p2.y - start.y));
                        context.lineTo(Math.round(p3.x - start.x), Math.round(p3.y - start.y));
                        context.lineTo(Math.round(p4.x - start.x), Math.round(p4.y - start.y));
                        context.lineTo(Math.round(p5.x - start.x), Math.round(p5.y - start.y));
                        context.lineTo(Math.round(p6.x - start.x), Math.round(p6.y - start.y));
                        context.lineTo(Math.round(p7.x - start.x), Math.round(p7.y - start.y));

                    }

                    context.fillStyle = "rgba(190, 190, 190, 0.25)";
                    context.fill();

                    if (zoom >= 5) {
                        context.lineWidth = zoom;
                        context.lineJoin = "round";
                        context.strokeStyle = "rgba(255, 255, 255, 0.7)";
                        context.stroke();
                    }

                    context.lineWidth = zoom / 10;
                    context.lineJoin = "round";
                    context.strokeStyle = "#111";

                    context.stroke();
                }

                map.on('click', function(e) {

                    var offset = LatLongToPixelXY(startlat, startLon, levelOfDetail);
                    var result = LatLongToPixelXY(e.latlng.lat, e.latlng.lng, levelOfDetail);

                    result.x = result.x - offset.x;
                    result.y = result.y - offset.y;

                    var uv = hex.getReferencePoint(result.x, result.y);

                    var hexagon = hexagonsIndexed['' + uv.u + ',' + uv.v];


                    if (selectedHex != undefined) {
                        map.removeLayer(selectedHex);
                    }

                    selectedHex = new L.Polygon(hexagon.coordinates);
                    map.addLayer(selectedHex);

                });

                map.addLayer(tiles);

            };


            map = new L.Map('map');

            var tileLayerUrl = 'Images/Tiles/WorldMap/1.0.0/WorldMap/{z}/{x}/{y}.png';
            var tileLayer = new L.TileLayer(tileLayerUrl, { maxZoom: 18 });

            map.addLayer(tileLayer);

            map.setView(new L.LatLng(45, 10), 5);

            loadHexagons();


        });