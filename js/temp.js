if(map.dataProp.turnPhase == "fortify"){
            var cube = toCubeCoord(tile.column, tile.row);
            if(map.selected.trigger1 == true && map.selected.trigger2 == false){
               //if(map.selected.selCol == map.selected.selColPrev && map.selected.selRow == map.selected.selRowPrev){  //if same as clicked before, erase all selections
			   if(map.clicks[clickTotal].col == map.clicks[clickTotal-1].col && map.clicks[clickTotal].row == map.clicks[clickTotal-1].row){
                    console.log("Erased!");
                    map.selected.trigger1 = false;
                    map.selected.trigger2 = false;
					delete map.clicks;
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 10, 10, true);
					console.log(map.clicks);
                }
                for(i=0;i<map.neighborsPrev.length;i++){
                    if(cube.x == map.neighborsPrev[i].x && cube.y == map.neighborsPrev[i].y && cube.z == map.neighborsPrev[i].z){
                        var offset = toOffsetCoord(map.neighborsPrev[i].x,map.neighborsPrev[i].y,map.neighborsPrev[i].z);
                        if(map.data[offset.r][offset.q].owner == map.email){
                            map.selected.trigger2 = true;  
                            map.attack.attX = map.selected.selRowPrev;
                            map.attack.attY = map.selected.selColPrev;
                            map.attack.defX = map.selected.selRow;
                            map.attack.defY = map.selected.selCol;
                        }
                    }
                } 
                if(map.selected.trigger1 === true && map.selected.trigger2 === true && map.data[map.selected.selRowPrev][map.selected.selColPrev].units > 1){
                    var tran = "";
                    for(i=1;i<map.data[map.selected.selRowPrev][map.selected.selColPrev].units;i++){
                        var tran2 = "<option value='" + i + "'>" + i + "</option>";
                        tran = tran + tran2;
                    }
                    document.getElementById('transfer').innerHTML = tran;
                    map.selected.trigger1 = false;
                    map.selected.trigger2 = false;
                    $('#fortify').show();
                }
            }else if(map.selected.trigger1 == false && map.selected.trigger2 == false && map.data[map.selected.selRowPrev][map.selected.selColPrev].units > 1){
                if(map.data[map.selected.selRow][map.selected.selCol].owner == map.email){
                    map.selected.trigger1 = true;
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
            
               
            
            /*
            if(typeof map.neighborsPrev != "undefined"){
                for(i=0;i<map.neighborsPrev.length;i++){
                    if(cube.x == map.neighborsPrev[i].x && cube.y == map.neighborsPrev[i].y && cube.z == map.neighborsPrev[i].z){
                        var offset = toOffsetCoord(map.neighborsPrev[i].x,map.neighborsPrev[i].y,map.neighborsPrev[i].z);
                        if(map.data[offset.r][offset.q].owner == map.username){
                            map.selected.trigger = true;  
                            map.attack.attX = map.selected.selRowPrev;
                            map.attack.attY = map.selected.selColPrev;
                            map.attack.defX = map.selected.selRow;
                            map.attack.defY = map.selected.selCol;
                        }
                    }
                }
            }
            if(map.selected.trigger == true && typeof map.data[map.selected.selRowPrev][map.selected.selColPrev] != "undefined" ){
                var tran = "";
                for(i=1;i<map.data[map.selected.selRowPrev][map.selected.selColPrev].units;i++){
                    var tran2 = "<option value='" + i + "'>" + i + "</option>";
                    tran = tran + tran2;
                }
                document.getElementById('transfer').innerHTML = tran;	
                $('#fortify').show();
            }else if(map.selected.trigger == false){
                    
            }
            */
            console.log("Trigger1:", map.selected.trigger1, "Trigger2:", map.selected.trigger2);
        }