function updateMap(data, param){
	console.log(data);
	data.param = param;
	data.gameID = $('#game_id').val();
	$.ajax({
	url: "getMap.php",
	data: data,
	type: "POST",
	dataType: 'JSON'
	});
};

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
	console.log("Hit the button!");
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
			if(email == 0){
				mapProperties.owners.push($('#email').val());
				mapProperties.colors.push($('#colorpicker').val());
			}else{
				mapProperties.colors[email] = $('#colorpicker').val();
			}
			console.log(mapProperties);
			var mapPropertiesString = JSON.stringify(mapProperties);
			var data = {param: "updateMapProperties", gameID: $('#game_id').val(), data: mapPropertiesString};
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
					if(resp == "started"){
						startGame($('#game_id').val(), mapArray, mapProperties);
					}
				},
			});	
        },
    });	
    
}

function startGame(gameID, mapArray, mapProperties) {
	console.log(mapProperties);
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
	shuffle(countries);
    //Initial Troop Placement (Country Claiming). Randomly place 1 unit until they're all filled
    var turn = 0;
	var cycle = 0;
	var maxCycles = (countries.length*3)/mapProperties.owners.length;
	
	var cntSplt = [];	//Countries Split array. Contains an array of countries for each player, as well as a total unit count to determine the end of unit placement
	for(i=0;i<mapProperties.owners.length;i++){
		cntSplt.push({arr: [], unitCnt: 0, owner: i, cntTurn: 0});
	}
	for(i=0;i<countries.length;i++){ //Claim all countries, add 1 unit to each
		countries[i].units++;
		cntSplt[turn].arr.push(countries[i]);
		cntSplt[turn].unitCnt++;
		if(turn == (mapProperties.owners.length-1)){
			turn = 0;
			cycle++;
		}else{
			turn++;   
		}
	}
	while(cycle<maxCycles){ //Start at beginning of each players list of countries. Add 1 unit, move to next player. Repeat until Max units achieved.
		cntSplt[turn].arr[cntSplt[turn].cntTurn].units++
		if(cntSplt[turn].cntTurn < cntSplt[turn].arr.length-1){
			cntSplt[turn].cntTurn++;
		}else{
			cntSplt[turn].cntTurn = 0;
		}
		cntSplt[turn].unitCnt++;
		if(turn == (mapProperties.owners.length-1)){
			turn = 0;
			cycle++;
		}else{
			turn++;   
		}
	}
	for(i=0;i<cntSplt.length;i++){
		for(j=0;j<cntSplt[i].arr.length;j++){
			var l = cntSplt[i].arr[j].length;
			var w = cntSplt[i].arr[j].width;
			mapArray[w][l].owner = mapProperties.owners[i];
			mapArray[w][l].units = cntSplt[i].arr[j].units;
			mapArray[w][l].color = mapProperties.colors[i];
		}
	}
	mapProperties.turnPhase = "unitPlacement";
	var mapString = JSON.stringify(mapArray);
	var mapPropertiesString = JSON.stringify(mapProperties);
	var data = {param: "updateAll", gameID: $('#game_id').val(), mapArray: mapString, mapProperties: mapPropertiesString};
	$.ajax({
		url: "getMap.php",
		type: "POST",
		data: data,
		success: function (){
			window.location.reload(true);
		},
	});
	
	
}