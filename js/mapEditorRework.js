var Map = function() {
    var mapData;
    this.data = null;
    this.editMap = {
        col: null,
        row: null,
    };
    this.connectors = [];
    this.connectorBtn = false;
    this.username = $('#username').val();
    this.email = $('#email').val();
    this.ctx = null;
    this.canvas = null;
    this.updateData = function(callback){
        $.ajax({
            url: "getMap.php",
            type: "POST",
            dataType: 'JSON',
            data: {
                param: "getSingleMap",
                id: $('#loadMap').val(),
            },
        }).success(callback);
    };
};