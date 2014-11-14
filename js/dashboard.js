//Test for card system
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
console.log(cards);

//Print Hexagon graphic for greeting.
var welcome = document.getElementById("welcomeCanvas"); 
var ctx = welcome.getContext('2d');
var username = $('#username').val();

var radius = 25;
var height = Math.sqrt(3) * radius;
var width = 2 * radius;
var side = (3 / 2) * radius;
var numberOfSides = 6,
size = radius,
Xcenter = 10 + (width / 2),
Ycenter = 10 + (height / 2);
ctx.beginPath();
ctx.lineWidth = 1.5;
ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
for (var i = 1; i <= numberOfSides;i += 1) {
	ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
}
ctx.fill();
ctx.closePath();
ctx.stroke();

//Draw text with player name
ctx.textAlign = "left";
ctx.font = 'bold 16pt Arial';
ctx.fillStyle = "#000000";
ctx.fillText("Welcome, " + username, Xcenter + width / 1.2, Ycenter + (height / 6));

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
	if(data != "None"){
		for(i=0, len=data.gameID.length; i<len; i++){
			txt = txt + "<tr><td>" + data.gameID[i] + "</td><td>" + data.created[i] + "</td><td><a href='hexagon.php?id=" + data.gameID[i] + "'>" + data.game_name[i] +  "</a></td>";
			if(data.mapProperties[i].owners[data.mapProperties[i].turn] == $('#email').val() && data.gameStatus[i] == "started"){
				txt = txt + "<td>Your turn!</td></tr>";
			}else if(data.gameStatus[i] == "invites" && data.playerStatus[i] == "accepted"){
				txt = txt + "<td>Accepted Invite</td></tr>";
			}else if(data.gameStatus[i] == "invites" && data.playerStatus[i] == "invited"){
				txt = txt + "<td>You're invited!</td></tr>";
			}else if(data.gameStatus[i] == "started" && data.mapProperties[i].owners[data.mapProperties[i].turn] != $('#email').val()){
				txt = txt + "<td>" + data.mapProperties[i].users[data.mapProperties[i].turn] + "'s turn</td></tr>"
			}else{
				txt = txt + "<td></td></tr>";
			}
		}
	}else{
		txt = txt + "<tr><td><b>[: No Active Games :]</b></td><td></td><td></td><td></td></tr>";
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
	if(data == "None" || data.length==0){
		txt = txt + "<tr><td><b>[: No Public Games Available :]</b></td><td></td><td></td></tr>";
	}else{
		for(i=0, len=data.length; i<len; i++){
			txt = txt + "<tr><td>" + data[i].gameID + "</td><td>" + data[i].created + "</td><td><a href='hexagon.php?id=" + data[i].gameID + "'>" + data[i].game_name +  "</a></td></tr>";
		}
	}

	txt = txt + "</tbody>";
	console.log(txt);
	$('#publicGames').html(txt);
	
});

