function updateMap(data, param) {
    data.param = param;
    data.gameID = $('#game_id').val();
    $.ajax({
        url: "getMap.php",
        data: data,
        type: "POST",
        dataType: 'JSON'
    });
};

var map = {};
map.data = new Array(parseInt($('#rows').val()));
for (var i = 0; i < map.data.length; i++) {
    map.data[i] = new Array(parseInt($('#cols').val()));
}
for(var i=0;i<map.data.length;i++){
   for(var j=0;j<map.data[i].length;j++){
        map.data[i][j] = {
            "type":"water",
            "units":0,
            "n":"",
            "s":"",
            "nw":"",
            "ne":"",
            "sw":"",
            "se":"",
            "owner":"",
            "color":"",
            "connect":"",
            "group":"",
        };
   }
}
map.dataProp = {
    "owners":[],
    "colors":[],
    "turn":0,
    "turnPhase":"fortify",
    "fortifies":6,
    "rows":parseInt($('#rows').val()),
    "cols":parseInt($('#cols').val()),
};
console.log(map);

var hexagonGrid = new HexagonGrid("HexCanvas", 30);
hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, 130, 10, true);

//UI Buttons
var updateMapBtn = document.getElementById('updateMap');
updateMapBtn.addEventListener('click', function(e) { //For the map editor
    var cube = toCubeCoord(map.editMap.col, map.editMap.row);
    map.data[map.editMap.row][map.editMap.col].type = $('#type').val();
    map.data[map.editMap.row][map.editMap.col].owner = $('#owner').val();
    map.data[map.editMap.row][map.editMap.col].units = $('#unitsEdit').val();
    map.data[map.editMap.row][map.editMap.col].color = $('#color').val();
    map.data[map.editMap.row][map.editMap.col].group = $('#group').val();
    map.data[map.editMap.row][map.editMap.col].connect = JSON.parse($('#connect').val());
    if ($('#n').val() != "") {
        map.data[map.editMap.row][map.editMap.col].n = $('#n').val();
        var offset = toOffsetCoord(cube.x, cube.y + 1, cube.z - 1);
        map.data[offset.r][offset.q].s = $('#n').val();
    }
    if ($('#ne').val() != "") {
        map.data[map.editMap.row][map.editMap.col].ne = $('#ne').val();
        var offset = toOffsetCoord(cube.x + 1, cube.y, cube.z - 1);
        map.data[offset.r][offset.q].sw = $('#ne').val();
    }
    if ($('#se').val() != "") {
        map.data[map.editMap.row][map.editMap.col].se = $('#se').val();
        var offset = toOffsetCoord(cube.x + 1, cube.y - 1, cube.z);
        map.data[offset.r][offset.q].nw = $('#se').val();
    }
    if ($('#s').val() != "") {
        map.data[map.editMap.row][map.editMap.col].s = $('#s').val();
        var offset = toOffsetCoord(cube.x, cube.y - 1, cube.z + 1);
        map.data[offset.r][offset.q].n = $('#s').val();
    }
    if ($('#sw').val() != "") {
        map.data[map.editMap.row][map.editMap.col].sw = $('#sw').val();
        var offset = toOffsetCoord(cube.x - 1, cube.y, cube.z + 1);
        map.data[offset.r][offset.q].ne = $('#sw').val();
    }
    if ($('#nw').val() != "") {
        map.data[map.editMap.row][map.editMap.col].nw = $('#nw').val();
        var offset = toOffsetCoord(cube.x - 1, cube.y + 1, cube.z);
        map.data[offset.r][offset.q].se = $('#nw').val();
    }
    var data = {
        data: JSON.stringify(map.data)
    };
    //updateMap(data, "updateMap");
    //map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
    //hexagonGrid.drawHexGrid(map.dataProp.rows, map.dataProp.cols, hexagonGrid.canvasOriginX, hexagonGrid.canvasOriginY, true);
    
}, false);

function HexagonGrid(canvasId, radius) {
    this.radius = radius;
    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    this.context = map.ctx;
    this.canvas = map.canvas;
    this.canvasOriginX = 50;
    this.canvasOriginY = 10;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};

