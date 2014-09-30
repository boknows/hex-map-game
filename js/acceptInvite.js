function acceptInvite () {
    var data = { param: 'getMapProperties', gameID: $('#game_id').val(), color: $('#colorpicker').val()};
	$.ajax({
        url: "getMap.php",
        type: "POST",
        dataType: 'JSON', 
        data: data,
        success: function(resp){
			var properties = JSON.parse(resp);
			var email = 0;
			for(i=0;i<properties.owners.length;i++){
				if(properties.owners[i] == $('#email').val()){
					email = i;
				}
			}
			properties.colors[email] = $('#colorpicker').val();
			properties = JSON.stringify(properties);
			var data = {param: "updateMapProperties", gameID: $('#game_id').val(), mapProperties: properties};
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
						startGame($('#game_id').val());
					}
				},
			});	
        },
    });	
    
}

function startGame(gameID) {
	console.log(gameID);
}