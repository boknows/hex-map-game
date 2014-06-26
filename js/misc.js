function rand(min, max) {
    return min + Math.random() * (max - min);
}

function get_random_color() {
    var h = rand(1, 360);
    var s = rand(0, 100);
    var l = rand(0, 55);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}
function addButton(type, x, y) {
	if(type == "attack"){
		
	}
}