HexagonGrid.prototype.drawHex = function (x0, y0, fillColor, debugText, highlight, highlightColor, owner) {  
    this.context.font="bold 12px Helvetica";
    this.owner = owner;
    this.context.strokeStyle = "#000000";
    this.context.lineWidth = 1;
    this.context.lineCap='round';
    
    var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
    if(tile.row<3){
        //console.log(tile.row, tile.column, x0, this.width, this.side, y0)
    }
    var numberOfSides = 6,
    size = this.radius,
    Xcenter = x0 + (this.width / 2),
    Ycenter = y0 + (this.height / 2);
    this.context.beginPath();
    this.context.lineWidth = 1.5;
    this.context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
    for (var i = 1; i <= numberOfSides;i += 1) {
        this.context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    if(typeof(map.data[tile.row][tile.column]) != "undefined"){
        if (fillColor && highlight == false && map.data[tile.row][tile.column].type =="land") {
            this.context.fillStyle = map.data[tile.row][tile.column].color;
        }else{
            this.context.fillStyle = fillColor;
        }
    }
    

    if (highlight == true){
        this.context.fillStyle = highlightColor;
        this.context.globalAlpha=0.65;
    }
    this.context.fill();
    this.context.closePath();
    this.context.stroke();
    
    this.context.globalAlpha=1;


    if(map.data[tile.row][tile.column].type != "water"){
        //Draw smaller hex inside bigger hex - v2
        var numberOfSides = 6,
        size = this.radius-4.75,
        Xcenter = x0 + (this.width / 2),
        Ycenter = y0 + (this.height / 2);
        this.context.fillStyle = fillColor;
        this.context.strokeStyle = map.data[tile.row][tile.column].color;
        this.context.beginPath();
        this.context.lineWidth = 6;
        this.context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
        for (var i = 1; i <= numberOfSides;i += 1) {
            this.context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        }
        this.context.fill();
        this.context.closePath();
        this.context.stroke();

        //if defensive boost active, draw grey dotted hex inside of owners colored hex.
        var index = 0;
        for(var i=0;i<map.dataProp.users.length;i++){
            if(map.dataProp.users[i]==map.data[tile.row][tile.column].owner){
                index = i;
            }
        }
        var defTrigger = false;
        for(var i=0;i<map.dataProp.turnModifiers[index].length;i++){
            if(map.dataProp.turnModifiers[index][i].type=="defensiveBoost"){
                defTrigger = true;
            }
        }
        if(defTrigger == true){
            var numberOfSides = 6,
            size = this.radius-12,
            Xcenter = x0 + (this.width / 2),
            Ycenter = y0 + (this.height / 2);
            this.context.strokeStyle = "#929292"
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
            for (var i = 1; i <= numberOfSides;i += 1) {
                this.context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
            }
            this.context.fill();
            this.context.closePath();
            this.context.stroke();
        }
        

        //Print number of units
        this.context.textAlign="center"; 
        this.context.textBaseline = "middle";
        this.context.font = 'bold 13pt Arial';
        //Code for contrasting text with background color
        /*var clr = getContrastYIQ(map.data[tile.row][tile.column].color); //contrast against player color 
        var clr = getContrastYIQ(fillColor); //contrast against land color (fillColor)
        this.context.fillStyle = clr;
        */
        this.context.fillStyle = "#000000";
        this.context.fillText(map.data[tile.row][tile.column].units, x0 + (this.width / 2) , y0 + (this.height / 2));
        this.context.fillStyle = "";
    }
};

HexagonGrid.prototype.drawHexBorders = function (x0, y0) {  
    var tile = this.getSelectedTile(x0 + this.width - this.side, y0);
    if(map.data[tile.row][tile.column].s != ""){
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].s;
        this.context.moveTo(x0 + this.side, y0 + this.height);
        this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
        this.context.stroke();
    }
    if(map.data[tile.row][tile.column].n != ""){
        
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].n;
        this.context.moveTo(x0 + this.side, y0);
        this.context.lineTo(x0 + this.width - this.side, y0);
        this.context.stroke();
    }
    if(map.data[tile.row][tile.column].ne != ""){
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].ne;
        this.context.moveTo(x0 + this.side, y0);
        this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
        this.context.stroke();
    }
    if(map.data[tile.row][tile.column].se != ""){
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].se;
        this.context.moveTo(x0 + this.width, y0 + (this.height / 2));
        this.context.lineTo(x0 + this.side, y0 + this.height);
        this.context.stroke();
    }
    if(map.data[tile.row][tile.column].sw != ""){
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].sw;
        this.context.moveTo(x0 + this.width - this.side, y0 + this.height);
        this.context.lineTo(x0, y0 + (this.height/2));
        this.context.stroke();
    }
    if(map.data[tile.row][tile.column].nw != ""){
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle=map.data[tile.row][tile.column].nw;
        this.context.moveTo(x0, y0 + (this.height/2));
        this.context.lineTo(x0 + this.width - this.side, y0);
        this.context.stroke();
    }
};

//Recusivly step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function() {
    var x = 0, y = 0;
    var layoutElement = this.canvas;
    var bound = layoutElement.getBoundingClientRect();
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);
        
        return { x: bound.left, y: bound.top };
    }
}

