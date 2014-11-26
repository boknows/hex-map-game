//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to acuratly determin correct hex
HexagonGrid.prototype.getSelectedTile = function(mouseX, mouseY) {
	var offSet = map.canvas.getBoundingClientRect();

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