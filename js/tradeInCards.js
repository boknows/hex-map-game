function tradeInCard (cards){
	for(var i=0;i<cards.length;i++){
		if(cards[i]>=1 && cards[i]<=18){
			map.unitsToBePlaced = map.unitsToBePlaced + 4;
	        var unitsDisp = document.getElementById('units').innerHTML;
	        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + map.unitsToBePlaced + " units placed.</b>";
	        document.getElementById('units').innerHTML = unitsDisp;
		}
		if(cards[i]>=19 && cards[i]<=30){
			map.unitsToBePlaced = map.unitsToBePlaced + 6;
	        var unitsDisp = document.getElementById('units').innerHTML;
	        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + map.unitsToBePlaced + " units placed.</b>";
	        document.getElementById('units').innerHTML = unitsDisp;
		}
		if(cards[i]>=31 && cards[i]<=34){
			map.unitsToBePlaced = map.unitsToBePlaced + 8;
	        var unitsDisp = document.getElementById('units').innerHTML;
	        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + map.unitsToBePlaced + " units placed.</b>";
	        document.getElementById('units').innerHTML = unitsDisp;
		}
		if(cards[i]>=35 && cards[i]<=38){
			map.dataProp.turnModifiers[map.dataProp.turn].push({"type":"defensiveBoost","turns":2,"startTurn":map.dataProp.turn});
		}
		if(cards[i]>=39 && cards[i]<=42){
			map.dataProp.turnModifiers[map.dataProp.turn].push({"type":"offensiveBoost","turns":1});
		}
		if(cards[i]>=43 && cards[i]<=46){
			map.dataProp.turnModifiers[map.dataProp.turn].push({"type":"increasedMovement","turns":1});
			map.dataProp.fortifiesTemp = map.dataProp.fortifies;
			map.dataProp.fortifies = map.dataProp.fortifies*2;
		}
		if(cards[i]>=47 && cards[i]<=48){
			map.dataProp.turnModifiers[map.dataProp.turn].push({"type":"decreasedMovement","turns":1,"startTurn":map.dataProp.turn});
			map.dataProp.fortifiesTemp = map.dataProp.fortifies;
			map.dataProp.fortifies = 0;
		}
		if(cards[i]>=49 && cards[i]<=50){
			randomTroopBolster(12, map.username);
		}
		for(var j = 0;j<map.dataProp.cardsHeld[map.dataProp.turn].length;j++){
			if(map.dataProp.cardsHeld[map.dataProp.turn][j].id==cards[i]){
				$('#'+map.dataProp.cardsHeld[map.dataProp.turn][j].id+'check').prop( "checked", false );
				$('#'+map.dataProp.cardsHeld[map.dataProp.turn][j].id).hide();
				map.dataProp.cardsUsed[map.dataProp.turn].push(map.dataProp.cardsHeld[map.dataProp.turn][j]);
				map.dataProp.cardsHeld[map.dataProp.turn].splice(j, 1);
				console.log(map.dataProp.cardsHeld[map.dataProp.turn]);	

			}
		}
		var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
    	updateMap(data, "updateAll");

	}
}

function randomTroopBolster(troops, username){
	var userIndex = 0, terr = [], trpInc = 0;
	for(var i=0;i<map.dataProp.users.length;i++){
		if(username == map.dataProp.users[i]){
			userIndex = i;
		}
	}

	//collect row/col for all users territories
	for(var i=0;i<map.data.length;i++){
		for(var j=0;j<map.data[i].length;j++){
			if(map.data[i][j].owner==username){
				terr.push({row: i, col: j, units: map.data[i][j].units});
			}
		}
	}
	shuffle(terr);
	
	//add a units
	if(terr.length<4){ //how many units per insertion. 
		trpInc = parseInt(troops/terr.length);
	}else{
		trpInc = 3;
	}
	for(var i=0;i<parseInt(troops/trpInc);i++){
		terr[i].units = parseInt(terr[i].units)+trpInc;
		console.log("added "+trpInc+" to the map.");
	}

	//add back to map
	for(var i=0;i<terr.length;i++){
		map.data[terr[i].row][terr[i].col].units = terr[i].units;
	}
	var data = {
            mapProperties: JSON.stringify(map.dataProp),
            mapArray: JSON.stringify(map.data),
            mapLog: JSON.stringify(map.log)
        };
    updateMap(data, "updateAll");

}