function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(1,3),16);
    var g = parseInt(hexcolor.substr(3,3),16);
    var b = parseInt(hexcolor.substr(5,3),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;
    this.rows = rows;
    this.cols = cols;
    var currentHexX;
    var currentHexY;
    var debugText = "";
    var offsetColumn = false;
    var hexNum = 1;
    for (var col = 0; col < cols; col++) {
        for (var row = 0; row < rows; row++) {
            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }
            if (isDebug) {
                debugText = hexNum;
                hexNum++;
            }
            if(map.data[row][col].type=="land"){  
                this.drawHex(currentHexX, currentHexY, "#99CC66", debugText, false, map.data[row][col].owner);
            }else if(map.data[row][col].type=="water"){
                this.drawHex(currentHexX, currentHexY, "#3333FF", "", false, map.data[row][col].owner);
            }else if(map.data[row][col].type=="grass"){
                this.drawHex(currentHexX, currentHexY, "#009900", debugText, false, map.data[row][col].owner);
            }else if(map.data[row][col].type=="desert"){
                this.drawHex(currentHexX, currentHexY, "#F5E8C1", debugText, false, map.data[row][col].owner);
            }else if(map.data[row][col].type=="mountains"){
                this.drawHex(currentHexX, currentHexY, "#996600", debugText, false, map.data[row][col].owner);
            }   
        }
        offsetColumn = !offsetColumn;
    }

    var offsetColumn = false;
    for (var col = 0; col < cols; col++) { //Draw borders separately so they don't get overlapped by other graphics. 
        for (var row = 0; row < rows; row++) {
            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }
            this.drawHexBorders(currentHexX, currentHexY);
        }
        offsetColumn = !offsetColumn;
    }

    if(map.dataProp.turnPhase == "unitPlacement"){
        for(var i=0, len=map.unitPlacement.length; i<len; i++){
            var y = map.unitPlacement[i].col % 2 == 0 ? (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 : (map.unitPlacement[i].row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
            var x = (map.unitPlacement[i].col * this.side) + this.canvasOriginX;
            this.drawHex(x, y - 6, "", "", true, "#00F2FF", map.data[map.unitPlacement[i].row][map.unitPlacement[i].col].owner); 
        }
    }
};

HexagonGrid.prototype.drawHexAtColRow = function(column, row, color) {
    var drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    var drawx = (column * this.side) + this.canvasOriginX;

    this.drawHex(drawx, drawy, color, "");
};

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
                        var trigger = false;
                        for(var i=0;i<map.neighbors.length;i++){
                            if(cube.x == map.neighbors[i].x && cube.y == map.neighbors[i].y && cube.z == map.neighbors[i].z){
                                var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                                if(map.data[offset.r][offset.q].owner != map.username && map.data[offset.r][offset.q].type != "water"){
                                    trigger = true;
                                    map.selected.nCol = tile.column;
                                    map.selected.nRow = tile.row;
                                    map.attack = {attX: map.selected.row, attY: map.selected.col, defX: map.selected.nRow, defY: map.selected.nCol};
                                    map.clickState = "nSelect";
                                }
                            }
                        }
                        if(trigger == false){
                            map.clickState = "selectClear";
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
                        var trigger = false;
                        for(var i=0;i<map.neighbors.length;i++){
                            if(cube.x == map.neighbors[i].x && cube.y == map.neighbors[i].y && cube.z == map.neighbors[i].z){
                                var offset = toOffsetCoord(map.neighbors[i].x,map.neighbors[i].y,map.neighbors[i].z);
                                if(map.data[offset.r][offset.q].owner == map.username){
                                    trigger = true;
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
                        if(trigger == false){
                           map.clickState = "selectClear";
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
            if(localX>(x0-this.width/6) && localX<((x0-this.width/6)+width2) && localY<(y0+(this.height/3)+height2) && localY>(y0+(this.height/3))){
                var cardHTML = "";
                if((map.dataProp.turn == i && map.dataProp.users[i]==map.username) || map.dataProp.users[i]==map.username){                    for(var j=0;j<map.dataProp.cardsHeld[i].length;j++){
                        cardHTML = cardHTML + "<tr id='"+ map.dataProp.cardsHeld[i][j].id +"'><td><input class='cards' type='checkbox' value='" + map.dataProp.cardsHeld[i][j].id + "' id='"+ map.dataProp.cardsHeld[i][j].id +"check'></td><td>" + map.dataProp.cardsHeld[i][j].desc +"</td></tr>";
                    }
                    $('#cardDisp').html(cardHTML);
                    var arr = [{"id":"#cardDisp","action":"show"},{"id":"#cardTrade","action":"show"},{"id":"#cardTradeClose","action":"show"},{"id":"#log","action":"hide"}];
                    showHide(arr,"Clicked a card.");
                }
            }
        }
        y0 = y0 + this.height / 1.5; //add to Y coordinate for next player
    }

};


