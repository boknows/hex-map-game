HexagonGrid.prototype.clickEvent = function (e) {
    if(map.dataProp.owners[map.dataProp.turn] == map.email){
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var localX = mouseX - this.canvasOriginX;
        var localY = mouseY - this.canvasOriginY;
        var tile = this.getSelectedTile(localX, localY);
        //Add clicks to a click array for tracking
        if(map.dataProp.turnPhase == "fortify"){
            if(map.data[tile.row][tile.column].owner == map.email){
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
                if(map.data[tile.row][tile.column].owner == map.email){
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
            //Click Logic
            var cube = toCubeCoord(tile.column, tile.row);
            if(map.dataProp.turnPhase == "unitPlacement" && map.data[tile.row][tile.column].owner == map.email && map.dataProp.owners[map.dataProp.turn]==map.email){
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
                    this.drawHexGrid(this.rows, this.cols, this.canvasOriginX, this.canvasOriginY, true);
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
                    var unitsDisp = document.getElementById('units').innerHTML;
                    unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + units + " units placed.</b>";
                    document.getElementById('units').innerHTML = unitsDisp;
                }
            }
            if(map.dataProp.turnPhase == "attack"){
                console.log("Click State Before:" , map.clickState);
                if(map.clickState == null && map.data[tile.row][tile.column].owner == map.email && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].units > 1){
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
                console.log("Click State After:" , map.clickState, map.selected);
            }
            if(map.dataProp.turnPhase == "fortify"){
                console.log("Click State Before:" , map.clickState);

                if(map.clickState == null && map.data[tile.row][tile.column].owner == map.email && map.data[map.clicks[clickTotal].row][map.clicks[clickTotal].col].units > 1 && map.dataProp.fortifiesUsed < map.dataProp.fortifies){
                    map.clickState = "select";
                    map.selected = {col: tile.column, row: tile.row};
                }else if(map.clickState == "select" && map.data[tile.row][tile.column].owner == map.email){
                    console.log
                    if((map.selected.col == tile.column && map.selected.row == tile.row) || (map.data[tile.row][tile.column].owner != map.email)){
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
                }else if(map.clickState == "nSelect" && map.data[tile.row][tile.column].owner == map.email){
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
                $('#attack').hide();
                $('#endTurn').show();
                $('#fortifyButton').show();
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
                $('#fortifyButton').hide();
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
                $('#attack').hide();
                $('#endTurn').show();
                $('#fortifyButton').show();
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
                $('#endTurn').hide();
                $('#attack').css('display','inline');
                console.log("Attack Show!");
                $('#singleAttack').show();
                if(map.data[map.selected.row][map.selected.col].units<5){
                    $('#continuousAttack').hide();
                }else{
                    $('#continuousAttack').show();
                }
                
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
                $('#attack').hide();
                $('#endTurn').show();
                $('#fortifyButton').show();
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
                $('#fortify').hide();
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
                map.selected = {};
                $('#fortify').hide();
            }
        }
    }
};


