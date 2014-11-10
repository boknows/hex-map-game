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
	console.log($("#player1").select2("val"));
	var data = { 	
				colorpicker: $('#colorpicker').val(),
				gameName: $('#name').val(),
				players: [$('#username').val(),
				$("#player1").select2("val"), 
				$("#player2").select2("val"), 
				$("#player3").select2("val"), 
				$("#player4").select2("val"), 
				$("#player5").select2("val"), 
				$("#player6").select2("val"), 
				$("#player7").select2("val"), ],
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
			//Clear values from Create Game Form
			$('#name').val('');
			$('#player1').val('');
			$('#player2').val('');
			$('#player3').val('');
			$('#player4').val('');
			$('#player5').val('');
			$('#player6').val('');
			$('#player7').val('');
		}
	});
}

