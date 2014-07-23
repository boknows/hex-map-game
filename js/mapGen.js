var mapGen = function() {  
  return {
    getMap: function() {
		return $.ajax({
			url: "getMap.php",
			type: "POST",
			dataType: 'JSON',
		});
    }
  };
}()