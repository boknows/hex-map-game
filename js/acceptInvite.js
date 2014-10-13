function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

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
	var order = []; //track order
	for(i=0;i<mapProperties.owners.length;i++){
		order[i] = mapProperties.owners[i];
	}
	//Randomize order of owners
	shuffle(order);
	var owners = [];
	var colors = [];
	for(i=0;i<mapProperties.owners.length;i++){ //Update owners/colors based on shuffle
		for(j=0;j<order.length;j++){
			if(mapProperties.owners[i] == order[j]){
				colors[j] = mapProperties.colors[i];
			}
		}
	}
	mapProperties.owners = order;
	mapProperties.colors = colors;

    //Scan Map, Count number of Land pieces
	var countries = [];
    for(i=0;i<mapArray.length;i++){
        for(j=0;j<mapArray[i].length;j++){
            if(mapArray[i][j].type == "land"){
				countries.push({width: i, length: j, owner: "", units: 0});
            }
        }
    }

    //Initial Troop Placement (Country Claiming). Randomly place 1 unit until they're all filled
    var turn = 0;
	var cycle = 0;
	var maxCycles = (countries.length*3)/mapProperties.owners.length;
	console.log("Length:", mapProperties.owners);

	//Fill all countries with 1 unit
	for(i=0;i<countries.length;i++){
		if(countries[i].owner == ""){
			countries[i].owner = mapProperties.owners[turn];
			countries[i].units++;
			if(turn == (mapProperties.owners.length-1)){
				turn = 0;
				cycle++;
			}else{
				turn++;   
			}
		}
	}
	
	//Figure out first country in list available for owner who's turn it is
	function nextTurn (owner){
		var nxTurn = 0;
		for(i=0;i<countries.length;i++){
			if(countries[i].owner == owner){
				return i;
			}
		}
	}
	nxTurn = nextTurn(mapProperties.owners[turn]);
	
	while(cycle<maxCycles){
		console.log("Turn:", turn, " " , nxTurn, " Cycle:", cycle);
		countries[nxTurn].units++;
		if(turn == (mapProperties.owners.length-1)){
			turn = 0;
			cycle++;
		}else{
			turn++;   
		}
		if(nxTurn<countries.length-1){
			nxTurn++;
		}else{
			nxTurn = nextTurn(mapProperties.owners[turn]);
		}
	}
	
	var cnt1 = 0; var cnt2 = 0; var cnt3 = 0;
	for(i=0;i<countries.length;i++){
		if(countries[i].owner=="bo_knows@cfiresim.com"){
			cnt1 = cnt1 + countries[i].units;
		}
		if(countries[i].owner=="bo_knows3@cfiresim.com"){
			cnt2 = cnt2 + countries[i].units;
		}
		if(countries[i].owner=="lawrence.boland@gmail.com"){
			cnt3 = cnt3 + countries[i].units;
		}
	}
	console.log("Counts: " , cnt1, " ", cnt2, " ", cnt3);

	console.log("MaxCycles:", maxCycles);
	console.log("End cycles:", cycle);
	//Initial Troop Placement (Fill up countries)
	
	console.log(countries);

	
}