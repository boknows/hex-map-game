(function() {
    // let's get our map
    var gameMap = mapGen.getMap();
    gameMap.done(function(r){  }).
    fail(function(x){  });
    console.log(gameMap);
})();
