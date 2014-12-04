
function HexagonGrid(canvasId, radius) {
    this.radius = Math.round(radius);
    this.height = Math.round(Math.sqrt(3) * radius);
    this.width = Math.round(2 * radius);
    this.side = Math.round((3 / 2) * radius);
    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    //Dyanmically size canvas to fit the map
    map.canvas.width = this.side * (map.dataProp.cols+2) + map.canvas.getBoundingClientRect().left;
    map.canvas.height = (this.height * map.dataProp.rows+2) + map.canvas.getBoundingClientRect().top + this.height;

    this.context = map.ctx;
    this.canvas = map.canvas;

    this.canvasOriginX = map.canvas.getBoundingClientRect().left;
    this.canvasOriginY = map.canvas.getBoundingClientRect().top;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};


