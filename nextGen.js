function nextGen(graphicData) {
    this.gridSize = graphicData.getGridSize();
    var gridSize2 = gridSize * gridSize;
    var changeFound = 0;

    this.dataGrid = graphicData.getDataGrid();

    this.colorZones = graphicData.getColorZones();

    this.colorSpace = graphicData.colorSpace;

    function XY(X, Y, count, SumSQ, normalizedSumSQ) {
        this.X = X;
        this.Y = Y;
        this.Count = count;
        this.SumSQ = SumSQ;
        this.normalizedSumSQ = normalizedSumSQ;
        return this;
    }

    /**
     * returns a random integer scaled to argument
     * @param scaleIt
     * @returns {number}
     */
    function randGS(scaleIt) {
        var a = Math.floor(Math.random() * scaleIt);
        return a;
    }

    // holds data structure for each color
    var colorCentroidStructure = [];

    // fill the positions with 0,0 values - for each colorZone
    function clearCentroidPositions() {
        colorCentroidStructure = [];
        colorZones.forEach(function () {
            // X Y count SumSQ SumSQ/sqrt(N)
            colorCentroidStructure.push(new XY(0, 0, 0, 0, 0));
        });
    }

    clearCentroidPositions();

    // convert i (0 - gridsize-1) to x,y coords
    function index2XYValues(gridIndex) {
        if (gridIndex < 0 || gridIndex > gridSize2) {
            return {X: 0, Y: 0};
        }
        var x = Math.floor(gridIndex % gridSize);
        var y = Math.floor(gridIndex / gridSize);
        return {X: x, Y: y};
    }

    /**
     *
     */
    function addupXYPositions() {
        for (var i = 0; i < gridSize2; i++) {
            var q = index2XYValues(i);
            var x = q.X;
            var y = q.Y;
            var localColor = dataGrid[i];
            colorCentroidStructure[localColor].X = colorCentroidStructure[localColor].X + x;
            colorCentroidStructure[localColor].Y = colorCentroidStructure[localColor].Y + y;
            // count entries per color
            colorCentroidStructure[localColor].Count = colorCentroidStructure[localColor].Count + 1;
        }
    }

    /**
     *
     * @param colorPositions
     */
    function normalizeCentroidByColorTypeCount(colorPositions) {
        for (var i = 0; i < colorPositions.length; i++) {
            if (colorPositions[i].Count !== 0) {
                colorPositions[i].X = colorPositions[i].X / colorPositions[i].Count;
                colorPositions[i].Y = colorPositions[i].Y / colorPositions[i].Count;
            }
        }
    }

    function pushCentroidsToGraphicDataObject() {
        graphicData.clearCentroidPositions();
        for (var i = 0; i < colorCentroidStructure.length; i++) {
            // write centroid positions {x,y} to graphicSpace object
            graphicData.pushCentroidPositions(colorCentroidStructure[i].X, colorCentroidStructure[i].Y);
        }
    }


    function normalizeSumOfSquares() {
        for (var colorIndex = 0; colorIndex < colorCentroidStructure.length; colorIndex++) {
            colorCentroidStructure[colorIndex].normalizedSumSQ = 0;
            if (colorCentroidStructure[colorIndex].Count !== 0) {
                // colorCentroidStructure[colorIndex].normalizedSumSQ = colorCentroidStructure[colorIndex].SumSQ / Math.sqrt(colorCentroidStructure[colorIndex].Count);
                colorCentroidStructure[colorIndex].normalizedSumSQ = colorCentroidStructure[colorIndex].SumSQ / colorCentroidStructure[colorIndex].Count;
            }
        }
    }

    // // calculate sums of squares of distances per color
    function sumOfSquares() {
        for (var gridIndex = 0; gridIndex < gridSize2; gridIndex++) {
            var location = index2XYValues(gridIndex);
            var color = dataGrid[gridIndex];
            colorCentroidStructure[color].SumSQ += (location.X - colorCentroidStructure[color].X) *
                (location.X - colorCentroidStructure[color].X) +
                (location.Y - colorCentroidStructure[color].Y) * (location.Y * colorCentroidStructure[color].Y);
        }
        normalizeSumOfSquares();
    }

    // work out x and y and add positions to per color sum and increment count per color
    // adds offset to push centroids apart
    function calculateCentroidPositions() {  // x location, y location, count, sum of square distances
        clearCentroidPositions();
        addupXYPositions();
        // scale sums by count....to calculate averages
        normalizeCentroidByColorTypeCount(colorCentroidStructure);
        sumOfSquares();
    }

    function updateCentroidPositions() {
        calculateCentroidPositions();
        pushCentroidsToGraphicDataObject();
    }

    updateCentroidPositions();

    function fetchColorCentroidVector(gridIndex, colorAtIndexIn) {
        var colorAtIndex = dataGrid[gridIndex];
        if (arguments.length == 2) {
            colorAtIndex = colorAtIndexIn;
        }
        var xYPosition = index2XYValues(gridIndex);
        var locationOfCentroidX = colorCentroidStructure[colorAtIndex].X - xYPosition.X;
        var locationOfCentroidY = colorCentroidStructure[colorAtIndex].Y - xYPosition.Y;
        return {X: locationOfCentroidX, Y: locationOfCentroidY}
    }

    function distanceToCentroid(cellIndex) {
        var distance = 0;
        if (cellIndex >= 0 && cellIndex < gridSize2) {
            var centroidVector = fetchColorCentroidVector(cellIndex);
            var currentCellXY = index2XYValues(cellIndex);
            distance = Math.sqrt((centroidVector.X - currentCellXY.X) * (centroidVector.X - currentCellXY.X) +
                (centroidVector.Y - currentCellXY.Y) * (centroidVector.Y - currentCellXY.Y));
        }
        return distance;
    }

    for (var i = 0; i < gridSize2; i++) {
        test2 = distanceToCentroid(i, 0);
    }

    function getColors(gridIndex, signsOfVector) {
        color1 = dataGrid[gridIndex];
        color2 = dataGrid[gridIndex + 1];
        color3 = dataGrid[gridIndex + 1 + gridSize];
        color4 = dataGrid[gridIndex + gridSize];
        return {color1: color1, color2: color2, color3: color3, color4: color4};
    }

    function rotateColorBlock(gridIndex, initialColors, direction) {
        if (direction === 0) {
            dataGrid[gridIndex] = initialColors.color1;
            dataGrid[gridIndex + 1] = initialColors.color2;
            dataGrid[gridIndex + 1 + gridSize] = initialColors.color3;
            dataGrid[gridIndex + gridSize] = initialColors.color4;
        }
        if (direction === 1) {
            dataGrid[gridIndex] = initialColors.color2;
            dataGrid[gridIndex + 1] = initialColors.color3;
            dataGrid[gridIndex + 1 + gridSize] = initialColors.color4;
            dataGrid[gridIndex + gridSize] = initialColors.color1;
        }
        if (direction === 2) {
            dataGrid[gridIndex] = initialColors.color3;
            dataGrid[gridIndex + 1] = initialColors.color4;
            dataGrid[gridIndex + 1 + gridSize] = initialColors.color1;
            dataGrid[gridIndex + gridSize] = initialColors.color2;
        }
        if (direction === 3) {
            dataGrid[gridIndex] = initialColors.color4;
            dataGrid[gridIndex + 1] = initialColors.color1;
            dataGrid[gridIndex + 1 + gridSize] = initialColors.color2;
            dataGrid[gridIndex + gridSize] = initialColors.color3;
        }
        calculateCentroidPositions();
    }

    function calculateCostForOneColor(color1, gridIndex) {
        var sumdist2 = 0.0;
        for (var element = 0; element < colorZones.length; element++) {
            if (color1 !== element) {
                var xy = index2XYValues(gridIndex);
                distX = gridSize - Math.abs(colorCentroidStructure[element].X - xy.X);
                distY = gridSize - Math.abs(colorCentroidStructure[element].Y - xy.Y);
                distZ = (distX * distX + distY * distY) / (colorZones.length - 1);
                sumdist2 += distZ;
            }
        }
        return sumdist2;
    }


    function calculateCostForColors(initialColors, gridIndex) {
        var k = 0.0;
        k += colorCentroidStructure[initialColors.color1].normalizedSumSQ;
        k += colorCentroidStructure[initialColors.color2].normalizedSumSQ;
        k += colorCentroidStructure[initialColors.color3].normalizedSumSQ;
        k += colorCentroidStructure[initialColors.color4].normalizedSumSQ;
        var oC1 = calculateCostForOneColor(initialColors.color1, gridIndex);
        var oC2 = calculateCostForOneColor(initialColors.color2, gridIndex);
        var oC3 = calculateCostForOneColor(initialColors.color3, gridIndex);
        var oC4 = calculateCostForOneColor(initialColors.color4, gridIndex);
        return {K:k,P: (oC1 + oC2 + oC3 + oC4)};
    }


    function calculateScores(initialColors, gridIndex) {
        var scoreForInitialColors = calculateCostForColors(initialColors, gridIndex);

        rotateColorBlock(gridIndex, initialColors, 1);
        var scoreForClockwise1Rotation = calculateCostForColors(initialColors, gridIndex + 1);

        rotateColorBlock(gridIndex, initialColors, 2);
        var scoreForClockwise2Rotation = calculateCostForColors(initialColors, gridIndex + 1 + gridSize);

        rotateColorBlock(gridIndex, initialColors, 3);
        var scoreForClockwise3Rotation = calculateCostForColors(initialColors, gridIndex + gridIndex);

        rotateColorBlock(gridIndex, initialColors, 0);

        return {
            scoreForInitialColors: scoreForInitialColors,
            scoreForClockwise1Rotation: scoreForClockwise1Rotation,
            scoreForClockwise2Rotation: scoreForClockwise2Rotation,
            scoreForClockwise3Rotation: scoreForClockwise3Rotation
        };
    }

    function cellColorComparison(spotIndex, referenceCell) {
        var result = 0
        if (dataGrid[referenceCell] === dataGrid[spotIndex]) {
            result = 1;
        }
        return result;
    }

    function testNeighbor(spotIndex, referenceCell) {
        var result = 0;
        if (spotIndex >= 0 && spotIndex < gridSize2) {
            result = cellColorComparison(spotIndex, referenceCell);
        }
        return result;
    }

    // function calculateNeighbors(gridIndex) {
    //     var neighborsSquare1 = {
    //         initial: (testNeighbor(gridIndex - gridSize, gridIndex) + testNeighbor(gridIndex - 1, gridIndex)),
    //         plusOne: (testNeighbor(gridIndex - gridSize + 1, gridIndex) + testNeighbor(gridIndex + 2, gridIndex)),
    //         minusOne: (testNeighbor(gridIndex + 2 * gridSize, gridIndex) + testNeighbor(gridIndex + gridSize - 1, gridIndex))
    //     }
    //     var neighborsSquare2 = {
    //         initial: (testNeighbor(gridIndex - gridSize + 1, gridIndex + 1) + testNeighbor(gridIndex + 1, gridIndex + 1)),
    //         plusOne: (testNeighbor(gridIndex + gridSize + 1, gridIndex + 1) + testNeighbor(gridIndex + 2 * gridSize, gridIndex + 1)),
    //         minusOne: (testNeighbor(gridIndex + 2 * gridSize, gridIndex + 1) + testNeighbor(gridIndex + gridSize - 1, gridIndex + 1))
    //     }
    //     var neighborsSquare3 = {
    //         initial: (testNeighbor(gridIndex + gridSize + 2, gridIndex + gridSize + 1) +
    //             testNeighbor(gridIndex + 2 * gridSize + 1, gridIndex + gridSize + 1)),
    //         plusOne: (testNeighbor(gridIndex + 2 * gridSize, gridIndex + gridSize + 1) +
    //             testNeighbor(gridIndex + gridSize - 1, gridIndex + gridSize + 1)),
    //         minusOne: (testNeighbor(gridIndex - gridSize + 1, gridIndex + gridSize + 1) +
    //             testNeighbor(gridIndex + 2, gridIndex + gridSize + 1))
    //     }
    //     var neighborsSquare4 = {
    //         initial: (testNeighbor(gridIndex + gridSize - 1, gridIndex + gridSize) +
    //             testNeighbor(gridIndex + 2 * gridSize, gridIndex + gridSize)),
    //         plusOne: (testNeighbor(gridIndex - gridSize, gridIndex + gridSize) +
    //             testNeighbor(gridIndex - 1, gridIndex + gridSize)),
    //         minusOne: (testNeighbor(gridIndex + gridSize + 2, gridIndex + gridSize) +
    //             testNeighbor(gridIndex + 2 * gridSize + 1, gridIndex + gridSize))
    //     }
    //     return {
    //         // initial: neighborsSquare1.initial + neighborsSquare2.initial + neighborsSquare3.initial + neighborsSquare4.initial,
    //         // plusOne: neighborsSquare1.plusOne + neighborsSquare2.plusOne + neighborsSquare3.plusOne + neighborsSquare4.plusOne,
    //         // minusOne: neighborsSquare1.minusOne + neighborsSquare2.minusOne + neighborsSquare3.minusOne + neighborsSquare4.minusOne
    //         n1: neighborsSquare1, n2: neighborsSquare2, n3: neighborsSquare3, n4: neighborsSquare4
    //     }
    // }

    function calculateDifferencesAndRotate(gridIndex) {
// assumes top left cell anchoring 0-2, skip 3 x 0-2, skip 3 centers
        var change = 0;
        var initialColors = getColors(gridIndex);
        var __ret = calculateScores(initialColors, gridIndex);
        // var scoreForInitialColors = __ret.scoreForInitialColors.K;
        // var scoreForClockwise1Rotation = __ret.scoreForClockwise1Rotation.K;
        // var scoreForClockwise2Rotation = __ret.scoreForClockwise2Rotation.K;
        // var scoreForClockwise3Rotation = __ret.scoreForClockwise3Rotation.K;
        var scoreForInitialColors = __ret.scoreForInitialColors.P;
        var scoreForClockwise1Rotation = __ret.scoreForClockwise1Rotation.P;
        var scoreForClockwise2Rotation = __ret.scoreForClockwise2Rotation.P;
        var scoreForClockwise3Rotation = __ret.scoreForClockwise3Rotation.P;

        //var __neighbors = calculateNeighbors(gridIndex);
        if ((scoreForClockwise1Rotation < Math.min(scoreForInitialColors,
            Math.min(scoreForClockwise2Rotation, scoreForClockwise3Rotation)))) {
            rotateColorBlock(gridIndex, initialColors, 1);
            change = 1;
        }
        if ((scoreForClockwise2Rotation < Math.min(scoreForInitialColors,
            Math.min(scoreForClockwise1Rotation, scoreForClockwise3Rotation)))) {
            rotateColorBlock(gridIndex, initialColors, 2);
            change = 1;
        }
        if ((scoreForClockwise3Rotation < Math.min(scoreForInitialColors,
            Math.min(scoreForClockwise1Rotation, scoreForClockwise2Rotation)))) {
            rotateColorBlock(gridIndex, initialColors, 3);
            change = 1;
        }
        // clean up after calculation
        calculateCentroidPositions();
        // if ((scoreForClockwiseRotation < Math.min(scoreForInitialColors, scoreForClockwiseRotation)) &&
        //     (
        //         __neighbors.n1.plusOne >= Math.min(1, __neighbors.n1.initial) ||
        //         __neighbors.n2.plusOne >= Math.min(1, __neighbors.n2.initial) ||
        //         __neighbors.n3.plusOne >= Math.min(1, __neighbors.n3.initial) ||
        //         __neighbors.n4.plusOne >= Math.min(1, __neighbors.n4.initial)
        //     )
        // ) {
        //     rotateColorBlock(gridIndex, initialColors, 1);
        //     change = 1;
        // }
        // if ((scoreForCounterRotation < Math.min(scoreForInitialColors, scoreForClockwiseRotation)) &&
        //     (
        //         __neighbors.n1.minusOne >= Math.min(1, __neighbors.n1.initial) ||
        //         __neighbors.n2.minusOne >= Math.min(1, __neighbors.n2.initial) ||
        //         __neighbors.n3.minusOne >= Math.min(1, __neighbors.n3.initial) ||
        //         __neighbors.n4.minusOne >= Math.min(1, __neighbors.n4.initial)
        //     )
        // ) {
        //     rotateColorBlock(gridIndex, initialColors, -1);
        //     change = 1;
        // }
        // if (change === 0) {
        //     rotateColorBlock(gridIndex, initialColors, 0);
        // }
        if (change) {
            changeFound += 1;
        }
    }

    function processMovement(gridIndex) {
        var location = index2XYValues(gridIndex);
        // check for valid index
        if (location.X < gridSize - 1 && location.Y < gridSize - 1) {
            calculateDifferencesAndRotate(gridIndex);
        }
    }

    function loopThroughDatagrid() {

        for (var gridIndex1 = 0; gridIndex1 < gridSize2; gridIndex1++) {
            var gridIndex = randGS(gridSize2);
            processMovement(gridIndex);
        }
    }

    loopThroughDatagrid();
    var a = 0;
    return changeFound;
}