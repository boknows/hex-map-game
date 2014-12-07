$(document).ready(function() { 
	function getSel(){
		var selected = [];
		for(var i=1;i<8;i++){
			if($("#player"+i).select2("data") != null){
				selected.push($("#player"+i).select2('data').text);
			}
		}
		var str = selected.join();
		return str;
	}
	$('#player1').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
					sel: getSel()				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
	}); 
	$('#player2').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
					sel: getSel()
				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
		
	}); 
	$('#player3').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
					sel: getSel()
				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
	}); 
	$('#player4').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
					sel: getSel()
				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
	}); 
	$('#player5').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
	}); 
	$('#player6').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
				};
			},
			results: function (data) {
				return {results: data};
			},
			
		}
	}); 
	$('#player7').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term) {
				return {
					q: term, // search term
				};
			},
			results: function (data) {
				return {results: data};
			},
		}
	}); 

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
	    	console.log(resp);
	    	var html = "";
	    	for(var i=0;i<resp.id.length;i++){
	    		if(resp.id[i] >= 5){
	    			html = html + "<option value='" + resp.id[i]+ "'>" + resp.name[i]+ "</option>";
	    		}
	    	}
	    	$('#mapID').html(html);
	    },
	});
});


function createGameVal() { //Validation Rules for Create Game form
	var errors = [];
	if($('#name').val().length < 2){
		errors.push("Please provide a Game Name of 2 characters or more.");
	}
	if(errors.length == 0){
		createGame();
		console.log("Creating Game!");
	}else{
		var errorString = "";
		for(var i=0;i<errors.length;i++){
			errorString = errorString + errors[i];
		}
		alert(errorString);
	}
	console.log(errors,errorString);
}

function createGame() {
	$('#createGame').hide();
	$('#spinner').show();
	var users = [];
	users.push($('#username').val());
	for(var i = 1;i<8;i++){
		if($("#player"+i).select2("data") != null){
			users.push($("#player"+i).select2('data').text);
		}
	}
	var data = { 	
				colorpicker: $('#colorpicker').val(),
				gameName: $('#name').val(),
				emails: [$('#email').val(),
				$("#player1").select2("val"), 
				$("#player2").select2("val"), 
				$("#player3").select2("val"), 
				$("#player4").select2("val"), 
				$("#player5").select2("val"), 
				$("#player6").select2("val"), 
				$("#player7").select2("val"), ],
				mapID: $("#mapID").val(),
				usernames: users,
				minPlayers: $('#minPlayers').val(),
				maxPlayers: $('#maxPlayers').val(),
				publicPrivate: $('#publicPrivate').val(),
				fortifies: $('#maxFortifies').val()
			};
	$.ajax({
		url: "createGame.php",
		type: "POST",
		dataType: 'JSON', 
		data: data,
		success: function(){
			//window.location.replace("dashboard.php");
		}
	});

	
    
}
var mapSelectBtn = document.getElementById('mapSelectBtn');
mapSelectBtn.addEventListener('click', function(e) {
	initMapSelect();
   	$('#mapSelectPanel').show();
}, false);

var closeMapPanel = document.getElementById('closeMapPanel');
closeMapPanel.addEventListener('click', function(e) {
   $('#mapSelectPanel').hide();
}, false);

function initMapSelect() {
    $.ajax({
        url: "mapSelectData.php",
        type: "POST",
        dataType: 'JSON',
        data: {
            "param": "init"
        },
        success: function(resp) {
            console.log(resp);
            var html = "";
            for (var i = 0; i < resp.id.length; i++) { //create an <img> for each map
                html = html + "<div class='col-md-6'><img src='mapImages/" + resp.id[i] + ".png' height='25%' width='25%'><div style='display:inline-block'>Map Name: " + resp.name[i] + "<div class='input-group'><button class='btn btn-success btn-large' onclick=selectMap(" + resp.id[i] + ") type='button'>Select This Map</button></div></div></div>";
            }
            $('#results').html(html);
            html = "<div class='btn-toolbar' role='toolbar' aria-label=''><div class='btn-group' role='group' aria-label='pages'>";
            for (var i = 1; i < resp.totalPages + 1; i++) { //create a page button for each page of results
                html = html + " <button type='button' class='btn btn-default' id='" + i + "'>" + i + "</button>";
            }				
            html = html + "</div><div class='btn-group' role='group' aria-label='close'><button class='btn btn-danger btn-large' id='closeMapPanel' type='button'>Close</button></div>";
            $('#pages').html(html);

            for (var i = 1; i < resp.totalPages + 1; i++) { //assign click events to each page button
                (function(n) {
                    $("#" + n).click(function() {
                        getNewPage(n);
                    });
                })(i)
            }
        }
    });
};

function getNewPage(p) {
	$.ajax({
		url: "mapSelectData.php",
		type: "POST",
		dataType: 'JSON', 
		data: { 
			"param": "page",
			"page": p,
		},
		success: function(resp){
			var html = "";
            for (var i = 0; i < resp.id.length; i++) { //create an <img> for each map
                html = html + "<div class='col-md-6'><img src='mapImages/" + resp.id[i] + ".png' height='25%' width='25%'><div style='display:inline-block'>Map Name: " + resp.name[i] + "<div class='input-group'><button class='btn btn-success btn-large' onclick=selectMap(" + resp.id[i] + ") type='button'>Select This Map</button></div></div></div>";
            }
            $('#results').html(html);
		}
	});
};


function selectMap(id){
	console.log("Selected Map ID "+id);
	$('#mapSelectPanel').hide();
};