function nextGen(graphicData) {
    this.gridSize = graphicData.getGridSize();
    var gridSize2 = gridSize * gridSize;
    var midGrid = (gridSize - 1) / 2;

    this.dataGrid = graphicData.getDataGrid();

    this.colorZones = graphicData.getColorZones();

    this.colorSpace = graphicData.colorSpace;

    function XY(X, Y, Z, SumSQ) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.SumSQ = SumSQ;
        return this;
    }

    var colorPositions = [];

    // fill the positions with 0,0 values - for each colorZone
    function clearPositions() {
        colorPositions = [];
        colorZones.forEach(function () {
            colorPositions.push(new XY(0, 0, 0, 0));
        });
    }

    clearPositions();

    // convert i (0 - gridsize-1) to x,y coords
    function i2XY(i) {
        var x = Math.floor(i % gridSize);
        var y = Math.floor(i / gridSize);
        return {X: x, Y: y};
    }

    // work out x and y and add positions to per color sum and increment count per color
    // adds offset to push centroids apart
    function averagePositions() {  // x location, y location, count, sum of square distances
        clearPositions();
        for (var i = 0; i < gridSize2; i++) {
            var q = i2XY(i);
            var x = q.X;
            var y = q.Y;
            var z = dataGrid[i];
            colorPositions[z].X = colorPositions[z].X + x;
            colorPositions[z].Y = colorPositions[z].Y + y;
            colorPositions[z].Z = colorPositions[z].Z + 1;
            colorPositions[z].SumSQ = 0;
        }
        // scale sums by count....to calculate averages
        graphicData.clearCentroidPositions();
        for (var i = 0; i < colorPositions.length; i++) {
            if (colorPositions[i].Z !== 0) {
                colorPositions[i].X = colorPositions[i].X / colorPositions[i].Z;
                // colorPositions[i].X = colorPositions[i].X + Math.sign(colorPositions[i].X - midGrid);
                colorPositions[i].Y = colorPositions[i].Y / colorPositions[i].Z;
                // colorPositions[i].Y = colorPositions[i].Y + Math.sign(colorPositions[i].Y - midGrid);
            }
            // write centroid positions {x,y} to graphicSpace object
            graphicData.pushCentroidPositions(colorPositions[i].X, colorPositions[i].Y);
        }
    }

    averagePositions();

    // // calculate sums of squares of distances per color
    // function sumOfSquares() {
    //     averagePositions();
    //     for (var i = 0; i < gridSize2; i++) {
    //         var x = Math.floor(i % gridSize);
    //         var y = Math.floor(i / gridSize);
    //         var z = dataGrid[i];
    //         var dist = (x - positions[z].X) * (x - positions[z].X) +
    //             (y - positions[z].Y ) * ( y * positions[z].Y );
    //         positions[z].SumSQ = positions[z].SumSQ + dist;
    //     }
    // }
    //
    // // calculate sum of squares distances from centroids
    // sumOfSquares();
    //
    // function getFurthestEntry(maxColor) {
    //     var furthest = {X: 0, Y: 0, Dist: 0};
    //     var furthestDist = 0;
    //
    //     for (var i = 0; i < gridSize2; i++) {
    //         if (dataGrid[i] === maxColor) {
    //             var x = Math.floor(i % gridSize);
    //             var y = Math.floor(i / gridSize);
    //             var dist = (x - positions[maxColor].X) * (x - positions[maxColor].X) +
    //                 (y - positions[maxColor].Y ) * ( y - positions[maxColor].Y );
    //             if (dist > furthestDist) {
    //                 furthestDist = dist;
    //                 furthest = {X: x, Y: y, Dist: Math.sqrt(furthestDist)};
    //             }
    //         }
    //     }
    //     return furthest;
    // }

    function swapCells(newX, newY, oldX, oldY) {
        var swap = 0;
        if ((newX !== oldX || newY !== oldY)) {
            var i = newY * gridSize + newX;
            var j = oldY * gridSize + oldX;
            var tempSwap = dataGrid[i];
            dataGrid[i] = dataGrid[j];
            dataGrid[j] = tempSwap;
            if (dataGrid[i] !== dataGrid[j]) {
                swap = 1;
            }
        }
        return swap;
    }

    function colorDistance(i,colorNumber) {
        var q = i2XY(i);
        var x = q.X;
        var y = q.Y;
        var dX = Math.abs(colorPositions[colorNumber].X - x);
        var dY = Math.abs(colorPositions[colorNumber].Y - y);
        return dX+dY;
    }


    for (var i = 0; i < gridSize2; i++) {
        for (var colorNumber = 0; colorNumber < colorZones.length; colorNumber++) {

            if (colorNumber === dataGrid[i]) {
                var MaxSwap = 200; //colorDistance(i,colorNumber);
                //MaxSwap = MaxSwap * MaxSwap;
                var q = i2XY(i);
                var x = q.X;
                var y = q.Y;
                var swap = 1;
                var x1 = x;
                var y1 = y;

                while (swap < MaxSwap) {
                    var distX = x1 - colorPositions[colorNumber].X;
                    var distY = y1 - colorPositions[colorNumber].Y;

                    //  if (Math.abs(distX) > 0.5) {
                    distX = x1 - Math.sign(distX); // move one space closer...
                    // }
                    // if (Math.abs(distY) > 0.5) {
                    distY = y1 - Math.sign(distY); // move one space closer...
                    //  }
                    if (distX !== x1 || distY !== y1) {
                        if (swapCells(distX, distY, x1, y1)) {
                            //averagePositions();
                            //var col1 =
                            swap += 1;
                            x1 = distX;
                            y1 = distY;
                        }
                    } else {
                        swap = MaxSwap;
                    }
                    swap += 1;
                }
            }
        }
    }
    var a = 0;
}