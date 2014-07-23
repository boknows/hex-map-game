(function() {
  // let's get our map
  var gameMap = mapGen.getMap().done();
  console.log(gameMap);
  console.log(gameMap.responseText);
  console.log(JSON.parse(gameMap));
})();