//Get all maps on DB
var getMaps = {
	param: "getAllMaps",
};
$.ajax({
    url: "getMap.php",
    data: getMaps,
    type: "POST",
    dataType: 'JSON',
    success: function (resp){
    	var html = "";
    	for(var i=0;i<resp.id.length;i++){
    		if(resp.id[i] >= 5){
    			html = html + "<option value='" + resp.id[i]+ "'>" + resp.name[i]+ "</option>";
    		}
    	}
    	$('#loadMap').html(html);
    },
});

