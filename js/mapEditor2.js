// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
var Map = function() {
    var mapData;
    this.data = null;
    this.attack = {
        attX: null,
        attY: null,
        defX: null,
        defY: null
    };
    this.selected = {
        col: null,
        row: null,
        nCol: null,
        nRow: null
    };
    this.editMap = {
        col: null,
        row: null,
    };
    this.unitPlacement = [];
    this.clickState = null;
    this.neighbors = [];
    this.username = $('#username').val();
    this.email = $('#email').val();
    this.unitCnt = 0;
    this.unitsToBePlaced = 0;
    this.ctx = null;
    this.canvas = null;
    this.getData = function(callback) {
        $.ajax({
            url: "getMapEditor.php",
            type: "POST",
            dataType: 'JSON',
            data: {},
        }).success(callback);
    };
};

function updateMap(data, param) {
    data.param = param;
    $.ajax({
        url: "getMap.php",
        data: data,
        type: "POST",
        dataType: 'JSON'
    });
};
var map = new Map();
map.getData(function(map_data) {
    map.data = new Array(40);
    for (var i = 0; i < map.data.length; i++) {
        map.data[i] = new Array(40);
    }
    for (var i = 0; i < map.data.length; i++) {
        for (var j = 0; j < map.data[i].length; j++) {
            map.data[i][j] = {
                "type": "water",
                "units": 0,
                "n": "",
                "s": "",
                "nw": "",
                "ne": "",
                "sw": "",
                "se": "",
                "owner": "",
                "color": "",
                "connect": "",
                "group": "",
            };
        }
    }
    map.dataProp = {
        "owners": [],
        "colors": [],
        "turn": 0,
        "turnPhase": "fortify",
        "fortifies": 6,
        "rows": parseInt($('#rows').val()),
        "cols": parseInt($('#cols').val()),
    };
    console.log(map.data);
    var hexagonGrid = new HexagonGrid("HexCanvas", 20);
    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 300, 10, true);

    //UI Buttons
    var updateRowsCols = document.getElementById('updateRowCols');
    updateRowsCols.addEventListener('click', function(e) { //For the map editor
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.dataProp = {
            "owners": [],
            "colors": [],
            "turn": 0,
            "turnPhase": "fortify",
            "fortifies": 6,
            "rows": parseInt($('#rows').val()),
            "cols": parseInt($('#cols').val()),
        };

        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 300, 10, true);
    }, false);

    var updateMapBtn = document.getElementById('updateMap');
    updateMapBtn.addEventListener('click', function(e) { //For the map editor
        var cube = toCubeCoord(map.editMap.col, map.editMap.row);
        console.log(cube);
        map.data[map.editMap.row][map.editMap.col].type = $('#type').val();
        map.data[map.editMap.row][map.editMap.col].owner = $('#owner').val();
        map.data[map.editMap.row][map.editMap.col].units = $('#unitsEdit').val();
        map.data[map.editMap.row][map.editMap.col].color = $('#color').val();
        map.data[map.editMap.row][map.editMap.col].group = $('#group').val();
        map.data[map.editMap.row][map.editMap.col].connect = JSON.parse($('#connect').val());
        if ($('#n').val() != "") {
            if ($('#n').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].n = "";
                var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                map.data[offset.r][offset.q].s = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
                var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                map.data[offset.r][offset.q].s = $('#n').val();
            }
        }
        if ($('#ne').val() != "") {
            if ($('#ne').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].ne = "";
                var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                map.data[offset.r][offset.q].sw = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
                var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                map.data[offset.r][offset.q].sw = $('#ne').val();
            }
        }
        if ($('#se').val() != "") {
            if ($('#se').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].se = "";
                var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                map.data[offset.r][offset.q].nw = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
                var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                map.data[offset.r][offset.q].nw = $('#se').val();
            }
        }
        if ($('#s').val() != "") {
            if ($('#s').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].s = "";
                var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                map.data[offset.r][offset.q].n = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
                var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                map.data[offset.r][offset.q].n = $('#s').val();
            }
        }
        if ($('#sw').val() != "") {
            if ($('#sw').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].sw = "";
                var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                map.data[offset.r][offset.q].ne = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
                var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                map.data[offset.r][offset.q].ne = $('#sw').val();
            }
        }
        if ($('#nw').val() != "") {
            if ($('#nw').val() == "None") {
                map.data[map.editMap.row][map.editMap.col].nw = "";
                var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                map.data[offset.r][offset.q].se = "";
            } else {
                map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
                var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                map.data[offset.r][offset.q].se = $('#nw').val();
            }
        }
        var data = {
            data: JSON.stringify(map.data)
        };
        updateMap(data, "updateMap");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);

    }, false);

    var saveMap = document.getElementById('saveMap');
    saveMap.addEventListener('click', function(e) { //For the map editor
        console.log(JSON.stringify(map.data));
        console.log(JSON.stringify(map.dataProp));
    }, false);

    $('body').keydown(function(e) {
        var cube = toCubeCoord(map.editMap.col, map.editMap.row);
        console.log(e.keyCode);
        if (e.keyCode == 103) {
            $('#nw').val("#000000");
            map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
            var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
            map.data[offset.r][offset.q].se = $('#nw').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
        if (e.keyCode == 97) {
            $('#sw').val("#000000");
            map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
            var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
            map.data[offset.r][offset.q].ne = $('#sw').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
        if (e.keyCode == 98) {
            $('#s').val("#000000");
            map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
            var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
            map.data[offset.r][offset.q].n = $('#s').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
        if (e.keyCode == 99) {
            $('#se').val("#000000");
            map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
            var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
            map.data[offset.r][offset.q].nw = $('#se').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
        if (e.keyCode == 105) {
            $('#ne').val("#000000");
            map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
            var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
            map.data[offset.r][offset.q].sw = $('#ne').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
        if (e.keyCode == 104) {
            $('#n').val("#000000");
            map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
            var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
            map.data[offset.r][offset.q].s = $('#n').val();
            var data = {
                data: JSON.stringify(map.data)
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
    });
});

function HexagonGrid(canvasId, radius) {
    this.radius = radius;
    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    this.context = map.ctx;
    this.canvas = map.canvas;
    this.canvasOriginX = 300;
    this.canvasOriginY = 10;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};

HexagonGrid.prototype.clickEvent = function(e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;
    var tile = this.getSelectedTile(localX, localY);
    map.editMap = {
        row: tile.row,
        col: tile.column
    };
    if (map.data[tile.row][tile.column].type == "water") {
        map.data[tile.row][tile.column].type = "land";
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        this.drawHexGrid(map.dataProp.rows, map.dataProp.cols, this.canvasOriginX, this.canvasOriginY, true);
    }

    console.log(tile);
    //populate hex data to form for map editing
    $('#type').val(map.data[tile.row][tile.column].type);
    if (map.data[tile.row][tile.column].n == "") {
        $('#n').val("None");
    } else {
        $('#n').val(map.data[tile.row][tile.column].n);
    }

    if (map.data[tile.row][tile.column].ne == "") {
        $('#ne').val("None");
    } else {
        $('#ne').val(map.data[tile.row][tile.column].ne);
    }

    if (map.data[tile.row][tile.column].nw == "") {
        $('#nw').val("None");
    } else {
        $('#nw').val(map.data[tile.row][tile.column].nw);
    }

    if (map.data[tile.row][tile.column].s == "") {
        $('#s').val("None");
    } else {
        $('#s').val(map.data[tile.row][tile.coswlumn].s);
    }

    if (map.data[tile.row][tile.column].se == "") {
        $('#se').val("None");
    } else {
        $('#se').val(map.data[tile.row][tile.column].se);
    }

    if (map.data[tile.row][tile.column].sw == "") {
        $('#sw').val("None");
    } else {
        $('#sw').val(map.data[tile.row][tile.column].sw);
    }

    $('#connect').val(JSON.stringify(map.data[tile.row][tile.column].connect));
    $('#group').val(map.data[tile.row][tile.column].group);
    $('#column').val(tile.column);
    $('#row').val(tile.row);

};

HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText, highlight, highlightColor, owner) {
    this.context.font = "bold 12px Helvetica";
    this.owner = owner;

    this.context.lineWidth = 1;
    this.context.lineCap = 'round';

    var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
    if (tile.row < 3) {
        //console.log(tile.row, tile.column, x0, this.width, this.side, y0)
    }
    var numberOfSides = 6,
        size = this.radius,
        Xcenter = x0 + (this.width / 2),
        Ycenter = y0 + (this.height / 2);
    this.context.beginPath();
    this.context.strokeStyle = "#000000";
    this.context.lineWidth = 1;
    this.context.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
    for (var i = 1; i <= numberOfSides; i += 1) {
        this.context.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }

    this.context.fillStyle = fillColor;


    if (highlight == true) {
        this.context.fillStyle = highlightColor;
        this.context.globalAlpha = 0.65;
    }
    this.context.fill();
    this.context.closePath();
    this.context.stroke();
    this.context.globalAlpha = 1;
};

HexagonGrid.prototype.drawHexBorders = function(x0, y0) {
    var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
    if (map.data[tile.row][tile.column].s != "") {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].s;
        this.context.moveTo(x0 + this.side, y0 + this.height);
        this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
        this.context.stroke();
    }
    if (map.data[tile.row][tile.column].n != "") {

        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].n;
        this.context.moveTo(x0 + this.side, y0);
        this.context.lineTo(x0 + this.width - this.side, y0);
        this.context.stroke();
    }
    if (map.data[tile.row][tile.column].ne != "") {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].ne;
        this.context.moveTo(x0 + this.side, y0);
        this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
        this.context.stroke();
    }
    if (map.data[tile.row][tile.column].se != "") {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].se;
        this.context.moveTo(x0 + this.width, y0 + (this.height / 2));
        this.context.lineTo(x0 + this.side, y0 + this.height);
        this.context.stroke();
    }
    if (map.data[tile.row][tile.column].sw != "") {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].sw;
        this.context.moveTo(x0 + this.width - this.side, y0 + this.height);
        this.context.lineTo(x0, y0 + (this.height / 2));
        this.context.stroke();
    }
    if (map.data[tile.row][tile.column].nw != "") {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = map.data[tile.row][tile.column].nw;
        this.context.moveTo(x0, y0 + (this.height / 2));
        this.context.lineTo(x0 + this.width - this.side, y0);
        this.context.stroke();
    }
};

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
    var x = 0,
        y = 0;
    var layoutElement = this.canvas;
    var bound = layoutElement.getBoundingClientRect();
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);

        return {
            x: bound.left,
            y: bound.top
        };
    }
}

