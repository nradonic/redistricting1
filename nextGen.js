function nextGen(graphicData) {
    this.gridSize = graphicData.getGridSize();
    var gridSize2 = gridSize * gridSize;

    this.dataGrid = graphicData.getDataGrid();

    this.colorZones = graphicData.getColorZones();

    this.colorSpace = graphicData.colorSpace;

    function XY(X, Y, Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        return this;
    }

    var positions = [];
    // fill the positions with 0,0 values - for each colorZone
    colorZones.forEach(function () {
        positions.push(new XY(0, 0, 0));
    });

    for (var i = 0; i < gridSize2; i++) {
        var x = Math.floor(i % gridSize);
        var y = Math.floor(i / gridSize);
        var z = dataGrid[i];
        positions[z].X = positions[z].X + x;
        positions[z].Y = positions[z].Y + y;
        positions[z].Z = positions[z].Z + 1;
        var a = 0;
    }
    for (var i = 0; i < positions.length; i++) {
        if (positions[i].Z !== 0) {
            positions[i].X = positions[i].X / positions[i].Z;
            positions[i].Y = positions[i].Y / positions[i].Z;
        }
    }

    var a = 0;


}