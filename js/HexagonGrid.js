
function HexagonGrid(canvasId, radius) {
    this.radius = radius;
    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    map.canvas = document.getElementById(canvasId); //replicate canvas/context in global object for future use. 
    map.ctx = map.canvas.getContext('2d');

    this.context = map.ctx;
    this.canvas = map.canvas;

    this.canvasOriginX = map.canvas.getBoundingClientRect().left;
    this.canvasOriginY = map.canvas.getBoundingClientRect().top;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

};


