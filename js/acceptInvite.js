//Setup Accept Game Table info
var data = {gameID: $('#game_id').val(), param: "getAll"};   
$.ajax({
    url: "getMap.php",
    data: data,
    type: "POST",
    dataType: 'JSON',
    success: function(resp){
        var dataProp = JSON.parse(resp.mapProperties);
        var data = JSON.parse(resp.mapArray);
        var inviteText = "<tr><td>GameID:</td><td>" + $('#game_id').val() + "</td></tr><tr><td>Game Name:</td><td>"  + resp.game_name + "</td></tr>";
        inviteText = inviteText + "<tr><td><u><b>Players</b></u></td><td></td></tr>";
        var users = {users: dataProp.users};
        $.ajax({
            url: "getUserData.php",
            data: users,
            type: "POST",
            dataType: 'JSON',
            success: function (e){
                console.log(e);
            },
        });

        for(var i=0;i<dataProp.users.length;i++){
            inviteText = inviteText + "<tr><td>" + dataProp.users[i] + "</td><td>";
            if(dataProp.creator==dataProp.owners[i]){
                inviteText = inviteText + "<b>Creator</b></td><tr>";
            }else{
                inviteText = inviteText + "<b>Invited</b></td><tr>";
            }
        }
        $('#inviteText').html(inviteText);
    }
});

var data = {param: "active"};
$.ajax({
    url: "getGames.php",
    data: data,
    type: "POST",
    dataType: 'JSON',
    success: function (e){
        
    },
});



function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

function acceptInvite() {
    var data = {
        param: 'getAll',
        gameID: $('#game_id').val(),
        color: $('#colorpicker').val()
    };
    $.ajax({
        url: "getMap.php",
        type: "POST",
        dataType: 'JSON',
        data: {
            param: "getAll",
            gameID: $('#game_id').val(),
            email: $('#email').val()
        },
        success: function(resp) {
            var dataProp = JSON.parse(resp.mapProperties);
            var errors = [];
            for (var i = 0; i < dataProp.colors.length; i++) {
                if (dataProp.colors[i] == $('#colorpicker').val()) {
                    errors.push("That color is already chosen. Please choose another.");
                }
            }
            if (errors.length > 0) {
                var errorString = "";
                for (var i = 0; i < errors.length; i++) {
                    errorString = errorString + errors[i];
                }
                alert(errorString);
            } else {
                $.ajax({
                    url: "getMap.php",
                    type: "POST",
                    dataType: 'JSON',
                    data: data,
                    success: function(resp) {
                        var mapProperties = JSON.parse(resp.mapProperties);
                        var mapArray = JSON.parse(resp.mapArray);
                        var email = 0;
                        var public = false;
                        for (var i = 0; i < mapProperties.owners.length; i++) {
                            if (mapProperties.owners[i] == $('#email').val()) {
                                email = i;
                            }
                        }
                        if (email == 0) { //If player isn't in owners list, they are joining a public game without being invited
                            mapProperties.owners.push($('#email').val());
                            mapProperties.users.push($('#username').val());
                            mapProperties.colors.push($('#colorpicker').val());
                            public = true;
                        } else {
                            mapProperties.colors[email] = $('#colorpicker').val();
                        }
                        var mapPropertiesString = JSON.stringify(mapProperties);
                        var data = {
                            param: "updateMapProperties",
                            gameID: $('#game_id').val(),
                            data: mapPropertiesString,
                            pubPriv: public
                        };
                        $.ajax({
                            url: "getMap.php",
                            type: "POST",
                            dataType: 'JSON',
                            data: data,
                        });

                        var data = {
                            gameID: $('#game_id').val(),
                            pubPriv: public
                        };
                        $.ajax({
                            url: "getGame.php",
                            type: "POST",
                            dataType: 'JSON',
                            data: data,
                            success: function(resp) {
                                if (resp == "started") {
                                    startGame($('#game_id').val(), mapArray, mapProperties);
                                } else if (resp == "accepted") {
                                    window.location.reload(true);
                                }
                            },
                        });
                    },
                });
            }
        }
    })



}

