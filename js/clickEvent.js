HexagonGrid.prototype.clickEvent = function (e) {
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	var localX = mouseX - this.canvasOriginX;
	var localY = mouseY - this.canvasOriginY;
	var tile = this.getSelectedTile(localX, localY);
	//Add clicks to a click array for tracking
	if(typeof(map.clicks) != "undefined"){
		map.clicks.push({col: tile.column, row: tile.row, selected: null, type: null});
	}else{
		map.clicks = [{col: tile.column, row: tile.row, selected: null, type: null}];
	}
	if(map.clicks.length > 3){
		map.clicks.shift();
	}
	var clickTotal = map.clicks.length - 1;
    

    //populate hex data to form for map editing
	/*
    $('#type').val(map.data[tile.row][tile.column].type);
    $('#owner').val(map.data[tile.row][tile.column].owner);
    $('#units').val(map.data[tile.row][tile.column].units);
    $('#color').val(map.data[tile.row][tile.column].color);
    $('#n').val(map.data[tile.row][tile.column].n);
    $('#ne').val(map.data[tile.row][tile.column].ne);
    $('#se').val(map.data[tile.row][tile.column].se);
    $('#s').val(map.data[tile.row][tile.column].s);
    $('#sw').val(map.data[tile.row][tile.column].sw);
    $('#nw').val(map.data[tile.row][tile.column].nw);
	$('#connect').val(JSON.stringify(map.data[tile.row][tile.column].connect));
	$('#group').val(map.data[tile.row][tile.column].group);
	$('#column').val(tile.column);
	$('#row').val(tile.row);
	*/
    //END map editor
    
    if (tile.column >= 0 && tile.row >= 0 && tile.column <= map.dataProp.cols-1 && tile.row <= map.dataProp.rows-1) {
        /*if(map.dataProp.turnPhase == "unitPlacement" && map.data[tile.row][tile.column].owner == map.email && map.dataProp.owners[map.dataProp.turn] == map.email){
			var cube = toCubeCoord(tile.column, tile.row);
			var unitMenu = document.getElementById('place').innerHTML;
			for(i=1;i<units+1;i++){
				unitMenu = unitMenu + "<option value='" + i + "'>" + i + "</option>";   
			}
			document.getElementById('place').innerHTML = unitMenu;	
			var units = calcUnits(map.email);
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
				map.attack.attY = map.selected.selCol;
				map.attack.attX = map.selected.selRow;
				map.attack.attY = map.selected.selCol;
				map.attack.attX = map.selected.selRow;

				//Update Text on Unit Placement HTML
				map.unitCnt++;
				var msg = document.getElementById('msg').innerHTML;
				msg = map.unitCnt + " / " + units + " units placed.";
				document.getElementById('msg').innerHTML = msg;
			}
				
			
        }else if(map.dataProp.turnPhase == "attack"){
            var cube = toCubeCoord(tile.column, tile.row);
            //check if prev click was an enemy neighbor, trigger = true
            var trigger = false;
            for(i=0;i<map.neighborsPrev.length;i++){
                if(cube.x == map.neighborsPrev[i].x && cube.y == map.neighborsPrev[i].y && cube.z == map.neighborsPrev[i].z){
                    var offset = toOffsetCoord(map.neighborsPrev[i].x,map.neighborsPrev[i].y,map.neighborsPrev[i].z);
                    if(map.data[offset.r][offset.q].owner != map.email && map.data[offset.r][offset.q].type != "water" && map.data[map.selected.selRow][map.selected.selCol].type != "water" && map.data[map.selected.selRowPrev][map.selected.selColPrev].type != "water" && map.data[map.selected.selRowPrev][map.selected.selColPrev].owner != map.data[map.selected.selRow][map.selected.selCol].owner){
                        trigger = true;  
                        map.attack.attX = map.selected.selRowPrev;
                        map.attack.attY = map.selected.selColPrev;
                        map.attack.defX = map.selected.selRow;
                        map.attack.defY = map.selected.selCol;
						this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.drawHexGrid(this.rows, this.cols, 10, 10, true);
						var drawy = map.selected.selColPrev % 2 == 0 ? (map.selected.selRowPrev * this.height) + this.canvasOriginY + 6 : (map.selected.selRowPrev * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var drawx = (map.selected.selColPrev * this.side) + this.canvasOriginX;		
											
						this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[map.selected.selRowPrev][map.selected.selColPrev].owner); //highlight attacker hex
						var drawy2 = map.selected.selCol % 2 == 0 ? (map.selected.selRow * this.height) + this.canvasOriginY + 6 : (map.selected.selRow * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var drawx2 = (map.selected.selCol * this.side) + this.canvasOriginX;
						this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[map.selected.selRow][map.selected.selCol].owner); //highlight defender hex
                    }
                }
            }
            if(trigger == true){
                $('#attack').show();
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
					$('#attack').hide();
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawHexGrid(this.rows, this.cols, 10, 10, true);
                }else {
                    if(map.data[map.selected.selRow][map.selected.selCol].owner == map.email){
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
								if(map.data[offset.r][offset.q].type != "water" && map.data[map.selected.selRow][map.selected.selCol].owner == map.email){
									this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight defender hex
								}
								
                            }						
                        }
                    }
                }
            }
        }else */
		//Click Logic
		var cube = toCubeCoord(tile.column, tile.row);
        if(map.dataProp.turnPhase == "unitPlacement" && map.data[tile.row][tile.column].owner == map.email){
			var unitMenu = document.getElementById('place').innerHTML;
			for(var i=1;i<units+1;i++){
				unitMenu = unitMenu + "<option value='" + i + "'>" + i + "</option>";   
			}
			document.getElementById('place').innerHTML = unitMenu;	
			var units = calcUnits(map.email);
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
				map.attack.attY = map.selected.selCol;
				map.attack.attX = map.selected.selRow;
				map.attack.attY = map.selected.selCol;
				map.attack.attX = map.selected.selRow;

				//Update Text on Unit Placement HTML
				map.unitCnt++;
				var msg = document.getElementById('msg').innerHTML;
				msg = map.unitCnt + " / " + units + " units placed.";
				document.getElementById('msg').innerHTML = msg;
			}
		}
		if(map.dataProp.turnPhase == "attack"){
			console.log("Click State Before:" , map.clickState);
			if(map.clickState == null && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.email){
				map.clickState = "select";
				map.selected = {col: tile.column, row: tile.row};
			}else if(map.clickState == "select"){
				if(map.selected.col == tile.column && map.selected.row == tile.row){
					console.log("Erased!");
					map.clickState = "selectClear";
				}else{
					for(var i=0;i<map.neighbors.length;i++){
						if(cube.x == map.neighbors[i].x && cube.y == map.neighbors[i].y && cube.z == map.neighbors[i].z){
							var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
							if(map.data[offset.r][offset.q].owner != map.email && map.data[offset.r][offset.q].type != "water"){
								map.selected.nCol = tile.column;
								map.selected.nRow = tile.row;
								map.attack = {attX: map.selected.row, attY: map.selected.col, defX: map.selected.nRow, defY: map.selected.nCol};
								map.clickState = "nSelect";
							}
						}
					}
				}
			}else if(map.clickState == "nSelect"){
				map.clickState = "nSelectClear";
			}
			console.log("Click State After:" , map.clickState);
		}
		if(map.dataProp.turnPhase == "fortify"){
			if(map.clickState == null && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.email && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].units > 1){
				map.clickState = "select";
				map.selected = {col: tile.column, row: tile.row};
			}else if(map.clickState == "select"){
				if(map.selected.col == tile.column && map.selected.row == tile.row){
					console.log("Erased!");
					map.clickState = "selectClear";
				}else{
					for(var i=0;i<map.neighbors.length;i++){
						if(cube.x == map.neighbors[i].x && cube.y == map.neighbors[i].y && cube.z == map.neighbors[i].z){
							var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
							if(map.data[offset.r][offset.q].owner == map.email){
								map.selected.nCol = tile.column;
								map.selected.nRow = tile.row;
								map.attack = {attX: map.selected.row, attY: map.selected.col, defX: map.selected.nRow, defY: map.selected.nCol};
								map.clickState = "nSelect";
								//Update Fortify Dropdown
								var tran = "";
								for(var j=1;j<map.data[map.selected.row][map.selected.col].units;j++){
									var tran2 = "<option value='" + j + "'>" + j + "</option>";
									tran = tran + tran2;
								}
								document.getElementById('transfer').innerHTML = tran;
								$('#fortify').show();
							}
						}
					}
				}
			}else if(map.clickState == "nSelect"){
				map.clickState = "nSelectClear";
			}
        }	
    }
	
	//Draw Logic for after clicks made
	if(map.dataProp.turnPhase == "attack"){
		if(map.clickState == "select" && map.data[tile.row][tile.column].type != "water"){
			var cube = toCubeCoord(tile.column, tile.row);
			map.neighbors = getNeighbors(cube.x,cube.y,cube.z);
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[map.selected.row][map.selected.col].owner); //highlight selected
			
			for(var i=0;i<map.neighbors.length;i++){
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner != map.data[offset.r][offset.q].owner && map.data[offset.r][offset.q].type !="water"){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[offset.r][offset.q].owner); //highlight neighbor hexes
				}						
			}
		}
		if(map.clickState == "selectClear"){
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex
			
			for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner != map.data[offset.r][offset.q].owner && map.data[offset.r][offset.q].type !="water"){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "#99CC66", "", false, "", map.data[offset.r][offset.q].owner); 						
				}						
			}
			map.clickState = null;
			map.selected = null;
			$('#attack').hide();
		}
		if(map.clickState == "nSelect"){
			for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.data[offset.r][offset.q].owner && map.data[offset.r][offset.q].type !="water"){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "#99CC66", "", false, "", map.data[offset.r][offset.q].owner); 						
				}						
			}
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[map.selected.row][map.selected.col].owner); //highlight selected
			
			var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map.data[map.selected.nRow][map.selected.nCol].owner); //highlight defender
			
			$('#attack').show();
		}
		if(map.clickState == "nSelectClear"){
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex
			
			var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.nRow][map.selected.nCol].owner); //clear nSelected hex
			
			map.clickState = null;
			map.selected = null;
			$('#attack').hide();
		}
	}
	if(map.dataProp.turnPhase == "fortify"){
		if(map.clickState == "selectClear"){
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex
			
			for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.data[offset.r][offset.q].owner){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "#99CC66", "", false, "", map.data[offset.r][offset.q].owner); 						
				}						
			}
			map.clickState = null;
			map.selected = null;
			$('#fortify').hide();
		}
		if(map.clickState == "select"){
			var cube = toCubeCoord(tile.column, tile.row);
			map.neighbors = getNeighbors(cube.x,cube.y,cube.z);
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[map.selected.row][map.selected.col].owner); //highlight selected
			
			for(var i=0;i<map.neighbors.length;i++){
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.data[offset.r][offset.q].owner){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "", "", true, "#FF0000", map.data[tile.row][tile.column].owner); //highlight neighbor hexes
				}						
			}
		}
		if(map.clickState == "nSelect"){
			for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
				var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
				if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner == map.data[offset.r][offset.q].owner){
					var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
					var drawx2 = (offset.q * this.side) + this.canvasOriginX;
					this.drawHex(drawx2, drawy2 - 6, "#99CC66", "", false, "", map.data[offset.r][offset.q].owner); 						
				}						
			}
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#00F2FF", map.data[map.selected.row][map.selected.col].owner); //highlight selected
			
			var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "", "", true, "#FF0000", map.data[map.selected.nRow][map.selected.nCol].owner); //highlight defender
		}
		if(map.clickState == "nSelectClear"){
			var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.col * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex
			
			var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
			var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
			this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.nRow][map.selected.nCol].owner); //clear nSelected hex
			
			map.clickState = null;
			map.selected = null;
			$('#fortify').hide();
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


