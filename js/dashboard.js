
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
	var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th><th>Status</th></tr></thead><tbody>";
	for(i=0, len=data.gameID.length; i<len; i++){
		txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i] + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td>";
		if(data.mapProperties[i].owners[data.mapProperties[i].turn] == $('#username').val() && data.mapProperties[i].turnPhase != "invites"){
			txt = txt + "<td>Your turn!</td><tr>";
		}else if(data.mapProperties[i].turnPhase == "invites"){
			txt = txt + "<td>Invite Phase</td><tr>";
		}else{
			txt = txt + "<td></td><tr>";
		}
	}
	txt = txt + "</tbody></table>";
	$('#game_table').html(txt);
	
});


var GamesPublic = function(){
    this.getData = function(callback){
        $.ajax({
            url: "getGames.php",
            type: "POST",
			data: {param: 'public'},
            dataType: 'JSON'
        }).success(callback);
    };
};

var gamesPublic = new GamesPublic();
gamesPublic.getData(function(data){
	var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th></tr></thead><tbody>";

	for(i=0, len=data.length; i<len; i++){
		txt = txt + "<tr><td>" + data[i].gameID + "</td><td>" + data[i].created + "</td><td><a href='hexagon.php?id=" + data[i].gameID + "'>" + data[i].game_name +  "</a></td></tr>";
	}
	txt = txt + "</tbody></table>";
	
	$('#publicGames').html(txt);
	
});

