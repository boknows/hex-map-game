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
       loadedMap(r); //call loadedMap(r) if loading a map from DB
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
		var mapProperties = { owners: new Array("Bo", "Marlon"), colors: new Array("Red", "Blue") };
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
					map[i][j] = { type: types[rand], owner: mapProperties.owners[own], units: 3 };
				}else if(land == false){
					map[i][j] = { type: "water" };
				}
			}
		}
	}

	//convert properties to JSON for database storage
	//var data = JSON.stringify(map);

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

	HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText, highlight, owner) {
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
			if(this.owner == "Bo"){
				this.context.fillStyle = "Red";
			}else if (this.owner == "Marlon"){
				this.context.fillStyle = "Blue";
			}
			
			//Draw Circle inside Hex
			if (highlight == true){
				console.log("true!");
				this.context.strokeStyle = "#00F2FF";
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

		if (tile.column >= 0 && tile.row >= 0) {
			var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (tile.column * this.side) + this.canvasOriginX;

			if(hexes.selectedColumn == tile.column && hexes.selectedRow == tile.row){
				delete hexes.selectedColumn;
				delete hexes.selectedRow;
				delete this.rectX;
				delete this.rectY;
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
			}else if(typeof map[tile.row][tile.column] != "undefined"){
				if(map[tile.row][tile.column].type !="water"){
					hexes.selectedColumn=tile.column;
					hexes.selectedRow=tile.row;
					var cube = toCubeCoord(tile.column, tile.row);
					var neighbors = getNeighbors(cube.x,cube.y,cube.z);
					
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
					this.drawHex(drawx, drawy - 6, "", "", true, map[tile.row][tile.column].owner); //highlight clicked hex
					
					//Get neighbors of clicked hex and highlight them
					var tile = this.getSelectedTile(drawx, drawy - 6);
					for (i=0;i<neighbors.length;i++){
						var offset = toOffsetCoord(neighbors[i].x,neighbors[i].y,neighbors[i].z);
						var drawy = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
						var drawx = (offset.q * this.side) + this.canvasOriginX;
						var tile = this.getSelectedTile(drawx + (this.width/2), drawy-6+(this.height/2));
						if(tile.row < this.rows && tile.column < this.cols && tile.row >=0 && tile.column >=0 && map[tile.row][tile.column].type != "water"){
							this.drawHex(drawx, drawy - 6, "", "", true, map[tile.row][tile.column].owner); //highlight neighboring hexes
						}
					}
					
					
					//Draw Attack Button
					this.context.lineWidth = 4;
					this.context.strokeStyle = "#000000";
					this.context.fillStyle = "#FF0000";
					this.context.textAlign="center"; 
					this.context.textBaseline = "middle";
					this.rectX = (this.radius*(3/2)*(this.cols+2));
					this.rectY = 50;
					roundRect(this.context, this.rectX, this.rectY, 100, 50, 10, true);
					this.context.font="20px Helvetica";
					this.context.fillStyle = "#000000";
					this.rectHeight = 50;
					this.rectWidth = 100;
					this.context.fillText("Attack!",this.rectX+(this.rectWidth/2),this.rectY+(this.rectHeight/2));
					
				}
			}
			
		}
		
		if(localX > this.rectX && localX < (this.rectX + this.rectWidth) && localY > this.rectY && localY < (this.rectY + this.rectHeight)){
			console.log("attack clicked!");
		}
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