$(document).ready(function() { 
	$('#player1').select2({
		placeholder: "Select an opponent",
		allowClear: false,
		ajax: {
			dataType: "json",
			url: "getUsers.php",
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
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
				};
			},
			results: function (data) {
				console.log(data);
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
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
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
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
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
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
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
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
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
			data: function (term, page) {
				return {
					q: term, // search term
					page: page
				};
			},
			results: function (data, page) {
				console.log(data);
				return {results: data};
			},
			
		}
	});  
});



function createGame() {
	var users = [];
	for(var i = 1;i<8;i++){
		if($("#player"+i).select2("data") != null){
			users.push($("#player"+i).select2("data"));
		}
	}
	for(var j =0; j<users.length;j++){
		users[j] = users[j].text;
	}	
	console.log(users);
	var data = { 	
				colorpicker: $('#colorpicker').val(),
				gameName: $('#name').val(),
				emails: [$('#username').val(),
				$("#player1").select2("val"), 
				$("#player2").select2("val"), 
				$("#player3").select2("val"), 
				$("#player4").select2("val"), 
				$("#player5").select2("val"), 
				$("#player6").select2("val"), 
				$("#player7").select2("val"), ],
				usernames: users,
				minPlayers: $('#minPlayers').val(),
				maxPlayers: $('#maxPlayers').val(),
				publicPrivate: $('#publicPrivate').val(),
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