function startGame(gameID, mapArray, mapProperties) {
    var mapLog = []; //History log
    var order = []; //track order
    for (var i = 0; i < mapProperties.owners.length; i++) {
        order[i] = mapProperties.owners[i];
    }
    //Randomize order of owners
    shuffle(order);
    var owners = [];
    var colors = [];
    var users = [];
    for (var i = 0; i < mapProperties.owners.length; i++) { //Update owners/colors based on shuffle
        for (var j = 0; j < order.length; j++) {
            if (mapProperties.owners[i] == order[j]) {
                colors[j] = mapProperties.colors[i];
                users[j] = mapProperties.users[i];
            }
        }
    }
    mapProperties.users = users;
    mapProperties.owners = order;
    mapProperties.colors = colors;

    //Scan Map, Count number of Land pieces
    var countries = [];
    for (var i = 0; i < mapArray.length; i++) {
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j].type == "land") {
                countries.push({
                    width: i,
                    length: j,
                    owner: "",
                    units: 0
                });
            }
        }
    }
    shuffle(countries);
    //Initial Troop Placement (Country Claiming). Randomly place 1 unit until they're all filled
    var turn = 0;
    var cycle = 0;
    var maxCycles = (countries.length * 3) / mapProperties.owners.length;

    var cntSplt = []; //Countries Split array. Contains an array of countries for each player, as well as a total unit count to determine the end of unit placement
    var cntSpltProp = [];
    for (var i = 0; i < mapProperties.owners.length; i++) {
        cntSplt.push([]);
        cntSpltProp.push({
            cntTurn: 0,
            unitCnt: 0
        });
    }
    for (var i = 0; i < countries.length; i++) { //add 1 unit to each country for claiming purposes
        countries[i].units++;
    }
    var time = new Date().getTime();
    for (var i = 0; i < countries.length; i++) {
        cntSplt[turn].push(countries[i]); //Add a claimed country to a specific players country array. 
        mapLog.push({
            time: time,
            msg: mapProperties.users[turn] + " claims Row: " + countries[i].width + " Col: " + countries[i].length + ". 1 unit added."
        });
        if (turn == (mapProperties.owners.length - 1)) {
            turn = 0;
            cycle++;
        } else {
            turn++;
        }
    }
    for (var i = cycle; i < maxCycles;) {
        var cntTurn = cntSpltProp[turn].cntTurn;
        cntSplt[turn][cntTurn].units++
        if (cntTurn < cntSplt[turn].length - 1) {
            cntSpltProp[turn].cntTurn++;
        } else {
            cntSpltProp[turn].cntTurn = 0;
        }
        cntSpltProp[turn].unitCnt++;
        if (turn == (mapProperties.owners.length - 1)) {
            turn = 0;
            i++;
        } else {
            turn++;
        }
        console.log(i, maxCycles);

    }

    for (var i = 0; i < cntSplt.length; i++) {
        for (var j = 0; j < cntSplt[i].length; j++) {
            var l = cntSplt[i][j].length;
            var w = cntSplt[i][j].width;
            mapArray[w][l].owner = mapProperties.owners[i];
            mapArray[w][l].units = cntSplt[i][j].units;
            mapArray[w][l].color = mapProperties.colors[i];
        }
    }

    //Create Card Deck
	var cards = [];
	var type = ['hexagon','square','triangle'];
	var cardID = 0;
	for(var i=0;i<14;i++){
		for(var j=0;j<type.length;j++){
			cards.push({id: cardID, cardType: type[j]});
			cardID++;
		}
	}
	for(var i=0;i<4;i++){
		cards.push({id: cardID, cardType: "wild"});
		cardID++;
	}
	shuffle(cards);
	mapProperties.cardDeck = cards;
	mapProperties.cardsHeld = [];
	mapProperties.cardsUsed = [];
	mapProperties.cardBonuses = [4,6,8,10,12,15];
	mapProperties.winCard = false;
    mapProperties.turnPhase = "unitPlacement";
    var mapString = JSON.stringify(mapArray);
    var mapPropertiesString = JSON.stringify(mapProperties);
    var mapLogString = JSON.stringify(mapLog);
    var data = {
        param: "updateAll",
        gameID: $('#game_id').val(),
        mapArray: mapString,
        mapProperties: mapPropertiesString,
        mapLog: mapLogString
    };
    $.ajax({
        url: "getMap.php",
        type: "POST",
        data: data,
        success: function() {
            window.location.reload(true);
        },
    });


}