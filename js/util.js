function singleAttack(hexagonGrid) {
    if (map.data[map.attack.attX][map.attack.attY].units > 1) {
        var losses = battle(map.data[map.attack.attX][map.attack.attY].units, map.data[map.attack.defX][map.attack.defY].units, "", "", hexagonGrid);
        map.data[map.attack.attX][map.attack.attY].units = map.data[map.attack.attX][map.attack.attY].units - losses.att;
        map.data[map.attack.defX][map.attack.defY].units = map.data[map.attack.defX][map.attack.defY].units - losses.def;

        if (map.data[map.attack.defX][map.attack.defY].units == 0) {
            map.data[map.attack.defX][map.attack.defY].units++;
            map.data[map.attack.attX][map.attack.attY].units--;
            $('#attack').hide();
            if (map.data[map.attack.attX][map.attack.attY].units > 1) {
                $('#attackMove').show();
                var options = "";
                for (i = 1; i < map.data[map.attack.attX][map.attack.attY].units; i++) {
                    options = options + "<option value='" + i + "'>" + i + "</option>";
                }
                document.getElementById('attackMoveDrop').innerHTML = options;
            }

            map.data[map.attack.defX][map.attack.defY].owner = map.data[map.attack.attX][map.attack.attY].owner;
            map.data[map.attack.defX][map.attack.defY].color = map.data[map.attack.attX][map.attack.attY].color;
            //$('#endTurn').hide();
        }
        var data = {
            data: JSON.stringify(map.data)
        };
        updateMap(data, "updateMap");
        var chk = calcEndState(map.email);
        if (chk == true) {
            map.dataProp.turnPhase = "ended";
            var data = {
                data: JSON.stringify(map.dataProp)
            };
            updateMap(data, "updateMapProperties");
            data.param = "update";
            data.gameID = $('#game_id').val();
            data.status = "ended";
            $.ajax({
                url: "changeStatus.php",
                data: data,
                type: "POST",
                dataType: 'JSON'
            });
        }
    } else {
        console.log("Can't attack. Not enough units.");
        $('#attack').hide();
    }
};

