function acceptInvite () {
    var data = { param: 'getAll', gameID: $('#game_id').val(), color: $('#colorpicker').val()};
	$.ajax({
        url: "getMap.php",
        type: "POST",
        dataType: 'JSON', 
        data: data,
        success: function(resp){
			var mapProperties = JSON.parse(resp.mapProperties);
			var mapArray = JSON.parse(resp.mapArray);
			var email = 0;
			for(i=0;i<mapProperties.owners.length;i++){
				if(mapProperties.owners[i] == $('#email').val()){
					email = i;
				}
			}
			mapProperties.colors[email] = $('#colorpicker').val();
			var mapPropertiesString = JSON.stringify(mapProperties);
			var data = {param: "updateMapProperties", gameID: $('#game_id').val(), mapProperties: mapPropertiesString};
			$.ajax({
				url: "getMap.php",
				type: "POST",
				dataType: 'JSON', 
				data: data,
			});
			
			var data = {gameID: $('#game_id').val()};
            $.ajax({
				url: "getGame.php",
				type: "POST",
				dataType: 'JSON', 
				data: data,
				success: function(resp){
					//window.location.replace("hexagon.php?id=" + $('#game_id').val());
					if(resp == "started"){
						startGame($('#game_id').val(), mapArray, mapProperties);
					}
				},
			});	
        },
    });	
    
}

function startGame(gameID, mapArray, mapProperties) {
	//Roll dice to determine order of placement
	var rolls = [];
	var order = []; //separate array to keep order of rolls
	for(i=0;i<mapProperties.owners.length;i++){
		var tmp = rollDice();
		rolls.push(tmp);
		order.push(tmp);
	}
	rolls = rolls.sort(function(a, b){return b-a});
	var owners = [];
	var colors = [];
	for(i=0;i<mapProperties.owners.length;i++){ //Sort owners/colors by rolls
		for(j=0;j<order.length;j++){
			if(rolls[i] == order[j]){
				owners[i] = mapProperties.owners[j];
				colors[i] = mapProperties.colors[j];
			}
		}
	}
	mapProperties.owners = owners;
	mapProperties.colors = colors;

    //Scan Map, Count number of Land pieces
    var countries = 0;
    for(i=0;i<mapArray.length;i++){
        for(j=0;j<mapArray[i].length;j++){
            if(mapArray[i][j].type == "land"){
                countries++;   
            }
        }
    }
    console.log("Countries: ", countries);
	
    //Initial Troop Placement. Randomly place 1 unit until they're all filled
    var turn = 0;   var width = mapArray.length-1;    var length = mapArray[0].length-1;
    for(i=0;i<countries;i++){
        var trig = false;
        while(trig == false){
            var randWidth = Math.floor((Math.random() * width))+1; 
            var randLength = Math.floor((Math.random() * length))+1; 
            if(mapArray[randWidth][randLength].type == "land" && typeof(mapArray[randWidth][randLength].owner) != "undefined" && mapArray[randWidth][randLength].owner != ""){
                console.log(randWidth + " " + randLength + " " + mapArray[randWidth][randLength].type + "=land ", typeof(mapArray[randWidth][randLength].owner) + "!=undefined ", mapArray[randWidth][randLength].owner + "!=blank");
                mapArray[randWidth][randLength].owner = mapProperties.owners[turn];
                mapArray[randWidth][randLength].units = parseInt(mapArray[randWidth][randLength].units) + 1;
                trig = true;
                if(turn == mapProperties.owners.length){
                    turn = 0;
                }else{
                    turn++;   
                }
            }  
        } 
    }
    console.log(mapArray);

	
}