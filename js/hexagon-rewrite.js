// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
var Map = function(){
    var mapData;
    this.data = null;
    this.attack = {attX: null, attY: null, defX: null, defY: null};
    this.selected = {col: null, row: null, nCol: null, nRow: null};
	this.unitPlacement = [];
	this.clickState = null;
	this.neighbors = [];
	this.username = $('#username').val();
	this.email = $('#email').val();
    this.unitCnt = 0;
	this.ctx = null;
	this.canvas = null;
    this.getData = function(callback){
        $.ajax({
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON', 
			data: { param: "getAll", gameID: $('#game_id').val(), email: $('#email').val() },
        }).success(callback);
    };
};

function updateMap(data, param){
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
    hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 160, 10, true);
	if(map.dataProp.turnPhase == "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email){
		$('#unitButtons').show();	
		$('#attack').hide();
		$('#endTurn').hide();
	}else if (map.dataProp.turnPhase != "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email){
		$('#attack').hide();
	}
	if(map.dataProp.owners[map.dataProp.turn] != map.email){
		$('#panel').hide();
	}
	
	//UI Buttons
	var singleAttackButton = document.getElementById('singleAttack');
	singleAttackButton.addEventListener('click', function (e) {
		singleAttack();
		hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
		hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		var drawy2 = map.attack.attY % 2 == 0 ? (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
		var drawx2 = (map.attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
		var drawy3 = map.attack.defY % 2 == 0 ? (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
		var drawx3 = (map.attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
		if(map.data[map.attack.attX][map.attack.attY].units == 1){
			$('#attack').hide();
		}else{
			hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map.data[map.attack.attX][map.attack.attY].owner); //highlight attacker hex
			hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map.data[map.attack.defX][map.attack.defY].owner); //highlight defender hex
		} 
		var data = {mapProperties: JSON.stringify(map.dataProp), mapArray: JSON.stringify(map.data), mapLog: JSON.stringify(map.log)};
		updateMap(data, "updateAll");
		updateLogDisp();
	}, false);
	
	var contAttackButton = document.getElementById('continuousAttack');
	contAttackButton.addEventListener('click', function (e) {
		contAttack(hexagonGrid);
	}, false);
	
	var endTurnButton = document.getElementById('endTurnButton');
	endTurnButton.addEventListener('click', function (e) {
		if(map.dataProp.turn == map.dataProp.owners.length-1){
			map.dataProp.turn = 0;
		}else{
			map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
		}  
		updateLog("It is now the unitPlacement phase.");
		map.dataProp.fortifiesUsed = 0;
		map.dataProp.turnPhase = "unitPlacement";
		var data = {mapProperties: JSON.stringify(map.dataProp), mapArray: JSON.stringify(map.data), mapLog: JSON.stringify(map.log)};
		updateMap(data, "updateAll");
		$('#panel').hide();
		showPlayers();
        updateLogDisp();
	}, false);
	
	var fortifyButton = document.getElementById('fortifyButton');
	fortifyButton.addEventListener('click', function (e) {
		map.dataProp.turnPhase = "fortify";
		updateLog("It is now the fortify phase.");
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "updateMapProperties");
		var data = { data: JSON.stringify(map.log) };
		updateMap(data, "updateMapLog");
		ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
        updateLog();
        showPlayers();
	}, false);	
	
	var transferMaxButton = document.getElementById('transferMaxButton');
	transferMaxButton.addEventListener('click', function (e) {
		map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + parseInt(map.data[map.attack.attX][map.attack.attY].units) - 1;
		map.data[map.attack.attX][map.attack.attY].units = 1;
		map.dataProp.fortifiesUsed++;
        map.selected = null;
		map.clickState = null;
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "updateMap");
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "updateMapProperties");
		$('#fortify').hide();
		//Update Text on Unit Placement HTML
		var msg = document.getElementById('log').innerHTML;
		msg = map.dataProp.fortifiesUsed + " / " + map.dataProp.fortifies + " fortifies used.";
		document.getElementById('log').innerHTML = msg;

	}, false);
	
	var transferButton = document.getElementById('transferButton');
	transferButton.addEventListener('click', function (e) {
		var num = $('#transfer').val();
		num = parseInt(num);
		var tmp = parseInt(map.data[map.attack.attX][map.attack.attY].units);
		map.dataProp.fortifiesUsed++;
		map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + num;
		map.data[map.attack.attX][map.attack.attY].units = tmp - num;
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		map.selected = null;
		map.clickState = null;
		$('#fortify').hide();
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "updateMap");
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "updateMapProperties");
		//Update Text on Unit Placement HTML
		var msg = document.getElementById('log').innerHTML;
		msg = map.dataProp.fortifiesUsed + " / " + map.dataProp.fortifies + " fortifies used.";
		document.getElementById('log').innerHTML = msg;
	}, false);
    
    var undoAll = document.getElementById('undoAll');
	undoAll.addEventListener('click', function (e) {
        map.unitCnt = 0;
        var msg = document.getElementById('log').innerHTML;
		var units = calcUnits(map.email);
		msg = map.unitCnt + " / " + units + " units placed.";
		document.getElementById('log').innerHTML = msg;
		for(i=0;i<map.unitPlacement.length;i++){
			map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].units--;
		}	
        map.unitPlacement = null;
        map.unitPlacement = [];
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
	}, false);
	
	var undoLast = document.getElementById('undoLast');
	undoLast.addEventListener('click', function (e) {
		map.data[map.unitPlacement[map.unitPlacement.length-1].row][map.unitPlacement[map.unitPlacement.length-1].col].units--;
		map.unitPlacement.pop();
		map.unitCnt--;
		var msg = document.getElementById('log').innerHTML;
		var units = calcUnits(map.email);
		msg = map.unitCnt + " / " + units + " units placed.";
		document.getElementById('log').innerHTML = msg;
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
	}, false);
    
    var compPlc = document.getElementById('compPlc');
	compPlc.addEventListener('click', function (e) {
        compareMap(map.data);
        map.dataProp.turnPhase = "attack";
        updateLog("It is now the attack phase.");
		var data = {mapProperties: JSON.stringify(map.dataProp), mapArray: JSON.stringify(map.data), mapLog: JSON.stringify(map.log)};
		updateMap(data, "updateAll");
        ctxUI.clearRect(0, 0, map.canvas.width, map.canvas.height);
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		$('#unitButtons').hide();
        $('#panel').show();
		$('#attack').hide();
		updateLogDisp();
		showPlayers();
	}, false);
    
    var updateMapBtn = document.getElementById('updateMap');
	updateMapBtn.addEventListener('click', function (e) {
        var cube = toCubeCoord(map.selected.selCol, map.selected.selRow);
		map.data[map.selected.selRow][map.selected.selCol].type = $('#type').val();
        map.data[map.selected.selRow][map.selected.selCol].owner = $('#owner').val();
        map.data[map.selected.selRow][map.selected.selCol].units = $('#units').val();
        map.data[map.selected.selRow][map.selected.selCol].color = $('#color').val();
		map.data[map.selected.selRow][map.selected.selCol].group = $('#group').val();
		map.data[map.selected.selRow][map.selected.selCol].connect = JSON.parse($('#connect').val());
        if($('#n').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].n = $('#n').val();
            var offset = toOffsetCoord(cube.x, cube.y+1, cube.z-1);
            map.data[offset.r][offset.q].s = $('#n').val(); 
        }
        if($('#ne').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].ne = $('#ne').val();
            var offset = toOffsetCoord(cube.x+1, cube.y, cube.z-1);
            map.data[offset.r][offset.q].sw = $('#ne').val();
        }
        if($('#se').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].se = $('#se').val();
            var offset = toOffsetCoord(cube.x+1, cube.y-1, cube.z);
            map.data[offset.r][offset.q].nw = $('#se').val();
        }
        if($('#s').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].s = $('#s').val();
            var offset = toOffsetCoord(cube.x, cube.y-1, cube.z+1);
            map.data[offset.r][offset.q].n = $('#s').val();
        }
        if($('#sw').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].sw = $('#sw').val();
            var offset = toOffsetCoord(cube.x-1, cube.y, cube.z+1);
            map.data[offset.r][offset.q].ne = $('#sw').val();
        }
        if($('#nw').val() != ""){
            map.data[map.selected.selRow][map.selected.selCol].nw = $('#nw').val();
            var offset = toOffsetCoord(cube.x-1, cube.y+1, cube.z);
            map.data[offset.r][offset.q].se = $('#nw').val();
        }
        var data = { data: JSON.stringify(map.data) };
		updateMap(data, "updateMap");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
	}, false); 
	
	var attackMove = document.getElementById('attackMoveBtn');
	attackMove.addEventListener('click', function (e) {
		var move = $('#attackMoveDrop').val();
		map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.defX][map.attack.defY].units) + parseInt(move);
		map.data[map.attack.attX][map.attack.attY].units = parseInt(map.data[map.attack.attX][map.attack.attY].units) - parseInt(move);
		map.clickState = null;
		map.selected = null;
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "updateMap");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		$('#panel').show();
		$('#attackMove').hide();
		$('#endTurn').show();
	}, false);
	
    var attackMoveAll = document.getElementById('attackMoveAllBtn');
	attackMoveAll.addEventListener('click', function (e) {
		map.data[map.attack.defX][map.attack.defY].units = parseInt(map.data[map.attack.attX][map.attack.attY].units) - 1;
		map.data[map.attack.attX][map.attack.attY].units = 1;
		map.clickState = null;
		map.selected = null;
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "updateMap");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
		$('#panel').show();
		$('#attackMove').hide();
		$('#endTurn').show();
	}, false);
	
	//UI - Players List
	function showPlayers(){
		var x0 = hexagonGrid.width*(map.dataProp.cols);
		var y0 = 25;
		for(var i =0;i<map.dataProp.colors.length;i++){
			//Draw hex representing player's color
			var numberOfSides = 6, size = hexagonGrid.radius/2, Xcenter = x0 + (hexagonGrid.width / 2), Ycenter = y0 + (hexagonGrid.height / 2);
			ctxUI.strokeStyle = map.dataProp.colors[i];
			ctxUI.beginPath();
			ctxUI.lineWidth = 1.5;
			ctxUI.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
			for (var j = 1; j <= numberOfSides;j += 1) {
				ctxUI.lineTo (Xcenter + size * Math.cos(j * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(j * 2 * Math.PI / numberOfSides));
			}
			ctxUI.fillStyle = map.dataProp.colors[i];
			ctxUI.fill();
			ctxUI.closePath();
			ctxUI.stroke();
			
			//Draw text with player name
			ctxUI.textAlign="left"; 
			if(map.dataProp.turn == i){
				ctxUI.font = 'bold 13pt Arial';
			}else{
				ctxUI.font = '13pt Arial';
			}
			ctxUI.fillStyle = "#000000";
			if(map.dataProp.users[map.dataProp.turn] == map.dataProp.users[i]){
				ctxUI.fillText(map.dataProp.users[i] + " [" + map.dataProp.turnPhase + " phase]", x0 + hexagonGrid.width/1.2, y0 + (hexagonGrid.height/1.75) );
			}else{
				ctxUI.fillText(map.dataProp.users[i], x0 + hexagonGrid.width/1.2, y0 + (hexagonGrid.height/1.75) );
			}
			ctxUI.fillStyle = "";
			
			y0 = y0 + hexagonGrid.height/1.5;	
		}
	}
	showPlayers();
    function updateLogDisp(){
    	//Calc player list length to determine start point of msg log
    	var x0 = hexagonGrid.width*(map.dataProp.cols)+hexagonGrid.canvasOriginX;
		var y0 = 25 + ((hexagonGrid.height/1.5)*map.dataProp.owners.length) + hexagonGrid.canvasOriginY + 20;
		var style = {left: x0, top: y0, position: "absolute", 'font-size': '75%'};
		
    	$("#log").css(style);
    	
        var msg = document.getElementById('log').innerHTML;
        
        //msg = "It's the " + map.dataProp.turnPhase + " stage. ";
        if(map.dataProp.owners[map.dataProp.turn] == map.email){
            if(map.dataProp.turnPhase == "attack"){
                msg = "It's the " + map.dataProp.turnPhase + " stage.<br>Please click on a country to attack with.";
            }else if(map.dataProp.turnPhase == "fortify"){
                msg = "It's the " + map.dataProp.turnPhase + " stage.<br>Please click on a country to move units from.";
            }
            if(map.dataProp.turnPhase == "unitPlacement" && map.dataProp.owners[map.dataProp.turn] == map.email){
                var msg = document.getElementById('log').innerHTML;
                var units = calcUnits(map.email);
                msg = msg + "<br>" + map.unitCnt + " / " + units + " units placed.";
                document.getElementById('log').innerHTML = msg;
            }
            if(map.dataProp.turnPhase == "fortify" && map.dataProp.owners[map.dataProp.turn] == map.email){
                var msg = document.getElementById('log').innerHTML;
                msg = msg + "<br>" + map.dataProp.fortifiesUsed + " / " + map.dataProp.fortifies + " fortifies used.";
                document.getElementById('log').innerHTML = msg;
            }
	        for(var i = 0; i<map.log.length; i++){
	    		msg = msg + "\n" + map.log[i]
	    	}
            document.getElementById('log').innerHTML = msg;	

        }else if(map.dataProp.owners[map.dataProp.turn] != map.email){
			var msg = document.getElementById('log').innerHTML;
			msg = msg + "<br>It is " + map.dataProp.owners[map.dataProp.turn] + "'s turn.";
            document.getElementById('log').innerHTML = msg;
		}
		var msgSc = document.getElementById('log');
        msgSc.scrollTop = msgSc.scrollHeight;
    }
    updateLogDisp();
    
    
});

/*
//Create Random Map if not loading from DB
if(typeof map == "undefined"){
	var mapProperties = { owners: new Array("bo_knows", "Marlon"), colors: new Array("Orange", "Purple"), turn: 0 };
	var map = new Array(10);
	var types = ["land", "grass", "mountains", "desert"];

	for (var i=0; i<map.length; i++){
		map[i] = new Array(20);
	}
	for (var i=0; i<map.length; i++){
		for (var j=0; j<map[i].length; j++){
			var land = Math.random()<.8;
			if(land == true){
				var rand = Math.floor((Math.random() * 4)); 
				var own = Math.floor((Math.random() * 2)); 
				map[i][j] = { type: types[rand], owner: mapProperties.owners[own], units: 10, color: mapProperties.colors[own] };
			}else if(land == false){
				map[i][j] = { type: "water" };
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