function acceptInvite () {
    var data = { 	
                    gameID: $('#game_id').val(),
                };
    $.ajax({
        url: "getGame.php",
        type: "POST",
        dataType: 'JSON', 
        data: data,
    }).success(function(){
           
    });
}