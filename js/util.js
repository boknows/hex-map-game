function singleAttack(map, attack) {
	if(this.map[attack.attX][attack.attY].units > 1){
		var losses = battle(this.map[attack.attX][attack.attY].units, map[attack.defX][attack.defY].units, "", "");
		map[attack.attX][attack.attY].units = this.map[attack.attX][attack.attY].units - losses.att;
		map[attack.defX][attack.defY].units = this.map[attack.defX][attack.defY].units - losses.def;
		
		if(this.map[attack.defX][attack.defY].units == 0){
			map[attack.defX][attack.defY].units = this.map[attack.attX][attack.attY].units - 1;
			map[attack.attX][attack.attY].units = 1;
			map[attack.defX][attack.defY].owner = this.map[attack.attX][attack.attY].owner;
			map[attack.defX][attack.defY].color = this.map[attack.attX][attack.attY].color;
			$('#controls').hide();
		}
		var data = { data: JSON.stringify(this.map) };
		updateMap(data, "map");
	}else{
		console.log("Can't attack. Not enough units.");
		$('#controls').hide();
	}
};
function contAttack(map, attack) {
	while (this.map[attack.attX][attack.attY].units > 5){
		if(this.map[attack.attX][attack.attY].units > 1){
			var losses = battle(this.map[attack.attX][attack.attY].units, map[attack.defX][attack.defY].units, "", "");
			map[attack.attX][attack.attY].units = this.map[attack.attX][attack.attY].units - losses.att;
			map[attack.defX][attack.defY].units = this.map[attack.defX][attack.defY].units - losses.def;
			
			if(this.map[attack.defX][attack.defY].units == 0){
				map[attack.defX][attack.defY].units = this.map[attack.attX][attack.attY].units - 1;
				map[attack.attX][attack.attY].units = 1;
				map[attack.defX][attack.defY].owner = this.map[attack.attX][attack.attY].owner;
				map[attack.defX][attack.defY].color = this.map[attack.attX][attack.attY].color;
				$('#controls').hide();
			}
			var data = { data: JSON.stringify(this.map) };
			updateMap(data, "map");
		}else{
			console.log("Can't attack. Not enough units.");
			$('#controls').hide();
		}
	}
};
function calcUnits(username) {
	//calc raw units for initial units
	var units = 0;
	for(i=0;i<map.data.length;i++){
		for(j=0;j<map.data[i].length;j++){
			if(map.data[i][j].owner == username){
				units++;   
			}
		}        
	}
	units = Math.floor(units/3); 
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

