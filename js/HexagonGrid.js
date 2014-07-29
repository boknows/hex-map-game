function HexagonGrid(canvasId, radius) {
	this.radius = radius;
	this.height = Math.sqrt(3) * radius;
	this.width = 2 * radius;
	this.side = (3 / 2) * radius;
	
	map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
	map.ctx = map.canvas.getContext('2d');
	
	this.context = map.ctx;
	this.canvas = map.canvas;
	this.canvasOriginX = 0;
	this.canvasOriginY = 0;
	
	this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

	
	//setup unit placement select box
	/*
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
	*/
};