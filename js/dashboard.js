var Games = function(){
    this.getData = function(callback){
        $.ajax({
            url: "getGames.php",
            type: "POST",
            dataType: 'JSON'
        }).success(callback);
    };
};
var games = new Games();
games.getData(function(data){
    //var data = JSON.parse(gameData);
    console.log(data);
	var txt = "<thead><tr><th>GameID</th><th>Created</th><th>Name</th></tr></thead><tbody>";
	for(i=0, len=data.gameID.length; i<len; i++){
		txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i].date + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td></tr>";
	}
	txt = txt + "</tbody></table>";
	console.log(txt);
	document.getElementById('game_table').innerHTML = txt;	
	
});