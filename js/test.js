//Test for turnModifiers
var mapTest = {
	dataProp: {
		turnModifiers: [[{"type":"increasedMovement","turns":1,"startTurn":0}],[]],
		turn: 0,
		eliminated: [],
		owners: ["bo_knows","bo_knows2"]
	},
};
console.log("Main:", mapTest);

//increment turnModifier bonuses
for(var x=0;x<6;x++){
	console.log("Turn:", mapTest.dataProp.turn);
	console.log("Array:",mapTest.dataProp.turnModifiers);
	for(var i=0; i<mapTest.dataProp.turnModifiers.length;i++){
		console.log(mapTest.dataProp.turnModifiers[i].length);
	    for(var j=0;j<mapTest.dataProp.turnModifiers[i].length;j++){
	        if(mapTest.dataProp.turnModifiers[i][j].type=="offensiveBoost" || mapTest.dataProp.turnModifiers[i][j].type=="increasedMovement"){
	            mapTest.dataProp.turnModifiers[i].splice(j, 1);
	            console.log("removed OffensiveBoost or increasedMovement");
	        }
	        if(mapTest.dataProp.turnModifiers[i][j].type=="defensiveBoost" && mapTest.dataProp.turnModifiers[i][j].startTurn == mapTest.dataProp.turn){
	            mapTest.dataProp.turnModifiers[i].splice(j, 1);
	            console.log("removed defensiveBoost or decreased Movement");
	        }
	    }
	}
	//End Turn
	if (mapTest.dataProp.turn == mapTest.dataProp.owners.length - 1) {
        mapTest.dataProp.turn = 0;
    } else {
        mapTest.dataProp.turn = parseInt(mapTest.dataProp.turn) + 1;
        for(var i =0;i<mapTest.dataProp.eliminated;i++){
            if(mapTest.dataProp.users[mapTest.dataProp.turn] == mapTest.dataProp.eliminated[i]){
                if (mapTest.dataProp.turn == mapTest.dataProp.owners.length - 1) {
                    mapTest.dataProp.turn = 0;
                } else {
                    mapTest.dataProp.turn = parseInt(mapTest.dataProp.turn) + 1;
                }
            }
        }
    }
}
