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
games.getData(function(gameData){
    //var data = JSON.parse(gameData);
    console.log(gameData);
});