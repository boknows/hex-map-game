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
       loadedMap(); //call loadedMap(r) if loading a map from DB
    } else {
       console.log("No data");
    }
}).fail(function(x) {
    console.log("error");
});

function loadedMap(map){
    
	var hexes = [];

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
	};
	//Create Random Map if not loading from DB
	if(typeof map == "undefined"){
		var map = new Array(10);
		var types = ["land", "grass", "mountains", "desert"];
		for (var i=0; i<map.length; i++){
			map[i] = new Array(20);
		}
		for (var i=0; i<map.length; i++){
			for (var j=0; j<map[i].length; j++){
				var land = Math.random()<.8;
				if(land == true){
					var rand = Math.floor((Math.random() * 3)); 
					map[i][j] = { type: types[rand] };
				}else if(land == false){
					map[i][j] = { type: "water" };
				}
			}
		}
	}
	//convert properties to JSON for database storage
	var data = JSON.stringify(map);

	HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
		this.canvasOriginX = originX;
		this.canvasOriginY = originY;
		this.rows = rows;
		this.cols = cols;
		var currentHexX;
		var currentHexY;
		var debugText = "";
		this.context.fillRect(10,10,1,1); // fill in the pixel at (10,10)
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
				console.log("currentHexX: " + currentHexX + " currentHexY: " + currentHexY);
				if(map[row][col].type=="land"){
					this.drawHex(currentHexX, currentHexY, "#99CC66", debugText, false);
				}else if(map[row][col].type=="water"){
					this.drawHex(currentHexX, currentHexY, "#3333FF", "", false);
				}else if(map[row][col].type=="grass"){
					this.drawHex(currentHexX, currentHexY, "#009900", debugText, false);
				}else if(map[row][col].type=="desert"){
					this.drawHex(currentHexX, currentHexY, "#FFCC33", debugText, false);
				}else if(map[row][col].type=="mountains"){
					this.drawHex(currentHexX, currentHexY, "#996600", debugText, false);
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

	HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText, highlight) {
		if (highlight == true){
			this.context.strokeStyle = "#00F2FF";
			this.context.lineWidth = 3;
		}else{
			this.context.strokeStyle = "#000";
			this.context.lineWidth = 2;
		}
		var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
		if(map[tile.row][tile.column].type=="water"){
			this.context.lineWidth = .1;
		}
		
	
		
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

		if (debugText) {
			this.context.font = "8px";
			this.context.fillStyle = "#000";
			
			if(debugText < 10){
				//this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/10), y0 + (this.height / 2) + (this.height / 7));
				//this.context.fillText(debugText, x0 + (this.width / 2), y0 + (this.height/2));
				this.context.fillRect(x0 + (this.width / 2),y0 + (this.height/2),1,1); // fill in the pixel at (10,10)
				this.context.beginPath();
				this.context.arc(x0 + (this.width / 2), y0 + (this.height/2), 10, 0, 2 * Math.PI, false); //playing with circles
				this.context.fillStyle = '#FFFFFF';
				this.context.fill();
				this.context.lineWidth = 1;
				this.context.strokeStyle = '#003300';
				this.context.stroke();
			}else if(debugText < 100){
				this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/4.5), y0 + (this.height / 2) + (this.height / 7));
			}else{
				this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/3.25), y0 + (this.height / 2) + (this.height / 7));
			}
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

	//TODO: Replace with optimized barycentric coordinate method
	HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
		var b1, b2, b3;
		b1 = this.sign(pt, v1, v2) < 0.0;
		b2 = this.sign(pt, v2, v3) < 0.0;
		b3 = this.sign(pt, v3, v1) < 0.0;
		return ((b1 == b2) && (b2 == b3));
	};

	var hexes = {};
	HexagonGrid.prototype.clickEvent = function (e) {
		
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		var localX = mouseX - this.canvasOriginX;
		var localY = mouseY - this.canvasOriginY;
		var tile = this.getSelectedTile(localX, localY);
		    console.log("X:" + mouseX + " Y:" + mouseY);

		if (tile.column >= 0 && tile.row >= 0) {
			var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (tile.column * this.side) + this.canvasOriginX;
			console.log("Row: " + tile.row + " Col:" + tile.column);

			if(hexes.selectedColumn == tile.column && hexes.selectedRow == tile.row){
				delete hexes.selectedColumn;
				delete hexes.selectedRow;
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
			}else if(map[tile.row][tile.column].type !="water"){
				//this.drawHex(drawx, drawy - 6, "", "", true, false);
				hexes.selectedColumn=tile.column;
				hexes.selectedRow=tile.row;
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
				this.drawHex(drawx, drawy - 6, "", "", true);
			}	
		} 
	};
	var hexagonGrid = new HexagonGrid("HexCanvas", 30);
    hexagonGrid.drawHexGrid(10, 20, 10, 10, true);
	
};
function mouseMove(e)
{
    var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    console.log("X:" + mouseX + " Y:" + mouseY);
}