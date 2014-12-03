HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
	//this.canvasOriginX = originX;
	//this.canvasOriginY = originY;
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
			if(map.data[row][col].type=="land"){  
				this.drawHex(currentHexX, currentHexY, "#99CC66", debugText, false, map.dataUnits[row][col].owner);
			}else if(map.data[row][col].type=="water"){
				this.drawHex(currentHexX, currentHexY, "#3333FF", "", false, map.dataUnits[row][col].owner);
			}else if(map.data[row][col].type=="forest"){
				this.drawHex(currentHexX, currentHexY, "#009900", debugText, false, map.dataUnits[row][col].owner);
			}else if(map.data[row][col].type=="desert"){
				this.drawHex(currentHexX, currentHexY, "#F5E8C1", debugText, false, map.dataUnits[row][col].owner);
			}else if(map.data[row][col].type=="mountains"){
				this.drawHex(currentHexX, currentHexY, "#996600", debugText, false, map.dataUnits[row][col].owner);
			}else if (map.data[row][col].type == "artic"){
                this.drawHex(currentHexX, currentHexY, "#FFFFFF", debugText, false, map.dataUnits[row][col].owner);
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
};

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color) {
	var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
	var drawx = (column * this.side) + this.canvasOriginX;

	this.drawHex(drawx, drawy, color, "");
};