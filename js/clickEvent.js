HexagonGrid.prototype.clickEvent = function (e) {
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	var localX = mouseX - this.canvasOriginX;
	var localY = mouseY - this.canvasOriginY;
	var tile = this.getSelectedTile(localX, localY);
    console.log(map.selected.selCol,  map.selected.selRow);
    if(typeof map.selected.selCol != "undefined" && typeof map.selected.selRow != "undefined"){ //Set previous clicked hex
        map.selected.selColPrev = map.selected.selCol;
        map.selected.selRowPrev = map.selected.selRow;
        map.neighborsPrev = map.neighbors;
    }
    map.selected.selCol=tile.column;
    map.selected.selRow=tile.row;
    console.log(map.selected.selCol,  map.selected.selRow);
    var cube = toCubeCoord(tile.column, tile.row);
    map.neighbors = getNeighbors(cube.x,cube.y,cube.z);
    
    //populate hex data to form for map editing
    $('#type').val(map.data[tile.row][tile.column].type);
    $('#owner').val(map.data[tile.row][tile.column].owner);
    $('#units').val(map.data[tile.row][tile.column].units);
    $('#color').val(map.data[tile.row][tile.column].color);
    if(Boolean(map.data[tile.row][tile.column].n)==false){
        $('#n').val("");
    }else{
    $('#n').val(Boolean(map.data[tile.row][tile.column].n));
    }
    if(Boolean(map.data[tile.row][tile.column].ne)==false){
        $('#ne').val("");
    }else{
        $('#ne').val(Boolean(map.data[tile.row][tile.column].ne));
    }
    if(Boolean(map.data[tile.row][tile.column].se)==false){
        $('#se').val("");
    }else{
        $('#se').val(Boolean(map.data[tile.row][tile.column].se));
    }
    if(Boolean(map.data[tile.row][tile.column].s)==false){
        $('#s').val("");
    }else{
        $('#s').val(Boolean(map.data[tile.row][tile.column].s));
    }
    if(Boolean(map.data[tile.row][tile.column].sw)==false){
        $('#sw').val("");
    }else{
        $('#sw').val(Boolean(map.data[tile.row][tile.column].sw));
    }
    if(Boolean(map.data[tile.row][tile.column].nw)==false){
        $('#nw').val("");
    }else{
        $('#nw').val(Boolean(map.data[tile.row][tile.column].nw));
    }
    //END map editor
    if (tile.column >= 0 && tile.row >= 0) {
        if(map.dataProp.turnPhase == "unitPlacement"){
            
        }else if(map.dataProp.turnPhase == "attack"){
            var cube = toCubeCoord(tile.column, tile.row);
            //check if prev click was an enemy neighbor, trigger = true
            var trigger = false;
            for(i=0;i<map.neighborsPrev.length;i++){
                if(cube.x == map.neighborsPrev[i].x && cube.y == map.neighborsPrev[i].y && cube.z == map.neighborsPrev[i].z){
                    var offset = toOffsetCoord(map.neighborsPrev[i].x,map.neighborsPrev[i].y,map.neighborsPrev[i].z);
                    if(map.data[offset.r][offset.q].owner != map.username){
                        trigger = true;  
                        console.log("attacker detected");
                        map.attack.attX = map.selected.selRowPrev;
                        map.attack.attY = map.selected.selColPrev;
                        map.attack.defX = map.selected.selRow;
                        map.attack.defY = map.selected.selCol;
                        console.log(map.attack);
                    }
                }
            }
            if(trigger == true){
                $('#controls').show();
            }else{
                var msg = document.getElementById('msg').innerHTML;
                if(map.dataProp.turnPhase == "attack"){
                    msg = "It's the " + map.dataProp.turnPhase + " stage.<br>Please click on an enemy country to attack.";
                }
                document.getElementById('msg').innerHTML = msg;	
                if(map.selected.selCol == map.selected.selColPrev && map.selected.selRow == map.selected.selRowPrev){ //if same as clicked before, erase all selections
                    delete map.selected.selCol;
                    delete map.selected.selRow;
                    delete map.selected.selColPrev;
                    delete map.selected.selRowPrev; 
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawHexGrid(this.rows, this.cols, 10, 10, true);
                }else {
                    if(map.data[map.selected.selRow][map.selected.selCol].owner == map.username){
                        var drawy3 = map.selected.selCol % 2 == 0 ? (map.selected.selRow * this.height) + this.canvasOriginY + 6 : (map.selected.selRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var drawx3 = (map.selected.selCol * this.side) + this.canvasOriginX;
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.drawHexGrid(this.rows, this.cols, 10, 10, true);
                        this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map.data[tile.row][tile.column].owner); //highlight attacker hex
                        for(i=0;i<map.neighbors.length;i++){
                            var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                            if(typeof map.selected.selRow != "undefined" && map.data[map.selected.selRow][map.selected.selCol].owner != map.data[offset.r][offset.q].owner){
                                var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                                var drawx2 = (offset.q * this.side) + this.canvasOriginX;
                                this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight defender hex
                            }						
                        }
                    }
                }
            }
        }else if(map.dataProp.turnPhase == "fortify"){
            var cube = toCubeCoord(tile.column, tile.row);
            var trigger = false;
            for(i=0;i<map.neighborsPrev.length;i++){
                if(cube.x == map.neighborsPrev[i].x && cube.y == map.neighborsPrev[i].y && cube.z == map.neighborsPrev[i].z){
                    var offset = toOffsetCoord(map.neighborsPrev[i].x,map.neighborsPrev[i].y,map.neighborsPrev[i].z);
                    if(map.data[offset.r][offset.q].owner == map.username){
                        trigger = true;  
                        map.attack.attX = map.selected.selRowPrev;
                        map.attack.attY = map.selected.selColPrev;
                        map.attack.defX = map.selected.selRow;
                        map.attack.defY = map.selected.selCol;
                    }
                }
            }
            if(trigger == true && typeof map.data[map.selected.selRowPrev][map.selected.selColPrev] != "undefined"){
                var tran = "";
                for(i=1;i<map.data[map.selected.selRowPrev][map.selected.selColPrev].units;i++){
                    var tran2 = "<option value='" + i + "'>" + i + "</option>";
                    tran = tran + tran2;
                }
                document.getElementById('transfer').innerHTML = tran;	
                $('#fortify').show();
            }else{
                if(map.selected.selCol == map.selected.selColPrev && map.selected.selRow == map.selected.selRowPrev){ //if same as clicked before, erase all selections
                    delete map.selected.selCol;
                    delete map.selected.selRow;
                    delete map.selected.selColPrev;
                    delete map.selected.selRowPrev; 
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawHexGrid(this.rows, this.cols, 10, 10, true);
                }else {
                    if(map.data[map.selected.selRow][map.selected.selCol].owner == map.username){
                        var drawy3 = map.selected.selCol % 2 == 0 ? (map.selected.selRow * this.height) + this.canvasOriginY + 6 : (map.selected.selRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var drawx3 = (map.selected.selCol * this.side) + this.canvasOriginX;
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.drawHexGrid(this.rows, this.cols, 10, 10, true);
                        this.drawHex(drawx3, drawy3 - 6, "", "", true, "#00F2FF", map.data[tile.row][tile.column].owner); //highlight selected
                        for(i=0;i<map.neighbors.length;i++){
                            var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                            if(typeof map.selected.selRow != "undefined" && map.data[map.selected.selRow][map.selected.selCol].owner == map.data[offset.r][offset.q].owner){
                                var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                                var drawx2 = (offset.q * this.side) + this.canvasOriginX;
                                this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight neighbor hexes
                            }						
                        }
                    }
                }
            }
        }
    }
    
    /*
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
								
							}
						}else if(map.dataProp.turnPhase == "fortify"){
							if(map.neighbors[i].x == cube.x && map.neighbors[i].y == cube.y && map.neighbors[i].z == cube.z && map.data[map.hexes.selectedRow][map.hexes.selectedColumn].owner == map.data[tile.row][tile.column].owner){ // If you already have a hex selected, and the next click is a neighbor that is attackable, do this.
								trigger = true;
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
				}else{
                    map.hexes.selectedColumn=tile.column;
					map.hexes.selectedRow=tile.row;
					map.neighbors = getNeighbors(cube.x,cube.y,cube.z);
					map.hexes.neighbors = map.neighbors;
                }
				if(map.dataProp.turnPhase == "unitPlacement"){
					var units = calcUnits("bo_knows");
                    if(map.unitCnt < units){
                        var tmp = {row: tile.row, col: tile.column};
                        map.unitPlacement.push(tmp);
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

                        //Update Text on Unit Placement HTML

                        map.unitCnt++;
                        var msg = document.getElementById('msg').innerHTML;
                        msg = map.unitCnt + " / " + units + " units placed.";
                        document.getElementById('msg').innerHTML = msg;
                    }
				}
                
			}
		}
        
	}
    */
};