HexagonGrid.prototype.clickEvent = function (e) {
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	var localX = mouseX - this.canvasOriginX;
	var localY = mouseY - this.canvasOriginY;
	var tile = this.getSelectedTile(localX, localY);
	if (tile.column >= 0 && tile.row >= 0) {
		var drawy = tile.column % 2 == 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
		var drawx = (tile.column * this.side) + this.canvasOriginX;
		if(map.hexes.selectedColumn == tile.column && map.hexes.selectedRow == tile.row){
			delete map.hexes.selectedColumn;
			delete map.hexes.selectedRow;
			delete this.rectX;
			delete this.rectY;
			$('#controls').hide();
			$('#fortify').hide();
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawHexGrid(this.rows, this.cols, 10, 10, true);
		}else if(typeof map.data[tile.row][tile.column] != "undefined"){
			if(map.data[tile.row][tile.column].type !="water"){
				var cube = toCubeCoord(tile.column, tile.row);
				var trigger = false;
				$('#controls').hide();
				for(i=0;i<map.neighbors.length;i++){
					if(typeof map.hexes.selectedRow != "undefined"){
						if(map.dataProp.turnPhase == "attack"){
							if(map.neighbors[i].x == cube.x && map.neighbors[i].y == cube.y && map.neighbors[i].z == cube.z && map.data[map.hexes.selectedRow][map.hexes.selectedColumn].owner != map.data[tile.row][tile.column].owner){ // If you already have a hex selected, and the next click is a neighbor that is attackable, do this.
								trigger = true;
								console.log("hey!3");
								var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
								var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
								var drawx2 = (offset.q * this.side) + this.canvasOriginX;
								var drawy3 = map.hexes.selectedColumn % 2 == 0 ? (map.hexes.selectedRow * this.height) + this.canvasOriginY + 6 : (map.hexes.selectedRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
								var drawx3 = (map.hexes.selectedColumn * this.side) + this.canvasOriginX;
								this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
								hexagonGrid.drawHexGrid(this.rows, this.cols, 10, 10, true);
								this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map.data[tile.row][tile.column].owner); //highlight attacker hex
								this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight defender hex
								map.attack.attY = map.hexes.selectedColumn;
								map.attack.attX = map.hexes.selectedRow;
								map.attack.defY = offset.q;
								map.attack.defX = offset.r;
								
							}
						}else if(map.dataProp.turnPhase == "fortify"){
							if(map.neighbors[i].x == cube.x && map.neighbors[i].y == cube.y && map.neighbors[i].z == cube.z && map.data[map.hexes.selectedRow][map.hexes.selectedColumn].owner == map.data[tile.row][tile.column].owner){ // If you already have a hex selected, and the next click is a neighbor that is attackable, do this.
								trigger = true;
								console.log("hey!2");
								var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
								var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
								var drawx2 = (offset.q * this.side) + this.canvasOriginX;
								var drawy3 = map.hexes.selectedColumn % 2 == 0 ? (map.hexes.selectedRow * this.height) + this.canvasOriginY + 6 : (map.hexes.selectedRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
								var drawx3 = (map.hexes.selectedColumn * this.side) + this.canvasOriginX;
								this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
								this.drawHexGrid(this.rows, this.cols, 10, 10, true);
								this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map.data[tile.row][tile.column].owner); //highlight attacker hex
								this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight defender hex
								map.attack.attY = map.hexes.selectedColumn;
								map.attack.attX = map.hexes.selectedRow;
								map.attack.defY = offset.q;
								map.attack.defX = offset.r;
								map.attack.defY = offset.q;
								map.attack.defX = offset.r;
								map.attack.attY = map.hexes.selectedColumn;
								map.attack.attX = map.hexes.selectedRow;
							}
						}
					}						
				}
				if(trigger == true){
					if(map.dataProp.turnPhase == "fortify"){
						$('#fortify').show();
						var tran = "";
						for(i=1;i<map.data[map.hexes.selectedRow][map.hexes.selectedColumn].units;i++){
							var tran2 = "<option value='" + i + "'>" + i + "</option>";
							tran = tran + tran2;
						}
						//console.log(tran);
						document.getElementById('transfer').innerHTML = tran;	
					}else{
						$('#controls').show();
					}
				}
				if(trigger == false && map.data[tile.row][tile.column].owner == map.username && map.dataProp.owners[map.dataProp.turn] == map.username && map.dataProp.turnPhase != "unitPlacement"){ // If you already have a hex selected, and the next click is a isn't neighbor that is attackable, do this.
					map.hexes.selectedColumn=tile.column;
					console.log("hey!4");
					map.hexes.selectedRow=tile.row;
					map.neighbors = getNeighbors(cube.x,cube.y,cube.z);
					map.hexes.neighbors = map.neighbors;
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.drawHexGrid(this.rows, this.cols, 10, 10, true);
					this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[tile.row][tile.column].owner); //highlight clicked hex
					
					var owner = map.data[tile.row][tile.column].owner;
					//Get neighbors of clicked hex and highlight them
					var tile = this.getSelectedTile(drawx, drawy - 6);
					for (i=0;i<map.neighbors.length;i++){
						var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
						var drawy = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
						var drawx = (offset.q * this.side) + this.canvasOriginX;
						var tile = this.getSelectedTile(drawx + (this.width/2), drawy-6+(this.height/2));
						if(map.dataProp.turnPhase == "fortify"){
							if(tile.row < this.rows && tile.column < this.cols && tile.row >=0 && tile.column >=0 && map.data[tile.row][tile.column].type != "water" && owner == map.data[tile.row][tile.column].owner){
								this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight neighboring hexes
							}
						}else{
							if(tile.row < this.rows && tile.column < this.cols && tile.row >=0 && tile.column >=0 && map.data[tile.row][tile.column].type != "water" && owner != map.data[tile.row][tile.column].owner){
								this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight neighboring hexes
							}
						}
					}
				}
				if(map.dataProp.turnPhase == "unitPlacement"){
					
					var tmp = {row: tile.row, col: tile.column};
					map.unitPlacement.push(tmp);
					console.log(map.unitPlacement);
					map.data[tile.row][tile.column].units++;
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.drawHexGrid(this.rows, this.cols, 10, 10, true);
					for(var i=0, len=map.unitPlacement.length; i<len; i++){
						var y = map.unitPlacement[i].col % 2 == 0 ? (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 : (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
						var x = (map.unitPlacement[i].col * this.side) + this.canvasOriginX;
						this.drawHex(x, y - 6, "", "", true, "#00F2FF", map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].owner); //highlight attacker hex
					}
					map.attack.attY = map.hexes.selectedColumn;
					map.attack.attX = map.hexes.selectedRow;
					map.attack.attY = map.hexes.selectedColumn;
					map.attack.attX = map.hexes.selectedRow;
				}
			}
		}
		
	}
	
	if(localX > this.attRectX && localX < (this.attRectX + this.attRectWidth) && localY > this.attRectY && localY < (this.attRectY + this.attRectHeight)){
		//console.log("attack clicked!");
				
	}
		
};