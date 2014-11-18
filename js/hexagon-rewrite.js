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
    this.unitPlacement = [];
    this.clickState = null;
    this.neighbors = [];
    this.username = $('#username').val();
    this.email = $('#email').val();
    this.unitCnt = 0;
    this.ctx = null;
    this.canvas = null;
    this.getData = function(callback) {
        $.ajax({
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON',
            data: {
                param: "getAll",
                gameID: $('#game_id').val(),
                email: $('#email').val()
            },
        }).success(callback);
    };
};

function updateMap(data, param) {
    data.param = param;
    data.gameID = $('#game_id').val();
    $.ajax({
        url: "getMap.php",
        data: data,
        type: "POST",
        dataType: 'JSON'
    });
};
var map = new Map();
map.getData(function(map_data){
    map.data = JSON.parse(map_data.mapArray);
    map.dataProp = JSON.parse(map_data.mapProperties);
    map.log = JSON.parse(map_data.mapLog);
    var uiCanvas = document.getElementById("UICanvas");
    var ctxUI = uiCanvas.getContext("2d");
    /*for(i=0;i<map.data.length;i++){ //clear map 
        for(j=0;j<map.data[i].length;j++){
                map.data[i][j].units = 0;
				map.data[i][j].owner = "";
				map.data[i][j].color = "";
        }
    }
	*/
    console.log(map.dataProp);
    var hexagonGrid = new HexagonGrid("HexCanvas", 30);
    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 130, 10, true);

    if (map.dataProp.turnPhase == "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email) {
        var arr = [{"id":"#endTurn","action":"hide"},{"id":"#attack","action":"hide"},{"id":"#unitButtons","action":"show"}];
        showHide(arr,"unitPlacement phase. Initial Load.");
        var units = calcUnits(map.username);
        var unitsDisp = document.getElementById('units').innerHTML;
        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
        document.getElementById('units').innerHTML = unitsDisp;
    } else if (map.dataProp.turnPhase != "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email) {
        var arr = [{"id":"#attack","action":"hide"}];
        showHide(arr,"Not unitPlacement phase, but your turn. Initial Load.");
    }
    if(map.dataProp.turnPhase == "attack" && map.dataProp.owners[map.dataProp.turn] == map.email){
        if(typeof(document.getElementById('msg').innerHTML) != null){
            var msg = document.getElementById('msg').innerHTML;
            msg = "Choose a territory to attack with, then click on an enemy to attack.";
            document.getElementById('msg').innerHTML = msg;
            var arr = [{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
            showHide(arr,"Attack phase. Initial Load.");
        }
        
    }
    if(map.dataProp.turnPhase == "fortify"){
    	var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
        fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
        document.getElementById('fortUnits').innerHTML = fortUnitsDisp;
        var arr = [{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"hide"},{"id":"#endTurnButton","action":"show"}];
        if(map.dataProp.fortifiesUsed>0){
            arr.push({"id":"#backToAttack","action":"hide"});
        }else{
            arr.push({"id":"#backToAttack","action":"show"})
        }
        showHide(arr,"Fortify phase. Initial Load.");
    }
    if (map.dataProp.owners[map.dataProp.turn] != map.email) {
        var arr = [{"id":"#panel","action":"show"},{"id":"#notYourTurn","action":"show"},{"id":"#onoffswitch","action":"show"},{"id":"#endTurnButton","action":"hide"}];
        showHide(arr,"Not your turn. Initial Load.");
    }
    if(map.dataProp.owners[map.dataProp.turn] == map.email && map.dataProp.turnPhase != "fortify"){
        var arr = [{"id":"#endTurnButton","action":"hide"}];
        showHide(arr,"Not Fortify phase, but your turn. Initial Load.");
    }
    if(map.dataProp.owners[map.dataProp.turn] == map.email){
        var arr = [{"id":"#msg","action":"show"}];
        showHide(arr,"Initial Load.");
    }
    

    //initialize onoff checkbox
    var intervalSwitch;
    $('#myonoffswitch').change(function() {
        if ($('#myonoffswitch').prop('checked') == true) {
            intervalSwitch = setInterval(function(){
                $.ajax({
                    url: "getMap.php",
                    type: "POST",
                    dataType: 'JSON',
                    data: {
                        param: "getAll",
                        gameID: $('#game_id').val(),
                        email: $('#email').val()
                    },
                    success: function(resp){
                        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                        map.canvas.style.top = 0;
                        map.data = [];
                        map.dataProp = [];
                        map.data = JSON.parse(resp.mapArray);
                        map.dataProp = JSON.parse(resp.mapProperties);
                        map.log = JSON.parse(resp.mapLog);
                        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 130, 10, true);
                        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
                        showPlayers();
                        updateLogDisp(hexagonGrid);
                        if(map.dataProp.owners[map.dataProp.turn] == map.email){
                            $('#myonoffswitch').attr('checked', false);
                            clearInterval(intervalSwitch);
                            var arr = [{"id":"#endTurn","action":"hide"},{"id":"#attack","action":"hide"},{"id":"#unitButtons","action":"show"},{"id":"#notYourTurn","action":"hide"}];
                            showHide(arr,"unitPlacement phase. Initial Load. Inside autorefresh function.");
                            var units = calcUnits(map.username);
                            var unitsDisp = document.getElementById('units').innerHTML;
                            unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
                            document.getElementById('units').innerHTML = unitsDisp;
                        }
                    }
                });
            }, 3000);
        } else if ($('#myonoffswitch').prop('checked') == false) {
            clearInterval(intervalSwitch);
        }
    });
    
    //UI Buttons
    var undoAll = document.getElementById('undoAll');
    undoAll.addEventListener('click', function(e) {
        map.unitCnt = 0;
        var units = calcUnits(map.username);
        for (i = 0; i < map.unitPlacement.length; i++) {
            map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].units--;
        }
        map.unitPlacement = null;
        map.unitPlacement = [];
        var unitsDisp = document.getElementById('units').innerHTML;
        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
        document.getElementById('units').innerHTML = unitsDisp;
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
    }, false);
    
    var undoLast = document.getElementById('undoLast');
    undoLast.addEventListener('click', function(e) {
        map.data[map.unitPlacement[map.unitPlacement.length - 1].row][map.unitPlacement[map.unitPlacement.length - 1].col].units--;
        map.unitPlacement.pop();
        map.unitCnt--;
        var units = calcUnits(map.username);
        var unitsDisp = document.getElementById('units').innerHTML;
        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
        document.getElementById('units').innerHTML = unitsDisp;
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
    }, false);
    
    var compPlc = document.getElementById('compPlc');
    compPlc.addEventListener('click', function(e) {
        compareMap(map.data);
        map.dataProp.turnPhase = "attack";
        updateLog("--------------------");
        updateLog("It is now the attack phase.");
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var arr = [{"id":"#unitButtons","action":"hide"},{"id":"#panel","action":"show"},{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#endTurnButton","action":"hide"},{"id":"#fortifyButton","action":"show"}];
        showHide(arr,"compPlc button pressed.");
        updateLogDisp(hexagonGrid);
        showPlayers();
        var msg = document.getElementById('msg').innerHTML;
        msg = "Choose a territory to attack with, then click on an enemy to attack.";
        document.getElementById('msg').innerHTML = msg;
    }, false);

    var singleAttackButton = document.getElementById('singleAttack');
    singleAttackButton.addEventListener('click', function(e) {
        singleAttack(hexagonGrid);
        hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
        hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var drawy2 = map.attack.attY % 2 == 0 ? (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
        var drawx2 = (map.attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
        var drawy3 = map.attack.defY % 2 == 0 ? (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
        var drawx3 = (map.attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
        if (map.data[map.attack.attX][map.attack.attY].units == 1) {
            var arr = [{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
            showHide(arr,"SingleAttack button pressed.");
        } else {
            hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map.data[map.attack.attX][map.attack.attY].owner); //highlight attacker hex
            hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map.data[map.attack.defX][map.attack.defY].owner); //highlight defender hex
        }
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        console.log(map.dataProp.rows, map.dataProp.cols);
    }, false);
	
    var contAttackButton = document.getElementById('continuousAttack');
    contAttackButton.addEventListener('click', function(e) {
        contAttack(hexagonGrid);
        var arr = [{"id":"#attack","action":"hide"}];
        if($('#attackMove').css('display')=="none"){
            arr.push({"id":"#endTurn","action":"show"});
        }
        showHide(arr,"ContAttack button pressed.");
    }, false);

    var attackMove = document.getElementById('attackMoveBtn');
    attackMove.addEventListener('click', function(e) {
        var move = $('#attackMoveDrop').val();
        map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + parseInt(move);
        map.data[map.attack.attX][map.attack.attY].units = parseInt(map.data[map.attack.attX][map.attack.attY].units) - parseInt(move);
        map.clickState = null;
        map.selected = null;
        updateLog(map.dataProp.users[map.dataProp.turn] + " moved " + parseInt(move) + " units to the defeated hex.")
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var arr = [{"id":"#panel","action":"show"},{"id":"#attackMove","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
        showHide(arr,"Move button pressed.");
        updateLogDisp(hexagonGrid);
    }, false);
    
    var attackMoveAll = document.getElementById('attackMoveAllBtn');
    attackMoveAll.addEventListener('click', function(e) {
        map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.attX][map.attack.attY].units);
        map.data[map.attack.attX][map.attack.attY].units = 1;
        map.clickState = null;
        map.selected = null;
        updateLog(map.dataProp.users[map.dataProp.turn] + " moved " + (map.data[map.attack.defX][map.attack.defY].units) + " units to the defeated hex.")
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var arr = [{"id":"#panel","action":"show"},{"id":"#attackMove","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
        showHide(arr,"MoveAll button pressed.");
        updateLogDisp(hexagonGrid);
    }, false);
	
    var fortifyButton = document.getElementById('fortifyButton');
    fortifyButton.addEventListener('click', function(e) {
        map.dataProp.turnPhase = "fortify";
        updateLog("--------------------");
        updateLog("It is now the fortify phase.");
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        updateLogDisp(hexagonGrid);
        showPlayers();
        
        var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
        fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
        document.getElementById('fortUnits').innerHTML = fortUnitsDisp;
        var arr = [{"id":"#fortifyButton","action":"hide"},{"id":"#endTurnButton","action":"show"},{"id":"#backToAttack","action":"show"}];
        showHide(arr,"Fortify Phase button pressed.");
    }, false);

    var backToAttackButton = document.getElementById('backToAttack');
    backToAttackButton.addEventListener('click', function(e) {
        map.dataProp.turnPhase = "attack";
        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var arr = [{"id":"#unitButtons","action":"hide"},{"id":"#panel","action":"show"},{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#endTurnButton","action":"hide"},{"id":"#fortifyButton","action":"show"},{"id":"#backToAttack","action":"hide"}];
        showHide(arr,"compPlc button pressed.");
        updateLogDisp(hexagonGrid);
        showPlayers();
        var msg = document.getElementById('msg').innerHTML;
        msg = "Choose a territory to attack with, then click on an enemy to attack.";
        document.getElementById('msg').innerHTML = msg;
    }, false);

    var transferMaxButton = document.getElementById('transferMaxButton');
    transferMaxButton.addEventListener('click', function(e) {
        map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + parseInt(map.data[map.attack.attX][map.attack.attY].units) - 1;
        map.data[map.attack.attX][map.attack.attY].units = 1;
        map.dataProp.fortifiesUsed++;
        map.selected = null;
        map.clickState = null;
        var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
        fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
        document.getElementById('fortUnits').innerHTML = fortUnitsDisp;
        updateLog(map.dataProp.fortifiesUsed + " / " + map.dataProp.fortifies + " fortifies used.");
        updateLogDisp(hexagonGrid);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        var arr = [{"id":"#fortify","action":"hide"},{"id":"#endTurnButton","action":"show"},{"id":"#backToAttack","action":"hide"}];
        showHide(arr,"Fortify Phase, transferMax button pressed.");
    }, false);
    
    var transferButton = document.getElementById('transferButton');
    transferButton.addEventListener('click', function(e) {
        var num = $('#transfer').val();
        num = parseInt(num);
        var tmp = parseInt(map.data[map.attack.attX][map.attack.attY].units);
        map.dataProp.fortifiesUsed++;
        map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + num;
        map.data[map.attack.attX][map.attack.attY].units = tmp - num;
        updateLog(map.dataProp.fortifiesUsed + " / " + map.dataProp.fortifies + " fortifies used.");
        var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
        fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
        document.getElementById('fortUnits').innerHTML = fortUnitsDisp;

        updateLogDisp(hexagonGrid);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        map.selected = null;
        map.clickState = null;
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        var arr = [{"id":"#fortify","action":"hide"},{"id":"#endTurnButton","action":"show"},{"id":"#backToAttack","action":"hide"}];
        showHide(arr,"Fortify Phase, transfer button pressed.");
    }, false);

    var endTurnButton = document.getElementById('endTurnButton');
    endTurnButton.addEventListener('click', function(e) {
        map.attack = {
            attX: null,
            attY: null,
            defX: null,
            defY: null
        };
        map.selected = {
            col: null,
            row: null,
            nCol: null,
            nRow: null
        };
        map.unitPlacement = [];
        map.clickState = null;
        map.neighbors = [];
        map.unitCnt = 0;
        if(map.dataProp.winCard == true){
            drawCard(map.dataProp.owners[map.dataProp.turn]);
        }
        $('#notYourTurnText').html(notYourTurnText);

        if (map.dataProp.turn == map.dataProp.owners.length - 1) {
            map.dataProp.turn = 0;
        } else {
            map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
            for(var i =0;i<map.dataProp.eliminated;i++){
                if(map.dataProp.users[map.dataProp.turn] == map.dataProp.eliminated[i]){
                    if (map.dataProp.turn == map.dataProp.owners.length - 1) {
                        map.dataProp.turn = 0;
                    } else {
                        map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
                    }
                }
            }
        }
        map.dataProp.winCard = false;
        var units = calcUnits(map.dataProp.users[map.dataProp.turn]);
        if(units == 0){
            map.dataProp.eliminated.push(map.dataProp.users[map.dataProp.turn]);
            if (map.dataProp.turn == map.dataProp.owners.length - 1) {
                map.dataProp.turn = 0;
            } else {
                map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
            }
        }
        updateLog("--------------------");
        updateLog("Turn ended.");
        updateLog("--------------------");
        updateLog("It is " + map.dataProp.users[map.dataProp.turn] + "'s turn.");
        updateLog("It is now the unitPlacement phase.");
        updateLog(map.dataProp.users[map.dataProp.turn] + " receives " + units + " units.");
        map.dataProp.fortifiesUsed = 0;
        map.dataProp.turnPhase = "unitPlacement";
        var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
        updateMap(data, "updateAll");
        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        showPlayers();
        updateLogDisp(hexagonGrid);
        var arr = [{"id":"#notYourTurn","action":"show"},{"id":"#notYourTurnText","action":"show"},{"id":"#endTurnButton","action":"hide"},{"id":"#msg","action":"hide"},{"id":"#fortify","action":"hide"},{"id":"#endTurn","action":"hide"},{"id":"#backToAttack","action":"hide"}];
        showHide(arr,"End turn button pressed.");
    }, false);
    
    var cardTradeClose = document.getElementById('cardTradeClose');
    cardTradeClose.addEventListener('click', function(e) {
        var arr = [{"id":"#cardTrade","action":"hide"},{"id":"#cardTradeClose","action":"hide"},{"id":"#cardDisp","action":"hide"},{"id":"#log","action":"show"}];
        showHide(arr,"Card Trade Close button pressed.");
    }, false);  

    var cardTrade = document.getElementById('cardTrade');
    cardTrade.addEventListener('click', function(e) {
        var checkedValues = $('.cards:checked').map(function() {
            return this.value;
        }).get();
        tradeInCard(checkedValues);
    }, false);

    
    
    /*
    var updateMapBtn = document.getElementById('updateMap');
    updateMapBtn.addEventListener('click', function(e) { //For the map editor
        console.log(map.unitPlacement[0].row);
        var cube = toCubeCoord(map.unitPlacement[0].col, map.unitPlacement[0].row);
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].type = $('#type').val();
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].owner = $('#owner').val();
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].units = $('#unitsEdit').val();
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].color = $('#color').val();
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].group = $('#group').val();
        map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].connect = JSON.parse($('#connect').val());
        if ($('#n').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].n = $('#n').val();
            var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
            map.data[offset.r][offset.q].s = $('#n').val();
        }
        if ($('#ne').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].ne = $('#ne').val();
            var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
            map.data[offset.r][offset.q].sw = $('#ne').val();
        }
        if ($('#se').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].se = $('#se').val();
            var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
            map.data[offset.r][offset.q].nw = $('#se').val();
        }
        if ($('#s').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].s = $('#s').val();
            var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
            map.data[offset.r][offset.q].n = $('#s').val();
        }
        if ($('#sw').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].sw = $('#sw').val();
            var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
            map.data[offset.r][offset.q].ne = $('#sw').val();
        }
        if ($('#nw').val() != "") {
            map.data[map.unitPlacement[0].row][map.unitPlacement[0].col].nw = $('#nw').val();
            var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
            map.data[offset.r][offset.q].se = $('#nw').val();
        }
        var data = {
            data: JSON.stringify(map.data)
        };
        updateMap(data, "updateMap");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
    }, false);
    */
	
	//UI - Players List
    function showPlayers() {
        var x0 = hexagonGrid.width * (map.dataProp.cols);
        var y0 = 25;
        for (var i = 0; i < map.dataProp.colors.length; i++) {
            //Draw hex representing player's color
            var numberOfSides = 6,
                size = hexagonGrid.radius / 2,
                Xcenter = x0 + (hexagonGrid.width / 2),
                Ycenter = y0 + (hexagonGrid.height / 2);
            ctxUI.strokeStyle = map.dataProp.colors[i];
            ctxUI.beginPath();
            ctxUI.lineWidth = 1.5;
            ctxUI.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
            for (var j = 1; j <= numberOfSides; j += 1) {
                ctxUI.lineTo(Xcenter + size * Math.cos(j * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(j * 2 * Math.PI / numberOfSides));
            }
            ctxUI.fillStyle = map.dataProp.colors[i];
            ctxUI.fill();
            ctxUI.closePath();
            ctxUI.stroke();

            //Draw text with player name
            ctxUI.textAlign = "left";
            if (map.dataProp.turn == i) {
                ctxUI.font = 'bold 13pt Arial';
            } else {
                ctxUI.font = '13pt Arial';
            }
            ctxUI.fillStyle = "#000000";
            if (map.dataProp.users[map.dataProp.turn] == map.dataProp.users[i]) {
                ctxUI.fillText(map.dataProp.users[i] + " [" + map.dataProp.turnPhase + " phase]", x0 + hexagonGrid.width / 1.2, y0 + (hexagonGrid.height / 1.75));
            } else {
                ctxUI.fillText(map.dataProp.users[i], x0 + hexagonGrid.width / 1.2, y0 + (hexagonGrid.height / 1.75));
            }
            ctxUI.fillStyle = "";

            //Show card icon if player has cards
            if(map.dataProp.cardsHeld[i].length>0){
                console.log(map.dataProp.users[i] + " has cards.", map.dataProp.cardsHeld[i]);
                roundRect(ctxUI, (x0-hexagonGrid.width/6), y0+(hexagonGrid.height/3), 15, 20, 1, "" , map.dataProp.colors[i]);
            }

            y0 = y0 + hexagonGrid.height / 1.5; //add to Y coordinate for next player
        }
    }
	showPlayers();
    updateLogDisp(hexagonGrid);
    
});

/*
//Create Random Map if not loading from DB
if (typeof map == "undefined") {
    var mapProperties = {
        owners: new Array("bo_knows", "Marlon"),
        colors: new Array("Orange", "Purple"),
        turn: 0
    };
    var map = new Array(10);
    var types = ["land", "grass", "mountains", "desert"];

    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(20);
    }
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            var land = Math.random() < .8;
            if (land == true) {
                var rand = Math.floor((Math.random() * 4));
                var own = Math.floor((Math.random() * 2));
                map[i][j] = {
                    type: types[rand],
                    owner: mapProperties.owners[own],
                    units: 10,
                    color: mapProperties.colors[own]
                };
            } else if (land == false) {
                map[i][j] = {
                    type: "water"
                };
            }
        }
    }
    //convert properties to JSON for database storage
    var data = JSON.stringify(map);
    //console.log(data);
    var data = JSON.stringify(mapProperties);
    //console.log(data);
}
*/