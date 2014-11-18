function tradeInCard (cards){
	for(var i=0;i<cards.length;i++){
		switch(cards[i]){
			case "36":
				map.unitsToBePlaced = map.unitsToBePlaced + 8;
		        var unitsDisp = document.getElementById('units').innerHTML;
		        unitsDisp = "Choose a territory to add troops to.<br><b>" + map.unitCnt + "/" + map.unitsToBePlaced + " units placed.</b>";
		        document.getElementById('units').innerHTML = unitsDisp;
		}
		for(var j = 0;j<map.dataProp.cardsHeld[map.dataProp.turn].length;j++){
			if(map.dataProp.cardsHeld[map.dataProp.turn][j].id==cards[i]){
				map.dataProp.cardsHeld[map.dataProp.turn].splice(j, 1);
				console.log(map.dataProp.cardsHeld[map.dataProp.turn]);	
			}
			
		}
	}
}

