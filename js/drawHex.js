HexagonGrid.prototype.drawHex = function(x0, y0, fillColor, debugText, highlight, highlightColor, owner) {  

	this.context.font="bold 12px Helvetica";
	this.owner = owner;
	this.context.strokeStyle = "#000";
	this.context.lineWidth = 1;
    this.context.lineCap='round';

	var tile = this.getSelectedTile(x0 + this.width - this.side, y0);

	if(!typeof map.data[tile.row][tile.column].type == "undefined" ){
		if(map.data[tile.row][tile.column].type=="water"){
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
    
	if(map.data[tile.row][tile.column].s == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0 + this.side, y0 + this.height);
		this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
		this.context.stroke();
	}
    if(map.data[tile.row][tile.column].n == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0 + this.side, y0);
		this.context.lineTo(x0 + this.width - this.side, y0);
		this.context.stroke();
	}
    if(map.data[tile.row][tile.column].ne == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0 + this.side, y0);
		this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
		this.context.stroke();
	}
    if(map.data[tile.row][tile.column].se == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0 + this.width, y0 + (this.height / 2));
		this.context.lineTo(x0 + this.side, y0 + this.height);
		this.context.stroke();
	}
    if(map.data[tile.row][tile.column].sw == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0 + this.width - this.side, y0 + this.height);
		this.context.lineTo(x0, y0 + (this.height/2));
		this.context.stroke();
	}
    if(map.data[tile.row][tile.column].nw == true){
		this.context.beginPath();
		this.context.lineWidth = 5;
		this.context.moveTo(x0, y0 + (this.height/2));
		this.context.lineTo(x0 + this.width - this.side, y0);
		this.context.stroke();
	}
	
	if(map.data[tile.row][tile.column].type != "water"){
		this.context.fillStyle = map.data[tile.row][tile.column].color;
		this.context.lineWidth = 1;
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
	
		/*
		//Draw smaller hex inside bigger hex - v2
		var numberOfSides = 6,
		size = 16,
		Xcenter = x0 + (this.width / 2),
		Ycenter = y0 + (this.height / 2);
		this.context.beginPath();
		this.context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
		for (var i = 1; i <= numberOfSides;i += 1) {
			this.context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
		}
		this.context.fill();
		this.context.closePath();
		this.context.stroke();
		*/
		
		this.context.textAlign="center"; 
		this.context.textBaseline = "middle";
		this.context.fillStyle = '#FFFFFF';
		this.context.fillText(map.data[tile.row][tile.column].units, x0 + (this.width / 2) , y0 + (this.height / 2));
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