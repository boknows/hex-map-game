// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html

//Load map from database
function getMap(){
    return $.ajax({
    url: "getMap.php",
    type: "POST",
    dataType: 'JSON',
    });
};
getMap().done(function(r) {
   if (r) {
		//loadedMap(JSON.parse(r.mapArray), JSON.parse(r.mapProperties)); //call loadedMap(r) if loading a map from DB
		loadedMap();
    } else {
       console.log("No data");
    }
}).fail(function(x) {
   console.log("error");
});

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

function loadedMap(map, mapProperties){
	var hexes = [];
	var username = $('#username').val();
	
	
	if(typeof mapProperties != "undefined" && username == mapProperties.owners[mapProperties.turn]){
		var msg = document.getElementById('msg').innerHTML;
		msg = msg + " It's your turn! " + mapProperties.turnPhase + " stage. ";
		document.getElementById('msg').innerHTML = msg;	
	}

	function HexagonGrid(canvasId, radius) {
		this.radius = radius;
		
		this.height = Math.sqrt(3) * radius;
		this.width = 2 * radius;
		this.side = (3 / 2) * radius;

		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext('2d');

		this.canvasOriginX = 0;
		this.canvasOriginY = 0;
		
		this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
		
		//UI Buttons
		var singleAttackButton = document.getElementById('singleAttack');
		singleAttackButton.addEventListener('click', function (e) {
			singleAttack(map, attack);
			hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
			hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
			
			var drawy2 = attack.attY % 2 == 0 ? (attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (attack.attX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
			var drawx2 = (attack.attY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
			var drawy3 = attack.defY % 2 == 0 ? (attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 : (attack.defX * hexagonGrid.height) + hexagonGrid.canvasOriginY + 6 + (hexagonGrid.height / 2);
			var drawx3 = (attack.defY * hexagonGrid.side) + hexagonGrid.canvasOriginX;
			if(map[attack.attX][attack.attY].units == 1){
			
			}else{
				hexagonGrid.drawHex(drawx2, drawy2 - 6, "", "", true, "#00F2FF", map[attack.attX][attack.attY].owner); //highlight attacker hex
				hexagonGrid.drawHex(drawx3, drawy3 - 6, "", "", true, "#FF0000", map[attack.defX][attack.defY].owner); //highlight defender hex
			} 
		}, false);
		
		var contAttackButton = document.getElementById('continuousAttack');
		contAttackButton.addEventListener('click', function (e) {
			contAttack(map, attack);
			hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
			hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
			$('#controls').hide();
		}, false);
		
		var endTurnButton = document.getElementById('endTurnButton');
		endTurnButton.addEventListener('click', function (e) {
			if(mapProperties.turn == mapProperties.owners.length-1){
				mapProperties.turn = 0;
			}else{
				mapProperties.turn = parseInt(mapProperties.turn) + 1;
			}
			console.log("Now it is " + mapProperties.owners[mapProperties.turn] + "'s turn");
			var data = { data: JSON.stringify(mapProperties) };
			updateMap(data, "mapProperties");
			var data = { data: JSON.stringify(map) };
			updateMap(data, "map");
			$('#endTurn').hide();
		}, false);
		
		var fortifyButton = document.getElementById('fortifyButton');
		fortifyButton.addEventListener('click', function (e) {
			mapProperties.turnPhase = "fortify";
			var data = { data: JSON.stringify(mapProperties) };
			updateMap(data, "mapProperties");
			$('#controls').hide();	
		}, false);	
		
		var transferMaxButton = document.getElementById('transferMaxButton');
		transferMaxButton.addEventListener('click', function (e) {
			map[attack.defX][attack.defY].units = map[attack.defX][attack.defY].units + map[attack.attX][attack.attY].units - 1;
			map[attack.attX][attack.attY].units = 1;
			delete hexes.selectedColumn;
			delete hexes.selectedRow;
			hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
			hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
			$('#fortify').hide();
		}, false);
		
		var moveButton = document.getElementById('transferButton');
		moveButton.addEventListener('click', function (e) {
			var num = $("#transfer").val();
			num = parseInt(num);
			console.log(num);
			var tmpAtt = map[attack.attX][attack.attY].units;
			map[attack.defX][attack.defY].units = map[attack.defX][attack.defY].units + num;
			map[attack.attX][attack.attY].units = tmpAtt - num;
			delete hexes.selectedColumn;
			delete hexes.selectedRow;
			hexagonGrid.context.clearRect(0, 0, hexagonGrid.canvas.width, hexagonGrid.canvas.height);
			hexagonGrid.drawHexGrid(hexagonGrid.rows, hexagonGrid.cols, 10, 10, true);
			$('#fortify').hide();
		}, false);
        
        //setup unit placement select box
        if(mapProperties.turnPhase == "unitPlacement"){
            $("#unitPlacement").show();
            $("#endTurn").hide();
            var units = calcUnits(map, username);
            var unitMenu = document.getElementById('place').innerHTML;
            for(i=1;i<units+1;i++){
                unitMenu = unitMenu + "<option value='" + i + "'>" + i + "</option>";   
            }
            document.getElementById('place').innerHTML = unitMenu;	
        }
	};
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
		console.log(data);
		var data = JSON.stringify(mapProperties);
		console.log(data);
	}
	
	if(mapProperties.owners[mapProperties.turn] != username){ 
		//if it's not a players turn, hide UI elements
		$('#endTurn').hide();
		$('#controls').hide();
		$('#fortify').hide();
	}

	HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
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
				if(map[row][col].type=="land"){
					this.drawHex(currentHexX, currentHexY, "#99CC66", debugText, false, map[row][col].owner);
				}else if(map[row][col].type=="water"){
					this.drawHex(currentHexX, currentHexY, "#3333FF", "", false, map[row][col].owner);
				}else if(map[row][col].type=="grass"){
					this.drawHex(currentHexX, currentHexY, "#009900", debugText, false, map[row][col].owner);
				}else if(map[row][col].type=="desert"){
					this.drawHex(currentHexX, currentHexY, "#F5E8C1", debugText, false, map[row][col].owner);
				}else if(map[row][col].type=="mountains"){
					this.drawHex(currentHexX, currentHexY, "#996600", debugText, false, map[row][col].owner);
				}	
			}
			offsetColumn = !offsetColumn;
		}
		
	};

	HexagonGrid.prototype.drawHexAtColRow = function(column, row, color) {
		var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
		var drawx = (column * this.side) + this.canvasOriginX;

		this.drawHex(drawx, drawy, color, "");
	};

	HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText, highlight, highlightColor, owner) {
		this.context.font="bold 12px Helvetica";
		this.owner = owner;
		
		this.context.strokeStyle = "#000";
		this.context.lineWidth = 1;

		var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
		if(!typeof map[tile.row][tile.column].type =="undefined"){
			if(map[tile.row][tile.column].type=="water"){
				this.context.lineWidth = .1;
			}
		}
		
		//Draw Main Hex
		this.context.beginPath();
		this.context.moveTo(x0 + this.width - this.side, y0);
		this.context.lineTo(x0 + this.side, y0);
		this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
		this.context.lineTo(x0 + this.side, y0 + this.height);
		this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
		this.context.lineTo(x0, y0 + (this.height / 2));
		if (fillColor && highlight == false) {
			this.context.fillStyle = fillColor;
			this.context.fill();
		}
		this.context.closePath();
		this.context.stroke();
		
		if(map[tile.row][tile.column].type != "water"){
			this.context.fillStyle = map[tile.row][tile.column].color;
			
			//Draw Circle inside Hex
			if (highlight == true){
				this.context.strokeStyle = highlightColor;
				this.context.lineWidth = 3;
			}
			this.context.beginPath();
		    this.context.arc(x0 + (this.width/2), y0 + (this.height/2), (this.height/4), 0, 2 * Math.PI, false);
		    this.context.fill();
		    //this.context.lineWidth = 1;
		    //this.context.strokeStyle = '#000000';
		    this.context.stroke();
			
			this.context.textAlign="center"; 
			this.context.textBaseline = "middle";
			this.context.fillStyle = '#FFFFFF';
			this.context.fillText(map[tile.row][tile.column].units, x0 + (this.width / 2) , y0 + (this.height / 2));
		}
	};

	//Recusivly step up to the body to calculate canvas offset.
	HexagonGrid.prototype.getRelativeCanvasOffset = function() {
		var x = 0, y = 0;
		var layoutElement = this.canvas;
		if (layoutElement.offsetParent) {
			do {
				x += layoutElement.offsetLeft;
				y += layoutElement.offsetTop;
			} while (layoutElement = layoutElement.offsetParent);
			
			return { x: x, y: y };
		}
	}

	//Uses a grid overlay algorithm to determine hexagon location
	//Left edge of grid has a test to acuratly determin correct hex
	HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY) {
		var offSet = this.getRelativeCanvasOffset();

		mouseX -= offSet.x;
		mouseY -= offSet.y;

		var column = Math.floor((mouseX) / this.side);
		var row = Math.floor(
			column % 2 == 0
				? Math.floor((mouseY) / this.height)
				: Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);

		//Test if on left side of frame            
		if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {
			//Now test which of the two triangles we are in 
			//Top left triangle points
			var p1 = new Object();
			p1.x = column * this.side;
			p1.y = column % 2 == 0
				? row * this.height
				: (row * this.height) + (this.height / 2);

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

		return  { row: row, column: column };

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

	var hexes = {}; //object stores clicked hexagon
	var attack = {}; //object stores another clicked hexagon only after one is already selected. This is the hexagon the player is attacking.
	var neighbors = [];
	HexagonGrid.prototype.clickEvent = function (e) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		var localX = mouseX - this.canvasOriginX;
		var localY = mouseY - this.canvasOriginY;
		var tile = this.getSelectedTile(localX, localY);
		
		if (tile.column >= 0 && tile.row >= 0) {
			var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (tile.column * this.side) + this.canvasOriginX;
			if(hexes.selectedColumn == tile.column && hexes.selectedRow == tile.row){
				delete hexes.selectedColumn;
				delete hexes.selectedRow;
				delete this.rectX;
				delete this.rectY;
				$('#controls').hide();
				$('#fortify').hide();
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
			}else if(typeof map[tile.row][tile.column] != "undefined"){
				if(map[tile.row][tile.column].type !="water"){
					var cube = toCubeCoord(tile.column, tile.row);
					var trigger = false;
					$('#controls').hide();
					for(i=0;i<neighbors.length;i++){
						if(typeof hexes.selectedRow != "undefined"){
							if(mapProperties.turnPhase != "fortify"){
								if(neighbors[i].x == cube.x && neighbors[i].y == cube.y && neighbors[i].z == cube.z && map[hexes.selectedRow][hexes.selectedColumn].owner != map[tile.row][tile.column].owner){ // If you already have a hex selected, and the next click is a neighbor that is attackable, do this.
									trigger = true;
									var offset = toOffsetCoord(neighbors[i].x,neighbors[i].y,neighbors[i].z);
									var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
									var drawx2 = (offset.q * this.side) + this.canvasOriginX;
									var drawy3 = hexes.selectedColumn % 2 == 0 ? (hexes.selectedRow * this.height) + this.canvasOriginY + 6 : (hexes.selectedRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
									var drawx3 = (hexes.selectedColumn * this.side) + this.canvasOriginX;
									this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
									hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
									this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map[tile.row][tile.column].owner); //highlight attacker hex
									this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map[tile.row][tile.column].owner); //highlight defender hex
									attack.attY = hexes.selectedColumn;
									attack.attX = hexes.selectedRow;
									attack.defY = offset.q;
									attack.defX = offset.r;
								}
							}else if(mapProperties.turnPhase == "fortify"){
								if(neighbors[i].x == cube.x && neighbors[i].y == cube.y && neighbors[i].z == cube.z && map[hexes.selectedRow][hexes.selectedColumn].owner == map[tile.row][tile.column].owner){ // If you already have a hex selected, and the next click is a neighbor that is attackable, do this.
									trigger = true;
									var offset = toOffsetCoord(neighbors[i].x,neighbors[i].y,neighbors[i].z);
									var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
									var drawx2 = (offset.q * this.side) + this.canvasOriginX;
									var drawy3 = hexes.selectedColumn % 2 == 0 ? (hexes.selectedRow * this.height) + this.canvasOriginY + 6 : (hexes.selectedRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
									var drawx3 = (hexes.selectedColumn * this.side) + this.canvasOriginX;
									this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
									hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
									this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map[tile.row][tile.column].owner); //highlight attacker hex
									this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map[tile.row][tile.column].owner); //highlight defender hex
									attack.attY = hexes.selectedColumn;
									attack.attX = hexes.selectedRow;
									attack.defY = offset.q;
									attack.defX = offset.r;
								}
							}
						}						
					}
					if(trigger == true){
						if(mapProperties.turnPhase == "fortify"){
							$('#fortify').show();
							var tran = "";
							
							for(i=1;i<map[hexes.selectedRow][hexes.selectedColumn].units;i++){
								var tran2 = "<option value='" + i + "'>" + i + "</option>";
								tran = tran + tran2;
							}
							console.log(tran);
							document.getElementById('transfer').innerHTML = tran;	
						}else{
							$('#controls').show();
						}
					}
					if(trigger == false && map[tile.row][tile.column].owner == username && mapProperties.owners[mapProperties.turn] == username){ // If you already have a hex selected, and the next click is a isn't neighbor that is attackable, do this.
						hexes.selectedColumn=tile.column;
						hexes.selectedRow=tile.row;
						neighbors = getNeighbors(cube.x,cube.y,cube.z);
						hexes.neighbors = neighbors;
						this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
						hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
						this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map[tile.row][tile.column].owner); //highlight clicked hex
						
						var owner = map[tile.row][tile.column].owner;
						//Get neighbors of clicked hex and highlight them
						var tile = this.getSelectedTile(drawx, drawy - 6);
						for (i=0;i<neighbors.length;i++){
							var offset = toOffsetCoord(neighbors[i].x,neighbors[i].y,neighbors[i].z);
							var drawy = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
							var drawx = (offset.q * this.side) + this.canvasOriginX;
							var tile = this.getSelectedTile(drawx + (this.width/2), drawy-6+(this.height/2));
							if(mapProperties.turnPhase == "fortify"){
								if(tile.row < this.rows && tile.column < this.cols && tile.row >=0 && tile.column >=0 && map[tile.row][tile.column].type != "water" && owner == map[tile.row][tile.column].owner){
									this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map[tile.row][tile.column].owner); //highlight neighboring hexes
								}
							}else{
								if(tile.row < this.rows && tile.column < this.cols && tile.row >=0 && tile.column >=0 && map[tile.row][tile.column].type != "water" && owner != map[tile.row][tile.column].owner){
									this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map[tile.row][tile.column].owner); //highlight neighboring hexes
								}
							}
						}
					}
				}
			}
			
		}
		
		if(localX > this.attRectX && localX < (this.attRectX + this.attRectWidth) && localY > this.attRectY && localY < (this.attRectY + this.attRectHeight)){
			//console.log("attack clicked!");
					
		}
			
	};
	
	HexagonGrid.prototype.drawButtons = function() {
		//Draw Attack Button
		this.context.lineWidth = 4;
		this.context.strokeStyle = "#000000";
		this.context.fillStyle = "#FF0000";
		this.context.textAlign="center"; 
		this.context.textBaseline = "middle";
		this.attRectX = (this.radius*(3/2)*(this.cols+2));
		this.attRectY = 50;
		roundRect(this.context, this.attRectX, this.attRectY, 175, 50, 10, true);
		this.context.font="20px Helvetica";
		this.context.fillStyle = "#000000";
		this.attRectHeight = 50;
		this.attRectWidth = 175;
		this.context.fillText("Single Attack",this.attRectX+(this.attRectWidth/2),this.attRectY+(this.attRectHeight/2));
		
		//Draw Continuous Attack Button
		this.context.lineWidth = 4;
		this.context.strokeStyle = "#000000";
		this.context.fillStyle = "#FFAE00";
		this.context.textAlign="center"; 
		this.context.textBaseline = "middle";
		this.contRectX = (this.radius*(3/2)*(this.cols+2));
		this.contRectY = 105;
		roundRect(this.context, this.contRectX, this.contRectY, 175, 50, 10, true);
		this.context.font="20px Helvetica";
		this.context.fillStyle = "#000000";
		this.contRectHeight = 50;
		this.contRectWidth = 175;
		this.context.fillText("Continuous Attack",this.contRectX+(this.contRectWidth/2),this.contRectY+(this.contRectHeight/2));
	};
	function singleAttack(map, attack) {
		if(map[attack.attX][attack.attY].units > 1){
			var losses = battle(map[attack.attX][attack.attY].units, map[attack.defX][attack.defY].units, "", "");
			map[attack.attX][attack.attY].units = map[attack.attX][attack.attY].units - losses.att;
			map[attack.defX][attack.defY].units = map[attack.defX][attack.defY].units - losses.def;
			
			if(map[attack.defX][attack.defY].units == 0){
				map[attack.defX][attack.defY].units = map[attack.attX][attack.attY].units - 1;
				map[attack.attX][attack.attY].units = 1;
				map[attack.defX][attack.defY].owner = map[attack.attX][attack.attY].owner;
				map[attack.defX][attack.defY].color = map[attack.attX][attack.attY].color;
				$('#controls').hide();
			}
			var data = { data: JSON.stringify(map) };
			updateMap(data, "map");
		}else{
			console.log("Can't attack. Not enough units.");
			$('#controls').hide();
		}
	};
	function contAttack(map, attack) {
		while (map[attack.attX][attack.attY].units > 5){
			if(map[attack.attX][attack.attY].units > 1){
				var losses = battle(map[attack.attX][attack.attY].units, map[attack.defX][attack.defY].units, "", "");
				map[attack.attX][attack.attY].units = map[attack.attX][attack.attY].units - losses.att;
				map[attack.defX][attack.defY].units = map[attack.defX][attack.defY].units - losses.def;
				
				if(map[attack.defX][attack.defY].units == 0){
					map[attack.defX][attack.defY].units = map[attack.attX][attack.attY].units - 1;
					map[attack.attX][attack.attY].units = 1;
					map[attack.defX][attack.defY].owner = map[attack.attX][attack.attY].owner;
					map[attack.defX][attack.defY].color = map[attack.attX][attack.attY].color;
					$('#controls').hide();
				}
				var data = { data: JSON.stringify(map) };
				updateMap(data, "map");
			}else{
				console.log("Can't attack. Not enough units.");
				$('#controls').hide();
			}
		}
	};
	function calcUnits(map, username) {
		//calc raw units for initial units
        var units = 0;
		for(i=0;i<map.length;i++){
            for(j=0;j<map[i].length;j++){
                if(map[i][j].owner == username){
                    units++;   
                }
            }        
		}
		units = Math.floor(units/3); 
		return units;
	};
	var hexagonGrid = new HexagonGrid("HexCanvas", 30);
    hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
	
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
  if (typeof stroke == "undefined" ) {
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
function toCubeCoord (q, r) {
	/**  Function to convert odd-q offset coordinates to cube coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
	* @param {Number} q - the column of the hex
	* @param {Number} r - the row of the hex
	*/
	this.r = r;
	this.q = q;
	var x = this.q
	var z = this.r - (this.q - (this.q&1)) / 2
	var y = -x-z
	var cube = {x: x, y: y, z: z};

	return cube;
}

function toOffsetCoord (x, y, z) {
	/**  Function to convert cube coordinates to odd-q offset coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
	* @param {Number} x - the x cube coord of the hex
	* @param {Number} y - the y cube coord of the hex
	* @param {Number} z - the z cube coord of the hex
	*/
	this.x = x;
	this.y = y;
	this.z = z;
	var q = this.x;
	var r = this.z + (this.x - (this.x&1)) / 2
	var offset = {q: q, r: r};

	return offset;
}

function getNeighbors (x, y, z){
/**  Function to find all neighboring hexes via cube coordinates. Reference: http://www.redblobgames.com/grids/hexagons/
	* @param {Number} x - the x cube coord of the hex
	* @param {Number} y - the y cube coord of the hex
	* @param {Number} z - the z cube coord of the hex
	*/
	this.x = x;
	this.y = y;
	this.z = z;
	var neighbors = [ {x: this.x+1 ,y: this.y-1 ,z: z}, {x: this.x+1 ,y: y,z: this.z-1 }, {x: x ,y: this.y+1 ,z: this.z-1 }, 
					  {x: this.x-1 ,y: this.y+1 ,z: z}, {x: this.x-1 ,y: y,z: this.z+1 }, {x: x ,y: this.y-1 ,z: this.z+1 } ];
	return neighbors;
}

function rollDice () {
	//  Function to simulate rolling a dice. Number 1-6 returned.
	var rand = Math.floor((Math.random() * 6))+1; 
	return rand;
}

function battle(att, def, attTer, defTer){
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
	
	
	if(def>2){ //Defender can roll max 2 dice
		def = 2;
	}
	if(att>3){ //Attacker can roll max 3 dice
		att = 3;
	}else if(att== 3){
		att = 2;
	}else if (att < 3){
		att = 1;
	}
	for(i=0;i<att;i++){
		attArr.push(rollDice());
	}
	attArr.sort(function(a, b){return b-a});
	for(i=0;i<def;i++){
		defArr.push(rollDice());
	}
	defArr.sort(function(a, b){return b-a});
	for(i=0;i<defArr.length;i++){
		if(defArr[i] >= attArr[i]){
			attLoses++;
		}else{
			defLoses++;
		}
	}
	
	var attString = "";
	for(i=0;i<attArr.length;i++){
		attString = attString + attArr[i] + ",";
	}
	var defString = "";
	for(i=0;i<defArr.length;i++){
		defString = defString + defArr[i] + ",";
	}
	attString = attString.slice(0,attString.length-1);
	defString = defString.slice(0,defString.length-1);
	
	var losses = { att: attLoses, def: defLoses };
	console.log("Attacker rolls: [" + attString + "]");
	console.log("Defender rolls: [" + defString + "]");
	console.log("Attacker loses " + attLoses + " units. Defender loses " + defLoses + " units.");
	return losses;
	
}




