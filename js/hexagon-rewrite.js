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
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON',
            data: {
                param: "getAll",
                gameID: $('#game_id').val(),
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
map.getData(function(map_data) {
    map.data = JSON.parse(map_data.mapArray);
    map.dataProp = JSON.parse(map_data.mapProperties);
    map.log = JSON.parse(map_data.mapLog);
    map.dataUnits = JSON.parse(map_data.mapUnits);
    var uiCanvas = document.getElementById("UICanvas");
    var ctxUI = uiCanvas.getContext("2d");
    /*for(i=0;i<map.data.length;i++){ //clear map 
        for(j=0;j<map.data[i].length;j++){
                map.dataUnits[i][j].units = 0;
                map.dataUnits[i][j].owner = "";
                map.dataUnits[i][j].color = "";
        }
    }
    */
    console.log(map.data);
    var hexagonGrid = new HexagonGrid("HexCanvas", map.dataProp.hexSize);
    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);

    if (map.dataProp.turnPhase == "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email) {
        var arr = [{
            "id": "#endTurn",
            "action": "hide"
        }, {
            "id": "#attack",
            "action": "hide"
        }, {
            "id": "#unitButtons",
            "action": "show"
        }];
        showHide(arr, "unitPlacement phase. Initial Load.");
        var units = calcUnits(map.username, false);
        map.unitsToBePlaced = units;
        var unitsDisp = document.getElementById('units').innerHTML;
        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + map.unitsToBePlaced + " units placed.</b>";
        document.getElementById('units').innerHTML = unitsDisp;
    } else if (map.dataProp.turnPhase != "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email) {
        var arr = [{
            "id": "#attack",
            "action": "hide"
        }];
        showHide(arr, "Not unitPlacement phase, but your turn. Initial Load.");
    }
    if (map.dataProp.turnPhase == "attack" && map.dataProp.owners[map.dataProp.turn] == map.email) {
        if (typeof(document.getElementById('msg').innerHTML) != null) {
            var msg = document.getElementById('msg').innerHTML;
            msg = "Choose a territory to attack with, then click on an enemy to attack.";
            document.getElementById('msg').innerHTML = msg;
            var arr = [{
                "id": "#endTurn",
                "action": "show"
            }, {
                "id": "#fortifyButton",
                "action": "show"
            }];
            showHide(arr, "Attack phase. Initial Load.");
        }

    }
    if (map.dataProp.turnPhase == "fortify") {
        var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
        fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
        document.getElementById('fortUnits').innerHTML = fortUnitsDisp;
        var arr = [{
            "id": "#endTurn",
            "action": "show"
        }, {
            "id": "#fortifyButton",
            "action": "hide"
        }, {
            "id": "#endTurnButton",
            "action": "show"
        }, {
            "id": "#fortUnits",
            "action": "show"
        }];
        if (map.dataProp.fortifiesUsed > 0) {
            arr.push({
                "id": "#backToAttack",
                "action": "hide"
            });
        } else {
            arr.push({
                "id": "#backToAttack",
                "action": "show"
            })
        }
        showHide(arr, "Fortify phase. Initial Load.");
    }
    if (map.dataProp.owners[map.dataProp.turn] != map.email) {
        var arr = [{
            "id": "#panel",
            "action": "hide"
        }, {
            "id": "#notYourTurn",
            "action": "show"
        }, {
            "id": "#onoffswitch",
            "action": "show"
        }, {
            "id": "#endTurnButton",
            "action": "hide"
        }];
        showHide(arr, "Not your turn. Initial Load.");
    }
    if (map.dataProp.owners[map.dataProp.turn] == map.email && map.dataProp.turnPhase != "fortify") {
        var arr = [{
            "id": "#endTurnButton",
            "action": "hide"
        }];
        showHide(arr, "Not Fortify phase, but your turn. Initial Load.");
    }
    if (map.dataProp.owners[map.dataProp.turn] == map.email) {
        var arr = [{
            "id": "#msg",
            "action": "show"
        }];
        showHide(arr, "Initial Load.");
    }


    //initialize onoff checkbox - Disabled for memory leak issues
    /*
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
                        hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                        ctxUI.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
                        showPlayers();
                        updateLogDisp(hexagonGrid);
                        if(map.dataProp.owners[map.dataProp.turn] == map.email){
                            $('#myonoffswitch').attr('checked', false);
                            clearInterval(intervalSwitch);
                            var arr = [{"id":"#endTurn","action":"hide"},{"id":"#attack","action":"hide"},{"id":"#unitButtons","action":"show"},{"id":"#notYourTurn","action":"hide"}];
                            showHide(arr,"unitPlacement phase. Initial Load. Inside autorefresh function.");
                            var units = calcUnits(map.username, false);
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
    });*/

    //UI Buttons
    var undoAll = document.getElementById('undoAll');
    if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "unitPlacement") {
        undoAll.addEventListener('click', function(e) {
            map.unitCnt = 0;
            var units = calcUnits(map.username, false);
            for (i = 0; i < map.unitPlacement.length; i++) {
                map.dataUnits[map.unitPlacement[i].row][map.unitPlacement[i].col].units--;
            }
            map.unitPlacement = null;
            map.unitPlacement = [];
            var unitsDisp = document.getElementById('units').innerHTML;
            unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
            document.getElementById('units').innerHTML = unitsDisp;
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }, false);
    }

    var undoLast = document.getElementById('undoLast');
    if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "unitPlacement") {
        undoLast.addEventListener('click', function(e) {
            map.dataUnits[map.unitPlacement[map.unitPlacement.length - 1].row][map.unitPlacement[map.unitPlacement.length - 1].col].units--;
            map.unitPlacement.pop();
            map.unitCnt--;
            var units = calcUnits(map.username, false);
            var unitsDisp = document.getElementById('units').innerHTML;
            unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
            document.getElementById('units').innerHTML = unitsDisp;
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }, false);
    }

    var compPlc = document.getElementById('compPlc');
    compPlc.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "unitPlacement") {
            map.dataProp.turnPhase = "attack";
            updateLog("--------------------");
            updateLog("It is now the attack phase.");
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapUnits: JSON.stringify(map.dataUnits),
                mapLog: JSON.stringify(map.log)
            };
            updateMap(data, "updateAll");
            ctxUI.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            var arr = [{
                "id": "#unitButtons",
                "action": "hide"
            }, {
                "id": "#panel",
                "action": "show"
            }, {
                "id": "#attack",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "show"
            }, {
                "id": "#endTurnButton",
                "action": "hide"
            }, {
                "id": "#fortifyButton",
                "action": "show"
            }];
            showHide(arr, "compPlc button pressed.");
            updateLogDisp(hexagonGrid);
            showPlayers();
            var msg = document.getElementById('msg').innerHTML;
            msg = "Choose a territory to attack with, then click on an enemy to attack.";
            document.getElementById('msg').innerHTML = msg;
        }
    }, false);


    var singleAttackButton = document.getElementById('singleAttack');
    singleAttackButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "attack") {
            singleAttack(hexagonGrid);
            hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
            hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            var drawy2 = map.attack.attY % 2 == 0 ? (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
            var drawx2 = (map.attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
            var drawy3 = map.attack.defY % 2 == 0 ? (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
            var drawx3 = (map.attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
            if (map.dataUnits[map.attack.attX][map.attack.attY].units == 1) {
                var arr = [{
                    "id": "#attack",
                    "action": "hide"
                }, {
                    "id": "#endTurn",
                    "action": "show"
                }, {
                    "id": "#fortifyButton",
                    "action": "show"
                }];
                showHide(arr, "SingleAttack button pressed.");
            } else {
                hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map.dataUnits[map.attack.attX][map.attack.attY].owner); //highlight attacker hex
                hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map.dataUnits[map.attack.defX][map.attack.defY].owner); //highlight defender hex
            }
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            console.log(map.dataProp.rows, map.dataProp.cols);
        }
    }, false);

    var contAttackButton = document.getElementById('continuousAttack');
    contAttackButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "attack") {
            contAttack(hexagonGrid);
            var arr = [{
                "id": "#attack",
                "action": "hide"
            }];
            if ($('#attackMove').css('display') == "none") {
                arr.push({
                    "id": "#endTurn",
                    "action": "show"
                });
            }
            showHide(arr, "ContAttack button pressed.");
        }
    }, false);

    var attackMove = document.getElementById('attackMoveBtn');
    attackMove.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "attack") {
            var move = $('#attackMoveDrop').val();
            map.dataUnits[map.attack.defX][map.attack.defY].units = parseInt(map.dataUnits[map.attack.defX][map.attack.defY].units) + parseInt(move);
            map.dataUnits[map.attack.attX][map.attack.attY].units = parseInt(map.dataUnits[map.attack.attX][map.attack.attY].units) - parseInt(move);
            map.clickState = null;
            map.selected = null;
            updateLog(map.dataProp.users[map.dataProp.turn] + " moved " + parseInt(move) + " units to the defeated hex.")
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            var arr = [{
                "id": "#panel",
                "action": "show"
            }, {
                "id": "#attackMove",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "show"
            }, {
                "id": "#fortifyButton",
                "action": "show"
            }];
            showHide(arr, "Move button pressed.");
            updateLogDisp(hexagonGrid);
        }
    }, false);

    var attackMoveAll = document.getElementById('attackMoveAllBtn');
    attackMoveAll.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "attack") {
            map.dataUnits[map.attack.defX][map.attack.defY].units = parseInt(map.dataUnits[map.attack.attX][map.attack.attY].units);
            map.dataUnits[map.attack.attX][map.attack.attY].units = 1;
            map.clickState = null;
            map.selected = null;
            updateLog(map.dataProp.users[map.dataProp.turn] + " moved " + (map.dataUnits[map.attack.defX][map.attack.defY].units) + " units to the defeated hex.")
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            var arr = [{
                "id": "#panel",
                "action": "show"
            }, {
                "id": "#attackMove",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "show"
            }, {
                "id": "#fortifyButton",
                "action": "show"
            }];
            showHide(arr, "MoveAll button pressed.");
            updateLogDisp(hexagonGrid);
        }
    }, false);

    var fortifyButton = document.getElementById('fortifyButton');
    fortifyButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "attack") {
            var msg = "Choose a territory to move troops from, then click on an adjacent territory to move them to.";
            $('#msg').html(msg);
            map.dataProp.turnPhase = "fortify";
            updateLog("--------------------");
            updateLog("It is now the fortify phase.");
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            ctxUI.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            updateLogDisp(hexagonGrid);
            showPlayers();

            var fortUnitsDisp = document.getElementById('fortUnits').innerHTML;
            fortUnitsDisp = map.dataProp.fortifiesUsed + "/" + map.dataProp.fortifies + " fortifications used.";
            document.getElementById('fortUnits').innerHTML = fortUnitsDisp;
            var arr = [{
                "id": "#fortifyButton",
                "action": "hide"
            }, {
                "id": "#endTurnButton",
                "action": "show"
            }, {
                "id": "#backToAttack",
                "action": "show"
            }];
            showHide(arr, "Fortify Phase button pressed.");
        }
    }, false);

    var backToAttackButton = document.getElementById('backToAttack');
    backToAttackButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "fortify") {
            if (map.dataProp.fortifiesUsed == 0) {
                map.dataProp.turnPhase = "attack";
                ctxUI.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
                map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                var arr = [{
                    "id": "#unitButtons",
                    "action": "hide"
                }, {
                    "id": "#panel",
                    "action": "show"
                }, {
                    "id": "#attack",
                    "action": "hide"
                }, {
                    "id": "#endTurn",
                    "action": "show"
                }, {
                    "id": "#endTurnButton",
                    "action": "hide"
                }, {
                    "id": "#fortifyButton",
                    "action": "show"
                }, {
                    "id": "#backToAttack",
                    "action": "hide"
                }];
                showHide(arr, "compPlc button pressed.");
                updateLogDisp(hexagonGrid);
                showPlayers();
                var msg = document.getElementById('msg').innerHTML;
                msg = "Choose a territory to attack with, then click on an enemy to attack.";
                document.getElementById('msg').innerHTML = msg;
            }
        }
    }, false);

    var transferMaxButton = document.getElementById('transferMaxButton');
    transferMaxButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "fortify") {
            map.dataUnits[map.attack.defX][map.attack.defY].units = parseInt(map.dataUnits[map.attack.defX][map.attack.defY].units) + parseInt(map.dataUnits[map.attack.attX][map.attack.attY].units) - 1;
            map.dataUnits[map.attack.attX][map.attack.attY].units = 1;
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
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            var arr = [{
                "id": "#fortify",
                "action": "hide"
            }, {
                "id": "#endTurnButton",
                "action": "show"
            }, {
                "id": "#backToAttack",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "show"
            }];
            showHide(arr, "Fortify Phase, transferMax button pressed.");
        }
    }, false);

    var transferButton = document.getElementById('transferButton');
    transferButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "fortify") {
            var num = $('#transfer').val();
            num = parseInt(num);
            var tmp = parseInt(map.dataUnits[map.attack.attX][map.attack.attY].units);
            map.dataProp.fortifiesUsed++;
            map.dataUnits[map.attack.defX][map.attack.defY].units = parseInt(map.dataUnits[map.attack.defX][map.attack.defY].units) + num;
            map.dataUnits[map.attack.attX][map.attack.attY].units = tmp - num;
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
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            var arr = [{
                "id": "#fortify",
                "action": "hide"
            }, {
                "id": "#endTurnButton",
                "action": "show"
            }, {
                "id": "#backToAttack",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "show"
            }];
            showHide(arr, "Fortify Phase, transfer button pressed.");
        }
    }, false);

    var endTurnButton = document.getElementById('endTurnButton');
    endTurnButton.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "fortify") {
            if (map.dataProp.fortifiesTemp != 0) { //Reset fortifies value if it was affected by a turnModifier
                map.dataProp.fortifies = map.dataProp.fortifiesTemp;
                map.dataProp.fortifiesTemp = 0;
            }
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
            if (map.dataProp.winCard == true) {
                map.dataProp.cardTicker[map.dataProp.turn].val++;
            }
            if (map.dataProp.cardTicker[map.dataProp.turn].val == 2) {
                map.dataProp.cardTicker[map.dataProp.turn].val = 0;
                drawCard(map.username);
            }

            if (map.dataProp.turn == map.dataProp.owners.length - 1) {
                map.dataProp.turn = 0;
            } else {
                map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
                for (var i = 0; i < map.dataProp.eliminated; i++) {
                    if (map.dataProp.users[map.dataProp.turn] == map.dataProp.eliminated[i]) {
                        if (map.dataProp.turn == map.dataProp.owners.length - 1) {
                            map.dataProp.turn = 0;
                        } else {
                            map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
                        }
                    }
                }
            }
            map.dataProp.winCard = false;
            map.dataProp.turn = calcNextTurn(map.dataProp.turn);
            updateLog("--------------------");
            updateLog("Turn ended.");
            updateLog("--------------------");
            updateLog("It is " + map.dataProp.users[map.dataProp.turn] + "'s turn.");
            updateLog("It is now the unitPlacement phase.");
            updateLog(map.dataProp.users[map.dataProp.turn] + " receives " + units + " units.");
            map.dataProp.fortifiesUsed = 0;
            map.dataProp.turnPhase = "unitPlacement";
            //increment turnModifier bonuses
            for (var i = 0; i < map.dataProp.turnModifiers.length; i++) {
                for (var j = 0; j < map.dataProp.turnModifiers[i].length; j++) {
                    if (map.dataProp.turnModifiers[i][j].type == "offensiveBoost" || map.dataProp.turnModifiers[i][j].type == "increasedMovement") {
                        map.dataProp.turnModifiers[i].splice(j, 1);
                        console.log("removed OffensiveBoost or increasedMovement");
                    } else if ((map.dataProp.turnModifiers[i][j].type == "defensiveBoost" || map.dataProp.turnModifiers[i][j].type == "decreasedMovement") && map.dataProp.turnModifiers[i][j].turnTicker == map.dataProp.turnModifiers[i][j].turns) {
                        map.dataProp.turnModifiers[i].splice(j, 1);
                        console.log("removed defensiveBoost or decreased Movement");
                    } else if ((map.dataProp.turnModifiers[i][j].type == "defensiveBoost" || map.dataProp.turnModifiers[i][j].type == "decreasedMovement") && map.dataProp.turnModifiers[i][j].turnTicker < map.dataProp.turnModifiers[i][j].turns) {
                        map.dataProp.turnModifiers[i][j].turnTicker = map.dataProp.turnModifiers[i][j].turnTicker + 1;
                    }
                }
            }
            console.log("turn:", map.dataProp.turn);
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateAll");
            ctxUI.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            showPlayers();
            updateLogDisp(hexagonGrid);
            var arr = [{
                "id": "#notYourTurn",
                "action": "show"
            }, {
                "id": "#notYourTurnText",
                "action": "show"
            }, {
                "id": "#endTurnButton",
                "action": "hide"
            }, {
                "id": "#msg",
                "action": "hide"
            }, {
                "id": "#fortify",
                "action": "hide"
            }, {
                "id": "#endTurn",
                "action": "hide"
            }, {
                "id": "#backToAttack",
                "action": "hide"
            }];
            showHide(arr, "End turn button pressed.");
        }
    }, false);

    var cardTradeClose = document.getElementById('cardTradeClose');
    cardTradeClose.addEventListener('click', function(e) {
        var arr = [{
            "id": "#cardTrade",
            "action": "hide"
        }, {
            "id": "#cardTradeClose",
            "action": "hide"
        }, {
            "id": "#cardDisp",
            "action": "hide"
        }, {
            "id": "#log",
            "action": "show"
        }];
        showHide(arr, "Card Trade Close button pressed.");
    }, false);

    var cardTrade = document.getElementById('cardTrade');
    cardTrade.addEventListener('click', function(e) {
        if (map.dataProp.users[map.dataProp.turn] == map.username && map.dataProp.turnPhase == "unitPlacement") {
            var checkedValues = $('.cards:checked').map(function() {
                return this.value;
            }).get();
            tradeInCard(checkedValues);
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        }
    }, false);

    if (map.username == "bo_knows") {
        var updateMapBtn = document.getElementById('updateMap');
        updateMapBtn.addEventListener('click', function(e) { //For the map editor
            var cube = toCubeCoord(map.editMap.col, map.editMap.row);
            map.data[map.editMap.row][map.editMap.col].type = $('#type').val();
            map.dataUnits[map.editMap.row][map.editMap.col].owner = $('#owner').val();
            map.dataUnits[map.editMap.row][map.editMap.col].units = $('#unitsEdit').val();
            map.dataUnits[map.editMap.row][map.editMap.col].color = $('#color').val();
            map.data[map.editMap.row][map.editMap.col].group = $('#group').val();
            map.data[map.editMap.row][map.editMap.col].connect = JSON.parse($('#connect').val());
            if ($('#n').val() != "") {
                map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
                var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
                map.data[offset.r][offset.q].s = $('#n').val();
            }
            if ($('#ne').val() != "") {
                map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
                var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
                map.data[offset.r][offset.q].sw = $('#ne').val();
            }
            if ($('#se').val() != "") {
                map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
                var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
                map.data[offset.r][offset.q].nw = $('#se').val();
            }
            if ($('#s').val() != "") {
                map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
                var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
                map.data[offset.r][offset.q].n = $('#s').val();
            }
            if ($('#sw').val() != "") {
                map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
                var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
                map.data[offset.r][offset.q].ne = $('#sw').val();
            }
            if ($('#nw').val() != "") {
                map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
                var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
                map.data[offset.r][offset.q].se = $('#nw').val();
            }
            var data = {
                mapArray: JSON.stringify(map.data),
                mapUnits: JSON.stringify(map.dataUnits),
            };
            updateMap(data, "updateMap");
            map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
            hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);

        }, false);
    }

    //UI - Players List
    function showPlayers() {
        var x0 = hexagonGrid.side * (map.dataProp.cols) + map.canvas.getBoundingClientRect().left + 100;
        var y0 = 65;
        for (var i = 0; i < map.dataProp.colors.length; i++) {
            //Draw hex representing player's color
            var numberOfSides = 6,
                size = hexagonGrid.radius / 2,
                Xcenter = x0,
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
            ctxUI.textBaseline = "left";
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
            if (map.dataProp.cardsHeld[i].length > 0) {
                console.log("has cards!");
                //$('body').append('<button type="button" id="cards' + i + '" style="position:absolute;left:' + (x0 + map.canvas.getBoundingClientRect().left - hexagonGrid.width / 1.5) + 'px;top:' + (y0 + (hexagonGrid.height / 4)) + 'px;height:22px;width:15px;background-color:' + map.dataProp.colors[i] + '""></button>');
                $('body').append('<img src="css/star.png" id="cards' + i + '" style="position:absolute;left:' + (x0 + map.canvas.getBoundingClientRect().left - hexagonGrid.width / 1.25) + 'px;top:' + (y0 + (hexagonGrid.height / 4)) + 'px;height:30px;width:30px;z-index: 1000;">');

            }

            y0 = y0 + hexagonGrid.height / 1.5; //add to Y coordinate for next player
        }
    }
    showPlayers();
    updateLogDisp(hexagonGrid);

    //player card buttons
    var cards0 = document.getElementById('cards0');
    if (cards0 != null) {
        cards0.addEventListener('click', function(e) {
            showCards(0);
        }, false);
    }
    var cards1 = document.getElementById('cards1');
    if (cards1 != null) {
        cards1.addEventListener('click', function(e) {
            showCards(1);
        }, false);
    }
    var cards2 = document.getElementById('cards2');
    if (cards2 != null) {
        cards2.addEventListener('click', function(e) {
            showCards(2);
        }, false);
    }
    var cards3 = document.getElementById('cards3');
    if (cards3 != null) {
        cards3.addEventListener('click', function(e) {
            showCards(3);
        }, false);
    }
    var cards4 = document.getElementById('cards4');
    if (cards4 != null) {
        cards4.addEventListener('click', function(e) {
            showCards(4);
        }, false);
    }
    var cards5 = document.getElementById('cards5');
    if (cards5 != null) {
        cards5.addEventListener('click', function(e) {
            showCards(5);
        }, false);
    }
    var cards6 = document.getElementById('cards6');
    if (cards6 != null) {
        cards6.addEventListener('click', function(e) {
            showCards(6);
        }, false);
    }
    var cards7 = document.getElementById('cards7');
    if (cards7 != null) {
        cards7.addEventListener('click', function(e) {
            showCards(7);
        }, false);
    }
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