HexagonGrid.prototype.drawHexGrid = function(rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;
    this.rows = rows;
    this.cols = cols;
    var currentHexX;
    var currentHexY;
    var debugText = "";
    var offsetColumn = false;
    var hexNum = 1;
    for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows; row++) {
            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }
            if (isDebug) {
                debugText = hexNum;
                hexNum++;
            }
            if (map.data[row][col].type == "land") {
                this.drawHex(currentHexX, currentHexY, "#99CC66", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "water") {
                this.drawHex(currentHexX, currentHexY, "#3333FF", "", false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "grass") {
                this.drawHex(currentHexX, currentHexY, "#009900", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "desert") {
                this.drawHex(currentHexX, currentHexY, "#F5E8C1", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "mountains") {
                this.drawHex(currentHexX, currentHexY, "#996600", debugText, false, map.data[row][col].owner);
            }
        }
        offsetColumn = !offsetColumn;
    }

    var offsetColumn = false;
    for (var col = 0; col < cols; col++) { //Draw borders separately so they don't get overlapped by other graphics. 
        for (var row = 0; row < rows; row++) {
            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }
            this.drawHexBorders(currentHexX, currentHexY);
        }
        offsetColumn = !offsetColumn;
    }

    if (map.dataProp.turnPhase == "unitPlacement") {
        for (var i = 0, len = map.unitPlacement.length; i < len; i++) {
            var y = map.unitPlacement[i].col % 2 == 0 ? (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 : (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var x = (map.unitPlacement[i].col * this.side) + this.canvasOriginX;
            this.drawHex(x, y - 6, "", "", true, "#00F2FF", map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].owner);
        }
    }
};

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color) {
    var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (column * this.side) + this.canvasOriginX;

    this.drawHex(drawx, drawy, color, "");
};

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to acuratly determin correct hex
HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY) {
    var offSet = this.getRelativeCanvasOffset();

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    var column = Math.floor((mouseX) / this.side);
    var row = Math.floor(
        column % 2 == 0 ? Math.floor((mouseY) / this.height) : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);

    //Test if on left side of frame            
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {
        //Now test which of the two triangles we are in 
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0 ? row * this.height : (row * this.height) + (this.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        var p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        var p4 = new Object();
        p4 = p2;

        var p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        var p6 = new Object();
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }

    return {
        row: row,
        column: column
    };

};

HexagonGrid.prototype.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1, b2, b3;
    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
};

function toCubeCoord(q, r) {
    /**  Function to convert odd-q offset coordinates to cube coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
     * @param {Number} q - the column of the hex
     * @param {Number} r - the row of the hex
     */
    this.r = r;
    this.q = q;
    var x = this.q
    var z = this.r - (this.q - (this.q & 1)) / 2
    var y = -x - z
    var cube = {
        x: x,
        y: y,
        z: z
    };

    return cube;
}

function toOffsetCoord(x, y, z) {
    /**  Function to convert cube coordinates to odd-q offset coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
     * @param {Number} x - the x cube coord of the hex
     * @param {Number} y - the y cube coord of the hex
     * @param {Number} z - the z cube coord of the hex
     */
    this.x = x;
    this.y = y;
    this.z = z;
    var q = this.x;
    var r = this.z + (this.x - (this.x & 1)) / 2
    var offset = {
        q: q,
        r: r
    };

    return offset;
}

