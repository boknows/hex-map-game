HexagonGrid.prototype.clickEvent = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;
    var tile = this.getSelectedTile(localX, localY);
    if(map.username=="bo_knows"){
        map.editMap = {col: tile.column, row: tile.row};
        //populate hex data to form for map editing
        $('#type').val(map.data[tile.row][tile.column].type);
        $('#owner').val(map.data[tile.row][tile.column].owner);
        $('#unitsEdit').val(map.data[tile.row][tile.column].units);
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
        
        //END map editor
    }
    if(map.dataProp.owners[map.dataProp.turn] == map.email){
        //Add clicks to a click array for tracking
        if(map.dataProp.turnPhase == "fortify"){
            if(map.data[tile.row][tile.column].owner == map.username){
                if(typeof(map.clicks) != "undefined"){
                    map.clicks.push({col: tile.column, row: tile.row, selected: null, type: null});
                }else{
                    map.clicks = [{col: tile.column, row: tile.row, selected: null, type: null}];
                }
                if(map.clicks.length > 3){
                    map.clicks.shift();
                }
            }else{
                if(map.clickState != null){
                    map.clickState = "fortifyClear";
                }
            }	
        }else if(map.dataProp.turnPhase == "attack"){
            if(map.clickState == "select"){
                if(map.data[tile.row][tile.column].owner == map.username){
                    map.clickState = "attackClear";
                }
            }else if(map.clickState == "nSelect"){
                if((map.selected.row != tile.row && map.selected.col != tile.column) || (map.selected.nRow != tile.row && map.selected.col != tile.column)){
                    map.clickState = "attackClear";
                }
            }else{
                if(typeof(map.clicks) != "undefined"){
                    map.clicks.push({col: tile.column, row: tile.row, selected: null, type: null});
                }else{
                    map.clicks = [{col: tile.column, row: tile.row, selected: null, type: null}];
                }
                if(map.clicks.length > 3){
                    map.clicks.shift();
                }
            }
        }else{
            if(typeof(map.clicks) != "undefined"){
                map.clicks.push({col: tile.column, row: tile.row, selected: null, type: null});
            }else{
                map.clicks = [{col: tile.column, row: tile.row, selected: null, type: null}];
            }
            if(map.clicks.length > 3){
                map.clicks.shift();
            }
        }
        if(typeof(map.clicks) != "undefined"){
            var clickTotal = map.clicks.length - 1;
        }
        

        if (tile.column >= 0 && tile.row >= 0 && tile.column <= map.dataProp.cols-1 && tile.row <= map.dataProp.rows-1) {
            //Click Logic
            var cube = toCubeCoord(tile.column, tile.row);
            if(map.dataProp.turnPhase == "unitPlacement" && map.data[tile.row][tile.column].owner == map.username && map.dataProp.owners[map.dataProp.turn]==map.email){
                var units = map.unitsToBePlaced;
                var unitMenu = document.getElementById('place').innerHTML;
                for(var i=1;i<units+1;i++){
                    unitMenu = unitMenu + "<option value='" + i + "'>" + i + "</option>";   
                }
                document.getElementById('place').innerHTML = unitMenu;  
                if(map.unitCnt < units){
                    var tmp = {row: tile.row, col: tile.column};
                    map.unitPlacement.push(tmp);
                    map.data[tile.row][tile.column].units++;
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawHexGrid(this.rows, this.cols, this.canvasOriginX, this.canvasOriginY, true);
                    for(var i=0, len=map.unitPlacement.length; i<len; i++){
                        var y = map.unitPlacement[i].col % 2 == 0 ? (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 : (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var x = (map.unitPlacement[i].col * this.side) + this.canvasOriginX;
                        this.drawHex(x, y - 6, "", "", true, "#00F2FF", map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].owner); //highlight attacker hex
                    }


                    //Update Text on Unit Placement HTML
                    map.unitCnt++; 
                    var unitsDisp = document.getElementById('units').innerHTML;
                    unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
                    document.getElementById('units').innerHTML = unitsDisp;
                }
            }
            if(map.dataProp.turnPhase == "attack"){
                console.log("Click State Before:" , map.clickState);
                if(map.clickState == null && map.data[tile.row][tile.column].owner == map.username && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].units > 1){
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
                                if(map.data[offset.r][offset.q].owner != map.username && map.data[offset.r][offset.q].type != "water"){
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
                console.log("Click State After:" , map.clickState, map.selected);
            }
            if(map.dataProp.turnPhase == "fortify"){
                console.log("Click State Before:" , map.clickState);
                if(map.clickState == null && map.data[tile.row][tile.column].owner == map.username && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].units > 1 && map.dataProp.fortifiesUsed < map.dataProp.fortifies){
                    map.clickState = "select";
                    map.selected = {col: tile.column, row: tile.row};
                }else if(map.clickState == "select" && map.data[tile.row][tile.column].owner == map.username){
                    console.log
                    if((map.selected.col == tile.column && map.selected.row == tile.row) || (map.data[tile.row][tile.column].owner != map.username)){
                        map.clickState = "selectClear";
                    }else{
                        for(var i=0;i<map.neighbors.length;i++){
                            if(cube.x == map.neighbors[i].x && cube.y == map.neighbors[i].y && cube.z == map.neighbors[i].z){
                                var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                                if(map.data[offset.r][offset.q].owner == map.username){
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
                                    var arr = [{"id":"#fortify","action":"show"},{"id":"#endTurnButton","action":"hide"}];
                                    showHide(arr,"Fortify phase. Showing clicked neighbor.");
                                }
                            }
                        }
                    }
                }else if(map.clickState == "nSelect" && map.data[tile.row][tile.column].owner == map.username){
                    map.clickState = "nSelectClear";
                }

                console.log("Click State After:" , map.clickState);
            }	
        }

        //Draw Logic for after clicks made
        if(map.dataProp.turnPhase == "attack"){
            if(map.clickState == "attackClear"){
                var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                var drawx = (map.selected.col * this.side) + this.canvasOriginX;
                this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex
                if(typeof(map.selected.nCol) != "undefined"){
                    var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                    var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
                    this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.nRow][map.selected.nCol].owner); //clear selected hex
                }
                
                for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
                    var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                    if(typeof map.clicks[clickTotal].row != "undefined" && map.data[tile.row][tile.column].owner != map.data[offset.r][offset.q].owner){
                        var drawy2 = offset.q % 2 == 0 ? (offset.r * this.height) + this.canvasOriginY + 6 : (offset.r * this.height) + this.canvasOriginY + 6 + (this.height / 2);
                        var drawx2 = (offset.q * this.side) + this.canvasOriginX;	
                        if(map.data[offset.r][offset.q].type != "water"){
                            this.drawHex(drawx2, drawy2 - 6, "#99CC66", "", false, "", map.data[offset.r][offset.q].owner); 
                        }					
                    }						
                }
                map.clickState = null;
                map.selected = {};
                var arr = [{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
                showHide(arr,"Attack phase. clickState=attackClear.");
            }
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
                var arr = [{"id":"#fortifyButton","action":"hide"},{"id":"#endTurnButton","action":"hide"}];
                showHide(arr,"Attack phase. clickState=select.");
            }
            if(map.clickState == "selectClear"){
                console.log(map.selected);
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
                map.selected = {};
                var arr = [{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
                showHide(arr,"Attack phase. clickState=selectClear.");
            }
            if(map.clickState == "nSelect"){
                for(var i=0;i<map.neighbors.length;i++){ //clear neighbor hexes
                    var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                    if(typeof map.clicks[clickTotal].row != "undefined" && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].owner != map.data[offset.r][offset.q].owner && map.data[offset.r][offset.q].type !="water"){
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
                if(map.data[map.selected.row][map.selected.col].units<5){
                    var arr = [{"id":"#attack","action":"show"},{"id":"#endTurn","action":"hide"},{"id":"#singleAttack","action":"show"},{"id":"#continuousAttack","action":"hide"}];
                }else{
                    var arr = [{"id":"#attack","action":"show"},{"id":"#endTurn","action":"hide"},{"id":"#singleAttack","action":"show"},{"id":"#continuousAttack","action":"show"}];
                }
                showHide(arr,"Attack phase. clickState=nSelect.");
            }
            if(map.clickState == "nSelectClear"){
                var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                var drawx = (map.selected.col * this.side) + this.canvasOriginX;
                this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex

                var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
                this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.nRow][map.selected.nCol].owner); //clear nSelected hex

                map.clickState = null;
                map.selected = {};
                var arr = [{"id":"#attack","action":"hide"},{"id":"#endTurn","action":"show"},{"id":"#fortifyButton","action":"show"}];
                showHide(arr,"Attack phase. clickState=nSelectClear.");
            }
        }
        if(map.dataProp.turnPhase == "fortify"){
            if(map.clickState == "fortifyClear"){
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
                map.selected = {};
                var arr = [{"id":"#fortify","action":"hide"}];
                showHide(arr,"Fortify phase. clickState=fortifyClear.");
            }
            if(map.clickState == "selectClear"){
                console.log(map.neighbors, clickTotal);
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
                map.selected = {};
                var arr = [{"id":"#fortify","action":"hide"}];
                showHide(arr,"Fortify phase. clickState=selectClear.");
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
                var arr = [{"id":"#fortify","action":"show"}];
                showHide(arr,"Fortify phase. clickState=nSelect.");
            }
            if(map.clickState == "nSelectClear"){
                var drawy = map.selected.col % 2 == 0 ? (map.selected.row * this.height) + this.canvasOriginY + 6 : (map.selected.row *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                var drawx = (map.selected.col * this.side) + this.canvasOriginX;
                this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.row][map.selected.col].owner); //clear selected hex

                var drawy = map.selected.nCol % 2 == 0 ? (map.selected.nRow * this.height) + this.canvasOriginY + 6 : (map.selected.nRow *this.height) + this.canvasOriginY + 6 + (this.height / 2);
                var drawx = (map.selected.nCol * this.side) + this.canvasOriginX;
                this.drawHex(drawx, drawy - 6, "#99CC66", "", false, "", map.data[map.selected.nRow][map.selected.nCol].owner); //clear nSelected hex

                map.clickState = null;
                map.selected = {};
                var arr = [{"id":"#fortify","action":"hide"}];
                showHide(arr,"Fortify phase. clickState=nSelectClear.");
            }
        }
    }
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY;
    var x0 = this.width * (map.dataProp.cols);
    var y0 = 25;
    for (var i = 0; i < map.dataProp.users.length; i++) {
        if(map.dataProp.cardsHeld[i].length>0){
            var width2 = 15, height2 = 20;
            var boundingBox = (x0-this.width/6) + " " + ((x0-this.width/6)+width2) + " " + (y0+(this.height/3)+height2) + " " + (y0+(this.height/3));
            console.log("box:", boundingBox);
            if(localX>(x0-this.width/6) && localX<((x0-this.width/6)+width2) && localY<(y0+(this.height/3)+height2) && localY>(y0+(this.height/3))){
                var arr = [{"id":"#log","action":"hide"},{"id":"#cardDisp","action":"show"},];
                showHide(arr, "Card clicking logic.")

                var cardHTML = "";
                for(var j=0;j<map.dataProp.cardsHeld[i].length;j++){
                    cardHTML = cardHTML + "<tr id='"+ map.dataProp.cardsHeld[i][j].id +"'><td><input class='cards' type='checkbox' value='" + map.dataProp.cardsHeld[i][j].id + "' id='"+ map.dataProp.cardsHeld[i][j].id +"check'></td><td>" + map.dataProp.cardsHeld[i][j].desc +"</td><td>" + map.dataProp.cardsHeld[i][j].amount + "</td></tr>";
                }
                $('#cardDisp').html(cardHTML);
                var arr = [{"id":"#cardDisp","action":"show"},{"id":"#cardTrade","action":"show"},{"id":"#cardTradeClose","action":"show"}];
                showHide(arr,"Clicked a card.");
            }
        }
        y0 = y0 + this.height / 1.5; //add to Y coordinate for next player
    }

};


