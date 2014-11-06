var Games = function(){
    this.getData = function(callback){
        $.ajax({
            url: "getGames.php",
            type: "POST",
			data: {param: 'active'},
            dataType: 'JSON'
        }).success(callback);
    };
};
var games = new Games();
games.getData(function(data){
    //var data = JSON.parse(gameData);
	var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th><th>Status</th></tr></thead><tbody>";
	for(i=0, len=data.gameID.length; i<len; i++){
		txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i].date + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td><td>" + data.status[i] + "</td></tr>";
	}
	txt = txt + "</tbody></table>";
	console.log(txt);
	$('#game_table').html(txt);
	
});

var Games = function(){
    this.getData = function(callback){
        $.ajax({
            url: "getGames.php",
            type: "POST",
			data: {param: 'public'},
            dataType: 'JSON'
        }).success(callback);
    };
};
var games = new Games();
games.getData(function(data){
    //var data = JSON.parse(gameData);
	var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th></tr></thead><tbody>";
	for(i=0, len=data.gameID.length; i<len; i++){
		txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i].date + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td></tr>";
	}
	txt = txt + "</tbody></table>";
	console.log(txt);
	$('#publicGames').html(txt);
	
});

function createGame() {
	var data = { 	
                    colorpicker: $('#colorpicker').val(),
					gameName: $('#name').val(),
					players: [$('#username').val(),
                    $('#player1').val(), 
				    $('#player2').val(),
					$('#player3').val(),
					$('#player4').val(),
					$('#player5').val(),
					$('#player6').val(),
					$('#player7').val()],
					minPlayers: $('#minPlayers').val(),
					maxPlayers: $('#maxPlayers').val(),
					publicPrivate: $('#publicPrivate').val(),
				};
        $.ajax({
            url: "createGame.php",
            type: "POST",
            dataType: 'JSON', 
            data: data,
            success: function(){
                //Clear values from Create Game Form
				$('#name').val('');
				$('#player1').val('');
				$('#player2').val('');
				$('#player3').val('');
				$('#player4').val('');
				$('#player5').val('');
				$('#player6').val('');
				$('#player7').val('');
            }
        }).success(function(){
            var Games = function(){
                this.getData = function(callback){
                    $.ajax({
                        url: "getGames.php",
                        type: "POST",
						data: {param: 'active'},
                        dataType: 'JSON'
                    }).success(callback);
                };
            };
            var games = new Games();
            games.getData(function(data){
                //var data = JSON.parse(gameData);
                console.log(data);
                var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th><th>Status</th></tr></thead><tbody>";
                for(i=0, len=data.gameID.length; i<len; i++){
                    txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i].date + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td><td>" + data.status[i] + "</td></tr>";
                }
                txt = txt + "</tbody></table>";
				$('#game_table').html(txt);
            });  
        });
}

