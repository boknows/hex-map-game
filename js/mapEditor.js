$("body").css("overflow", "hidden");
var keys = [37, 38, 39, 40];
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}
disable_scroll();
// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
var Map = function() {
    var mapData;
    this.data = null;
    this.editMap = {
        col: null,
        row: null,
    };
    this.connectors = [];
    this.connectorBtn = false;
    this.username = $('#username').val();
    this.email = $('#email').val();
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
    this.updateData = function(callback){
        $.ajax({
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON',
            data: {
                param: "getSingleMap",
                id: $('#loadMap').val(),
            },
        }).success(callback);
    };
};

function updateMap(data, param) {
    data.param = param;
    $.ajax({
        url: "getMap.php",
        data: data,
        type: "POST",
        dataType: 'JSON',
        success: function (r){
            window.location.replace("dashboard.php");
        }
    });
};
var map = new Map();
map.getData(function(map_data) {
    map.data = new Array(100);
    for (var i = 0; i < map.data.length; i++) {
        map.data[i] = new Array(100);
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
                "connect": [],
                "group": "",
                "groupBonus": 0,
                "neutral": false,
                "nUnits": 0,
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
        "hexSize": parseInt($('#size').val()),
        "groupBonus": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    };
    console.log(map.data);
    var hexagonGrid = new HexagonGrid("HexCanvas", map.dataProp.hexSize);
    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 10, 10, true);
    updateMenu(hexagonGrid);
    var inputFocus = false;

    function updateMenu (hexagonGrid){
        var x0 = ($('#size').val()*1.75) * (map.dataProp.cols) + map.canvas.getBoundingClientRect().left;
        var y0 = ((hexagonGrid.height / 1.5)) + hexagonGrid.canvasOriginY;
        var style = {
            left: x0,
            top: 5,
            position: "absolute",
            'font-size': '75%'
        };
        $("#panel").css(style);
    }
    

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
            "hexSize": parseInt($('#size').val()),
        };
        hexagonGrid.radius = map.dataProp.hexSize;
        hexagonGrid.height = Math.sqrt(3) * map.dataProp.hexSize;
        hexagonGrid.width = 2 * map.dataProp.hexSize;
        hexagonGrid.side = (3 / 2) * map.dataProp.hexSize;
        map.canvas = document.getElementById("HexCanvas"); //replicate canvas/context in global object for future use. 
        map.ctx = map.canvas.getContext('2d');
        hexagonGrid.context = map.ctx;
        hexagonGrid.canvas = map.canvas;

        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 10, 10, true);
        updateMenu(hexagonGrid);
    }, false);

    var otherOptions = document.getElementById('options');
    otherOptions.addEventListener('click', function(e) { //For the map editor
        if($('#otherMapOptions').css('display') == "none"){
            $('#otherMapOptions').show(); 
        }else{
            $('#otherMapOptions').hide();
        }
        
    }, false);
    var connectBtn = document.getElementById('connectBtn');
    connectBtn.addEventListener('click', function(e) { //For the map editor
        if(map.connectorBtn == false && map.data[map.editMap.row][map.editMap.col].connect.length == 0){
            map.connectorBtn = true;
            $('#connectConfirm').show();
            $('#connectBtn').hide();
            map.connectors.push({"row":map.editMap.row, "col":map.editMap.col, "origin": true});
            var drawy = map.editMap.col % 2 == 0 ? (map.editMap.row * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.editMap.row *hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
            var drawx = (map.editMap.col * hexagonGrid.side) + hexagonGrid.canvasOriginX;
            hexagonGrid.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", ""); //highlight selected
            console.log(map.editMap.col, map.editMap.row); 
        }else if(map.connectorBtn == false && map.data[map.editMap.row][map.editMap.col].connect.length > 0){
            map.connectors.push({"row":map.editMap.row, "col": map.editMap.col, "origin":true});
            map.connectorBtn = true;
            $('#connectConfirm').show();
            $('#connectBtn').hide();
            var drawy = map.editMap.col % 2 == 0 ? (map.editMap.row * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.editMap.row *hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
            var drawx = (map.editMap.col * hexagonGrid.side) + hexagonGrid.canvasOriginX;
            hexagonGrid.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", ""); //highlight selected 
            for(var i=0;i<map.data[map.editMap.row][map.editMap.col].connect.length;i++){
                map.connectors.push({"row":map.data[map.editMap.row][map.editMap.col].connect[i].row, "col": map.data[map.editMap.row][map.editMap.col].connect[i].col, "origin":false});
                var drawy = map.data[map.editMap.row][map.editMap.col].connect[i].col % 2 == 0 ? (map.data[map.editMap.row][map.editMap.col].connect[i].row * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.data[map.editMap.row][map.editMap.col].connect[i].row *hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
                var drawx = (map.data[map.editMap.row][map.editMap.col].connect[i].col * hexagonGrid.side) + hexagonGrid.canvasOriginX;
                hexagonGrid.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", "");
            }    
        }
    }, false);

    var connectConfirm = document.getElementById('connectConfirm');
    connectConfirm.addEventListener('click', function(e) { //For the map editor
        map.connectorBtn = false;
        $('#connectConfirm').hide();
        $('#connectBtn').show();
        var originCol = map.connectors[0].col;
        var originRow = map.connectors[0].row;
        map.data[originRow][originCol].connect = [];
        for(var i=1;i<map.connectors.length;i++){
           map.data[originRow][originCol].connect.push({"row":map.connectors[i].row, "col":map.connectors[i].col});
        }
        map.connectors = [];
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 10, 10, true);
    }, false);

    var saveMap = document.getElementById('saveMap');
    saveMap.addEventListener('click', function(e) { //For the map editor
        var bonus = [];
        for (var i=0;i<100;i++){ //Set each bonus counter to 0, for as many bonuses exist in mapBonus.
            bonus[i] = 0;
        }
        for (var i = 0; i < map.data.length; i++) { //calculate how many of each group the player has
            for (var j = 0; j < map.data[i].length; j++) {
                if (map.data[i][j].group != "") {
                    bonus[map.data[i][j].group]++;
                }
            }
        }
        map.dataProp.mapBonus = [];
        for (var i=0; i<bonus.length;i++){
            if(bonus[i] != 0){
                 map.dataProp.mapBonus.push({"group":i,"sum":bonus[i],"amount":map.dataProp.groupBonus[i]});    
            }
        }
        delete map.dataProp.groupBonus; //this isn't used in the production game, only in the mapEditor
        var data= {
            mapArray: JSON.stringify(map.data),
            mapProperties: JSON.stringify(map.dataProp),
            name: $('#saveMapName').val(),
        };
        updateMap(data, "saveMap");
        console.log(JSON.stringify(map.data));
        console.log(JSON.stringify(map.dataProp));
    }, false);

    var loadMapBtn = document.getElementById('loadMapBtn');
    loadMapBtn.addEventListener('click', function(e) { //For the map editor
        map.updateData(function(resp){
            map.data = JSON.parse(resp.mapArray);
            map.dataProp = JSON.parse(resp.mapProperties);
            console.log(map.dataProp);
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            var hexagonGrid = new HexagonGrid("HexCanvas", map.dataProp.hexSize);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 10, 10, true);
            updateMenu(hexagonGrid);
            $('#rows').val(map.dataProp.rows);
            $('#cols').val(map.dataProp.cols);
            $('#size').val(map.dataProp.hexSize);
        });
        
        
    }, false);

    $( "input" ).focus(function() {
        hexagonGrid.inputFocus = true;
    });

    //functions to update Map object when options are selected or typed in
    $('#nUnits').keyup(function(e) {
        map.data[map.editMap.row][map.editMap.col].nUnits = parseInt($('#nUnits').val());
    });
    $('#group1bonus').keyup(function(e) {
        map.dataProp.groupBonus[1] = parseInt($('#group1bonus').val());
    });
    $('#group2bonus').keyup(function(e) {
        map.dataProp.groupBonus[2] = parseInt($('#group2bonus').val());
    });
    $('#group3bonus').keyup(function(e) {
        map.dataProp.groupBonus[3] = parseInt($('group3bonus').val());
    });
    $('#group4bonus').keyup(function(e) {
        map.dataProp.groupBonus[4] = parseInt($('#group4bonus').val());
    });
    $('#group5bonus').keyup(function(e) {
        map.dataProp.groupBonus[5] = parseInt($('#group5bonus').val());
    });
    $('#group6bonus').keyup(function(e) {
        map.dataProp.groupBonus[6] = parseInt($('#group6bonus').val());
    });
    $('#group7bonus').keyup(function(e) {
        map.dataProp.groupBonus[7] = parseInt($('#group7bonus').val());
    });
    $('#group8bonus').keyup(function(e) {
        map.dataProp.groupBonus[8] = parseInt($('#group8bonus').val());
    });
    $('#group9bonus').keyup(function(e) {
        map.dataProp.groupBonus[9] = parseInt($('#group9bonus').val());
    });
    $('#group10bonus').keyup(function(e) {
        map.dataProp.groupBonus[10] = parseInt($('#group10bonus').val());
    });
    $( "#n" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].n == $('#n').val();
    });
    $( "#ne" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].ne == $('#ne').val();
    });
    $( "#nw" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].nw == $('#nw').val();
    });
    $( "#s" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].s == $('#s').val();
    });
    $( "#se" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].se == $('#se').val();
    });
    $( "#sw" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].sw == $('#sw').val();
    });
    $( "#neutral" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].neutral == $('#neutral').val();
    });
    $( "#group" ).change(function() {
        map.data[map.editMap.row][map.editMap.col].group == $('#group').val();
    });




    $('body').keydown(function(e) {
        if (hexagonGrid.inputFocus == false) {
            var cube = toCubeCoord(map.editMap.col, map.editMap.row);
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 48:
                    $('#group').val("0");
                    map.data[map.editMap.row][map.editMap.col].group = "0";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 49:
                    $('#group').val("1");
                    map.data[map.editMap.row][map.editMap.col].group = "1";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 50:
                    $('#group').val("2");
                    map.data[map.editMap.row][map.editMap.col].group = "2";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 51:
                    $('#group').val("3");
                    map.data[map.editMap.row][map.editMap.col].group = "3";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 52:
                    $('#group').val("4");
                    map.data[map.editMap.row][map.editMap.col].group = "4";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 53:
                    $('#group').val("5");
                    map.data[map.editMap.row][map.editMap.col].group = "5";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 54:
                    $('#group').val("6");
                    map.data[map.editMap.row][map.editMap.col].group = "6";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 55:
                    $('#group').val("7");
                    map.data[map.editMap.row][map.editMap.col].group = "7";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 56:
                    $('#group').val("8");
                    map.data[map.editMap.row][map.editMap.col].group = "8";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    break;
                case 57:
                    $('#group').val("9");
                    map.data[map.editMap.row][map.editMap.col].group = "9";
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 32:
                    e.preventDefault();
                    $('#group').val("");
                    map.data[map.editMap.row][map.editMap.col].group = "";
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 76:
                    $('#type').val("Land");
                    map.data[map.editMap.row][map.editMap.col].type = "land";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 87:
                    $('#type').val("Water");
                    map.data[map.editMap.row][map.editMap.col].type = "water";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 68:
                    $('#type').val("desert");
                    map.data[map.editMap.row][map.editMap.col].type = "desert";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 77:
                    $('#type').val("mountains");
                    map.data[map.editMap.row][map.editMap.col].type = "mountains";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 65:
                    $('#type').val("artic");
                    map.data[map.editMap.row][map.editMap.col].type = "artic";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 70:
                    $('#type').val("forest");
                    map.data[map.editMap.row][map.editMap.col].type = "forest";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 78:
                    if (map.data[map.editMap.row][map.editMap.col].neutral == true) {
                        map.data[map.editMap.row][map.editMap.col].neutral = false;
                        $('#neutral').val("false");
                    } else {
                        map.data[map.editMap.row][map.editMap.col].neutral = true;
                        $('#neutral').val("true");
                    }
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
                case 67:
                    $('#group').val("");
                    map.data[map.editMap.row][map.editMap.col].group = "";
                    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                    break;
            }
            if (e.keyCode == 103) {
                if ($('#nw').val() != "#000000") {
                    $('#nw').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
                    var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                    map.data[offset.r][offset.q].se = $('#nw').val();
                } else {
                    $('#nw').val("None");
                    map.data[map.editMap.row][map.editMap.col].nw = "";
                    var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                    map.data[offset.r][offset.q].se = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 97) {
                if ($('#sw').val() != "#000000") {
                    $('#sw').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
                    var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                    map.data[offset.r][offset.q].ne = $('#sw').val();
                } else {
                    $('#sw').val("None");
                    map.data[map.editMap.row][map.editMap.col].sw = "";
                    var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                    map.data[offset.r][offset.q].ne = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 98) {
                if ($('#s').val() != "#000000") {
                    $('#s').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
                    var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                    map.data[offset.r][offset.q].n = $('#s').val();
                } else {
                    $('#s').val("None");
                    map.data[map.editMap.row][map.editMap.col].s = "";
                    var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                    map.data[offset.r][offset.q].n = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 99) {
                if ($('#se').val() != "#000000") {
                    $('#se').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
                    var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                    map.data[offset.r][offset.q].nw = $('#se').val();
                } else {
                    $('#se').val("None");
                    map.data[map.editMap.row][map.editMap.col].se = "";
                    var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                    map.data[offset.r][offset.q].nw = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 105) {
                if ($('#ne').val() != "#000000") {
                    $('#ne').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
                    var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                    map.data[offset.r][offset.q].sw = $('#ne').val();
                } else {
                    $('#ne').val("None");
                    map.data[map.editMap.row][map.editMap.col].ne = "";
                    var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                    map.data[offset.r][offset.q].sw = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 104) {
                if ($('#n').val() != "#000000") {
                    $('#n').val("#000000");
                    map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
                    var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                    map.data[offset.r][offset.q].s = $('#n').val();
                } else {
                    $('#n').val("None");
                    map.data[map.editMap.row][map.editMap.col].n = "";
                    var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                    map.data[offset.r][offset.q].s = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }

            //keycodes for green border
            if (e.keyCode == 38) {
                if ($('#n').val() != "#00FF00") {
                    $('#n').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
                    var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                    map.data[offset.r][offset.q].s = $('#n').val();
                } else {
                    $('#n').val("None");
                    map.data[map.editMap.row][map.editMap.col].n = "";
                    var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                    map.data[offset.r][offset.q].s = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 33) {
                if ($('#ne').val() != "#00FF00") {
                    $('#ne').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
                    var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                    map.data[offset.r][offset.q].sw = $('#ne').val();
                } else {
                    $('#ne').val("None");
                    map.data[map.editMap.row][map.editMap.col].ne = "";
                    var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                    map.data[offset.r][offset.q].sw = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 34) {
                e.preventDefault();
                if ($('#se').val() != "#00FF00") {
                    $('#se').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
                    var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                    map.data[offset.r][offset.q].nw = $('#se').val();
                } else {
                    $('#se').val("None");
                    map.data[map.editMap.row][map.editMap.col].se = "";
                    var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                    map.data[offset.r][offset.q].nw = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 40) {
                if ($('#s').val() != "#00FF00") {
                    $('#s').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
                    var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                    map.data[offset.r][offset.q].n = $('#s').val();
                } else {
                    $('#s').val("None");
                    map.data[map.editMap.row][map.editMap.col].s = "";
                    var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                    map.data[offset.r][offset.q].n = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 35) {
                e.preventDefault();
                if ($('#sw').val() != "#00FF00") {
                    $('#sw').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
                    var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                    map.data[offset.r][offset.q].ne = $('#sw').val();
                } else {
                    $('#sw').val("None");
                    map.data[map.editMap.row][map.editMap.col].sw = "";
                    var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                    map.data[offset.r][offset.q].ne = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            if (e.keyCode == 36) {
                e.preventDefault();
                if ($('#nw').val() != "#00FF00") {
                    $('#nw').val("#00FF00");
                    map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
                    var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                    map.data[offset.r][offset.q].se = $('#nw').val();
                } else {
                    $('#nw').val("None");
                    map.data[map.editMap.row][map.editMap.col].nw = "";
                    var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                    map.data[offset.r][offset.q].se = "";
                }
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true); 
            }
        }
    });
});

function HexagonGrid(canvasId, radius) {
    this.radius = map.dataProp.hexSize;
    this.height = Math.sqrt(3) * map.dataProp.hexSize;
    this.width = 2 * map.dataProp.hexSize;
    this.side = (3 / 2) * map.dataProp.hexSize;
    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    this.context = map.ctx;
    this.canvas = map.canvas;
    this.canvasOriginX = 10;
    this.canvasOriginY = 10;
    this.inputFocus = false;
    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};

HexagonGrid.prototype.clickEvent = function(e) {
    this.inputFocus = false;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;
    var tile = this.getSelectedTile(localX, localY);
    map.editMap = {
        row: tile.row,
        col: tile.column
    };
    if(map.connectorBtn == true && map.data[tile.row][tile.column].type != "water"){
        var trigger = false;
        for(var i=0;i<map.connectors.length;i++){
            if(map.connectors[i].col == tile.column && map.connectors[i].row == tile.row){
                trigger = true;
                if(map.connectors[i].origin == false){
                    map.connectors.splice(i,1);
                }
                this.drawHexGrid(map.dataProp.rows, map.dataProp.cols, this.canvasOriginX, this.canvasOriginY, true);
            }
        }
        if(trigger == false){
            map.connectors.push({"row":tile.row,"col":tile.column, "origin": false});
            var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var drawx = (tile.column * this.side) + this.canvasOriginX;
            this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", "");
        }
    }

    console.log(map.data[tile.row][tile.column]);
    if (map.data[tile.row][tile.column].type == "water") {
        map.data[tile.row][tile.column].type = "land";
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        this.drawHexGrid(map.dataProp.rows, map.dataProp.cols, this.canvasOriginX, this.canvasOriginY, true);
    }

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
        $('#s').val(map.data[tile.row][tile.column].s);
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
    if(map.data[tile.row][tile.column].neutral == true){
        $('#neutral').val("true");
    }else{
        $('#neutral').val("false");
    }
    $('#nUnits').val(map.data[tile.row][tile.column].nUnits);
    $('#groupBonusAmt').val(map.data[tile.row][tile.column].groupBonus);

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
        size = map.dataProp.hexSize,
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

    //Print Group number
    this.context.textAlign="center"; 
    this.context.textBaseline = "middle";
    this.context.font = 'bold 13pt Arial';
    this.context.fillStyle = "#000000";
    if(map.data[tile.row][tile.column].neutral == true && map.data[tile.row][tile.column].group == ""){
        this.context.fillText("N", x0 + (this.width / 2) , y0 + (this.height / 2));
    }else if(map.data[tile.row][tile.column].neutral == true && map.data[tile.row][tile.column].group !== ""){
        this.context.fillText(map.data[tile.row][tile.column].group + " + N", x0 + (this.width / 2) , y0 + (this.height / 2));
    }else{
        this.context.fillText(map.data[tile.row][tile.column].group, x0 + (this.width / 2) , y0 + (this.height / 2));
    }
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
            } else if (map.data[row][col].type == "forest") {
                this.drawHex(currentHexX, currentHexY, "#009900", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "desert") {
                this.drawHex(currentHexX, currentHexY, "#F5E8C1", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "mountains") {
                this.drawHex(currentHexX, currentHexY, "#996600", debugText, false, map.data[row][col].owner);
            } else if (map.data[row][col].type == "artic"){
                this.drawHex(currentHexX, currentHexY, "#FFFFFF", debugText, false, map.data[row][col].owner);
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

    for(var i = 0; i<map.connectors.length; i++){
        if(map.connectors[i].origin == true){
            var drawy = map.connectors[i].col % 2 == 0 ? (map.connectors[i].row * this.height) + this.canvasOriginY + 6 : (map.connectors[i].row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var drawx = (map.connectors[i].col * this.side) + this.canvasOriginX;
            this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", ""); //highlight selected
        }else if(map.connectors[i].origin == false){
            var drawy = map.connectors[i].col % 2 == 0 ? (map.connectors[i].row * this.height) + this.canvasOriginY + 6 : (map.connectors[i].row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var drawx = (map.connectors[i].col * this.side) + this.canvasOriginX;
            this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", "")
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

