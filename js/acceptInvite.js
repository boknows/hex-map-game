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
	console.log(mapArray);
	console.log(mapProperties);
	//Roll dice to determine order of placement
	var rolls = [];
	var order = []; //separate array to keep order of rolls
	for(i=0;i<mapProperties.owners.length;i++){
		var tmp = rollDice();
		rolls.push(tmp);
		order.push(tmp);
	}
	rolls = rolls.sort(function(a, b){return b-a});
	console.log(order);
	console.log(rolls);
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
	console.log("Owners", owners);
	mapProperties.owners = owners;
	mapProperties.colors = colors;
	console.log("Map Owners", mapProperties);
	

	
}