function contAttack(hexagonGrid) {
    var defeated = false;
    while (map.data[map.attack.attX][map.attack.attY].units > 4 && map.data[map.attack.defX][map.attack.defY].units > 0) {
        if (map.data[map.attack.attX][map.attack.attY].units > 1) {
            var losses = battle(map.data[map.attack.attX][map.attack.attY].units, map.data[map.attack.defX][map.attack.defY].units, "", "", hexagonGrid);
            map.data[map.attack.attX][map.attack.attY].units = map.data[map.attack.attX][map.attack.attY].units - losses.att;
            map.data[map.attack.defX][map.attack.defY].units = map.data[map.attack.defX][map.attack.defY].units - losses.def;

            if (map.data[map.attack.defX][map.attack.defY].units == 0) { //if =0, defender was defeated
                defeated = true;
                $('#attack').hide();
                map.data[map.attack.defX][map.attack.defY].units++;
                map.data[map.attack.attX][map.attack.attY].units--;
                $('#attackMove').show();
                var options = "";
                for (i = 1; i < map.data[map.attack.attX][map.attack.attY].units; i++) {
                    options = options + "<option value='" + i + "'>" + i + "</option>";
                }
                document.getElementById('attackMoveDrop').innerHTML = options;

                map.data[map.attack.defX][map.attack.defY].owner = map.data[map.attack.attX][map.attack.attY].owner; //switch owners of defending hex to show takeover
                map.data[map.attack.defX][map.attack.defY].color = map.data[map.attack.attX][map.attack.attY].color; //switch color of defending hex to show takeover
                var drawy2 = map.attack.attY % 2 == 0 ? (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
                var drawx2 = (map.attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
                var drawy3 = map.attack.defY % 2 == 0 ? (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
                var drawx3 = (map.attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
                hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
                hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map.data[map.attack.attX][map.attack.attY].owner); //highlight attacker hex
                hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map.data[map.attack.defX][map.attack.defY].owner); //highlight defender hex
                var data = {
                    mapProperties: JSON.stringify(map.dataProp),
                    mapArray: JSON.stringify(map.data),
                    mapLog: JSON.stringify(map.log)
                };
                updateMap(data, "updateAll");
                break;
            } else {
                hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
                hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
            }
            var data = {
                mapProperties: JSON.stringify(map.dataProp),
                mapArray: JSON.stringify(map.data),
                mapLog: JSON.stringify(map.log)
            };
            updateMap(data, "updateAll");
            var chk = calcEndState(map.email);
            if (chk == true) {
                map.dataProp.turnPhase = "ended";
                updateLog("The game has ended. " + map.dataProp.users[map.dataProp.turn] + " has won.")
                var data = {
                    data: JSON.stringify(map.dataProp)
                };
                updateMap(data, "updateMapProperties");
                data.param = "update";
                data.gameID = $('#game_id').val();
                data.status = "ended";
                $.ajax({
                    url: "changeStatus.php",
                    data: data,
                    type: "POST",
                    dataType: 'JSON'
                });
                var data = {
                    data: JSON.stringify(map.log)
                };
                updateMap(data, "updateMapLog");
            }
        } else {
            console.log("Can't attack. Not enough units.");
        }
    }
    var data = {
        data: JSON.stringify(map.data)
    };
    updateMap(data, "updateMap");
};

function calcUnits(username) {
    //calc raw units for initial units
    var units = 0;
    for (i = 0; i < map.data.length; i++) {
        for (j = 0; j < map.data[i].length; j++) {
            if (map.data[i][j].owner == username) {
                units++;
            }
        }
    }
    units = Math.floor(units / 3);

    //Calculate Bonuses - Make it more dynamic in the future
    var bonus = [0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < map.data.length; i++) {
        for (j = 0; j < map.data[i].length; j++) {
            if (map.data[i][j].owner == username) {
                bonus[map.data[i][j].group]++;
            }
        }
    }
    if (bonus[1] == 9) {
        units = units + 5;
    }
    if (bonus[2] == 4) {
        units = units + 2;
    }
    if (bonus[3] == 7) {
        units = units + 5;
    }
    if (bonus[4] == 6) {
        units = units + 3;
    }
    if (bonus[5] == 10) {
        units = units + 7;
    }
    if (bonus[6] == 4) {
        units = units + 2;
    }

    if (units < 3) {
        units = 3;
    }
    return units;
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

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

function getNeighbors(x, y, z) {
    /**  Function to find all neighboring hexes via cube coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
     * @param {Number} x - the x cube coord of the hex
     * @param {Number} y - the y cube coord of the hex
     * @param {Number} z - the z cube coord of the hex
     */
    this.x = x;
    this.y = y;
    this.z = z;
    var neighbors = [{
        x: this.x + 1,
        y: this.y - 1,
        z: z
    }, {
        x: this.x + 1,
        y: y,
        z: this.z - 1
    }, {
        x: x,
        y: this.y + 1,
        z: this.z - 1
    }, {
        x: this.x - 1,
        y: this.y + 1,
        z: z
    }, {
        x: this.x - 1,
        y: y,
        z: this.z + 1
    }, {
        x: x,
        y: this.y - 1,
        z: this.z + 1
    }];
    var chk = toOffsetCoord(x, y, z);
    if (typeof(map.data[chk.r][chk.q].connect) != "undefined" || map.data[chk.r][chk.q].connect != "") {
        for (i = 0; i < map.data[chk.r][chk.q].connect.length; i++) {
            var tmp = toCubeCoord(map.data[chk.r][chk.q].connect[i].col, map.data[chk.r][chk.q].connect[i].row);
            neighbors.push(tmp);
        }
    }
    return neighbors;
}

function rollDice() {
    //  Function to simulate rolling a dice. Number 1-6 returned.
    var rand = Math.floor((Math.random() * 6)) + 1;
    return rand;
}

function battle(att, def, attTer, defTer, hexagonGrid) {
    /**  Function to simulate battle between two armies. 
     * @param {Number} att - number of attacking armies
     * @param {Number} def - number of defending armies
     * @param {Text} attTer - terrain type of attacker, for purposes of modifiers
     * @param {Text} defTer - terrain type of defender, for purposes of modifiers
     */
    var attArr = []; //Array of attackers rolls
    var defArr = []; //Array of defenders 
    var attLoses = 0;
    var defLoses = 0;


    if (def > 2) { //Defender can roll max 2 dice
        def = 2;
    }
    if (att > 3) { //Attacker can roll max 3 dice
        att = 3;
    } else if (att == 3) {
        att = 2;
    } else if (att < 3) {
        att = 1;
    }
    for (i = 0; i < att; i++) {
        attArr.push(rollDice());
    }
    attArr.sort(function(a, b) {
        return b - a
    });
    for (i = 0; i < def; i++) {
        defArr.push(rollDice());
    }
    defArr.sort(function(a, b) {
        return b - a
    });
    for (i = 0; i < defArr.length; i++) {
        if (defArr[i] >= attArr[i]) {
            attLoses++;
        } else {
            defLoses++;
        }
    }

    var attString = "";
    for (i = 0; i < attArr.length; i++) {
        attString = attString + attArr[i] + ",";
    }
    var defString = "";
    for (i = 0; i < defArr.length; i++) {
        defString = defString + defArr[i] + ",";
    }
    var attString = "Attacker rolls: [" + attString.slice(0, attString.length - 1) + "]";
    var defString = "Defender rolls: [" + defString.slice(0, defString.length - 1) + "]";
    var resultString = "Attacker loses " + attLoses + " units. Defender loses " + defLoses + " units.";
    updateLog("--------------------");
    updateLog(attString);
    updateLog(defString);
    updateLog(resultString);
    updateLogDisp(hexagonGrid);

    console.log(resultString);
    var losses = {
        att: attLoses,
        def: defLoses
    };

    return losses;
}

function cloneArr(arr) {
    var clone = new Array(10);
    for (var i = 0; i < clone.length; i++) {
        clone[i] = new Array(20);
    }
    for (i = 0, leni = arr.length; i < leni; i++) {
        for (j = 0, lenj = arr[i].length; j < lenj; j++) {
            clone[i][j] = {
                color: arr[i][j].color,
                owner: arr[i][j].owner,
                type: arr[i][j].type,
                units: arr[i][j].units
            };
        }
    }
    return clone;
}

function getDirection(x1, x2, y1, y2, z1, z2) {
    var delX = 0;
    var delY = 0;
    var delZ = 0;
    delX = x1 - x2;
    delY = y1 - y2;
    delZ = z1 - z2;
    var direction = "";
    if (delX == 0 && delY == 1 && delZ == -1) {
        return "n";
    }
    if (delX == 1 && delY == 0 && delZ == -1) {
        return "ne";
    }
    if (delX == 1 && delY == -1 && delZ == 0) {
        return "se";
    }
    if (delX == 0 && delY == -1 && delZ == 1) {
        return "s";
    }
    if (delX == -1 && delY == 0 && delZ == 1) {
        return "sw";
    }
    if (delX == -1 && delY == 1 && delZ == 0) {
        return "nw";
    }
}

function calcEndState(username) {
    var countries = 0;
    for (i = 0; i < map.data.length; i++) {
        for (j = 0; j < map.data[i].length; j++) {
            if (map.data[i][j].type != "water") {
                countries++;
            }
        }
    }
    var occupied = 0;
    for (i = 0; i < map.data.length; i++) {
        for (j = 0; j < map.data[i].length; j++) {
            if (map.data[i][j].owner == username) {
                occupied++;
            }
        }
    }
    if ((countries - occupied) == 0) {
        return true;
    } else {
        return false;
    }

}

function compareMap(map) {
    var preMap = new Map();
    preMap.getData(function(preMap_data) {
        preMap.data = JSON.parse(preMap_data.mapArray);
        var cmpArr = [];
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j].units != preMap.data[i][j].units) {
                    var unitChgNum = map[i][j].units - preMap.data[i][j].units;
                    cmpArr.push({
                        col: j,
                        row: i,
                        unitChg: unitChgNum
                    });
                }
            }
        }
        console.log(cmpArr);
    });
}

function updateLog(msg) {
	var time = new Date().getTime();
    map.log.push({time: time, msg: msg});
}

function updateLogDisp(hexagonGrid) {
    //Calc player list length to determine start point of msg log
    var x0 = hexagonGrid.width * (map.dataProp.cols) + hexagonGrid.canvasOriginX;
    var y0 = 25 + ((hexagonGrid.height / 1.5) * map.dataProp.owners.length) + hexagonGrid.canvasOriginY + 20;
    var style = {
        left: x0,
        top: y0,
        position: "absolute",
        'font-size': '75%'
    };

    $("#log").css(style);

    var msg = document.getElementById('log').innerHTML;
    for (var i = 0; i < map.log.length; i++) {
		var date = new Date(map.log[i].time);
        msg = msg + "\n[" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + map.log[i].msg;
    }
    document.getElementById('log').innerHTML = msg;
    var msgSc = document.getElementById('log');
    msgSc.scrollTop = msgSc.scrollHeight;
}