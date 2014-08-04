// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
var Map = function(){
    var mapData;
    this.data = null;
    this.attack = {attX: null, attY: null, defX: null, defY: null};
    this.hexes = {selectedX: null, selectedY: null, neighbors: null};
	this.unitPlacement = [];
	this.neighbors = {};
    this.dataPrev = null;
	this.username = "bo_knows";
    this.unitCnt = 0;
	this.ctx = null;
	this.canvas = null;
    this.getData = function(callback){
        $.ajax({
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON', 
			data: { id: $('#game_id').val() },
        }).success(callback);
    };
};

function updateMap(data, param){
	if(param == "map"){
		$.ajax({
		url: "updateMap.php",
		data: data,
		type: "POST",
		dataType: 'JSON'
		});
	}else if(param == "mapProperties"){
		$.ajax({
		url: "updateMapProps.php",
		data: data,
		type: "POST",
		dataType: 'JSON'
		});
	}
};

var map = new Map();
map.getData(function(map_data){
    map.data = JSON.parse(map_data.mapArray);
    map.dataPrev = JSON.parse(map_data.mapArray);
    map.dataProp = JSON.parse(map_data.mapProperties);

    var hexagonGrid = new HexagonGrid("HexCanvas", 30);
    hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
	
	if(map.dataProp.turnPhase == "unitPlacement"){
		$('#controls').hide();
		$('#endTurn').hide();
		$('#fortify').hide();
		$('#unitButtons').show();	
	}
	
	//UI Buttons
	var singleAttackButton = document.getElementById('singleAttack');
	singleAttackButton.addEventListener('click', function (e) {
		singleAttack();
		hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
		hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
		
		var drawy2 = map.attack.attY % 2 == 0 ? (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
		var drawx2 = (map.attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
		var drawy3 = map.attack.defY % 2 == 0 ? (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (map.attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
		var drawx3 = (map.attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
		if(map.data[map.attack.attX][map.attack.attY].units == 1){
		
		}else{
			hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map.data[map.attack.attX][map.attack.attY].owner); //highlight attacker hex
			hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map.data[map.attack.defX][map.attack.defY].owner); //highlight defender hex
		} 
	}, false);
	
	var contAttackButton = document.getElementById('continuousAttack');
	contAttackButton.addEventListener('click', function (e) {
		contAttack();
		hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
		hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
		
        $('#controls').hide();
        $('#controls').hide();
	}, false);
	
	var endTurnButton = document.getElementById('endTurnButton');
	endTurnButton.addEventListener('click', function (e) {
		//turned off for testing
		/*if(map.dataProp.turn == map.dataProp.owners.length-1){
			map.dataProp.turn = 0;
		}else{
			map.dataProp.turn = parseInt(map.dataProp.turn) + 1;
		} */ 
		map.dataProp.turnPhase = "unitPlacement";
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "mapProperties");
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "map");
		$('#endTurn').hide();
        $('#controls').hide();
        $('#fortify').hide();
        updateMsg();
	}, false);
	
	var fortifyButton = document.getElementById('fortifyButton');
	fortifyButton.addEventListener('click', function (e) {
		map.dataProp.turnPhase = "fortify";
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "mapProperties");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
		$('#controls').hide();
        $('#fortify').hide();
        updateMsg();
	}, false);	
	
	var transferMaxButton = document.getElementById('transferMaxButton');
	transferMaxButton.addEventListener('click', function (e) {
		map.data[map.attack.defX][map.attack.defY].units = map.data[map.attack.defX][map.attack.defY].units + map.data[map.attack.attX][map.attack.attY].units - 1;
		map.data[map.attack.attX][map.attack.attY].units = 1;
		delete map.hexes.selectedColumn;
		delete map.hexes.selectedRow;
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "map");
		$('#fortify').hide();
	}, false);
	
	var transferButton = document.getElementById('transferButton');
	transferButton.addEventListener('click', function (e) {
		var num = $('#transfer').val();
		num = parseInt(num);
		var tmp = map.data[map.attack.attX][map.attack.attY].units;
		map.data[map.attack.defX][map.attack.defY].units = map.data[map.attack.defX][map.attack.defY].units + num;
		map.data[map.attack.attX][map.attack.attY].units = tmp - num;
		delete map.hexes.selectedColumn;
		delete map.hexes.selectedRow;
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
		var data = { data: JSON.stringify(map.data) };
		updateMap(data, "map");
		$('#fortify').hide();
	}, false);
    
    var undoAll = document.getElementById('undoAll');
	undoAll.addEventListener('click', function (e) {
        map.unitCnt = 0;
        updateMsg();
        var cln = cloneArr(map.dataPrev);
        map.data = null;
        map.data = cln;
        map.unitPlacement = null;
        map.unitPlacement = [];
		map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
	}, false);
    
    var compPlc = document.getElementById('compPlc');
	compPlc.addEventListener('click', function (e) {
        map.dataProp.turnPhase = "attack";
		var data = { data: JSON.stringify(map.dataProp) };
		updateMap(data, "mapProperties");
        var data = { data: JSON.stringify(map.data) };
		updateMap(data, "map");
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
		hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
        $('#unitButtons').hide();
        $('#endTurn').show();
        updateMsg();
	}, false);
    
    function updateMsg(){
        var msg = document.getElementById('msg').innerHTML;
        msg = "It's the " + map.dataProp.turnPhase + " stage. ";
        document.getElementById('msg').innerHTML = msg;	

        var msgA = null;
        if(map.dataProp.turnPhase == "unitPlacement"){
            var msg = document.getElementById('msg').innerHTML;
            var units = calcUnits("bo_knows");
            msg = msg + "<br>" + map.unitCnt + " / " + units + " units placed.";
            document.getElementById('msg').innerHTML = msg;
        }
    }
    updateMsg();
    
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

//if(mapProperties.owners[mapProperties.turn] != username){ 
	//if it's not a players turn, hide UI elements
//	$('#endTurn').hide();
//	$('#controls').hide();
//	$('#fortify').hide();
//}