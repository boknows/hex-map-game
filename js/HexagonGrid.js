
function HexagonGrid(canvasId, radius) {
    this.radius = Math.round(radius);
    this.height = Math.round(Math.sqrt(3) * radius);
    this.width = Math.round(2 * radius);
    this.side = Math.round((3 / 2) * radius);
    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    this.context = map.ctx;
    this.canvas = map.canvas;

    this.canvasOriginX = map.canvas.getBoundingClientRect().left;
    this.canvasOriginY = map.canvas.getBoundingClientRect().top;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};


