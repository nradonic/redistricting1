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

    /**
     * returns a random integer scaled to argument
     * @param scaleIt
     * @returns {number}
     */
    function randGS(scaleIt) {
        var a = Math.floor(Math.random() * scaleIt);
        return a;
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
    function index2XYValues(i) {
        var x = Math.floor(i % gridSize);
        var y = Math.floor(i / gridSize);
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
            var z = dataGrid[i];
            colorPositions[z].X = colorPositions[z].X + x;
            colorPositions[z].Y = colorPositions[z].Y + y;
            colorPositions[z].Z = colorPositions[z].Z + 1;
            colorPositions[z].SumSQ = 0;
        }
    }

    /**
     *
     * @param colorPositions
     * @param graphicData
     */
    function normalizeCentroidByColorTypeCount(colorPositions, graphicData) {
        for (var i = 0; i < colorPositions.length; i++) {
            if (colorPositions[i].Z !== 0) {
                colorPositions[i].X = colorPositions[i].X / colorPositions[i].Z;
                colorPositions[i].Y = colorPositions[i].Y / colorPositions[i].Z;
            }
        }
        graphicData.clearCentroidPositions();
        for (var i = 0; i < colorPositions.length; i++) {
            // write centroid positions {x,y} to graphicSpace object
            graphicData.pushCentroidPositions(colorPositions[i].X, colorPositions[i].Y);
        }
    }

    // work out x and y and add positions to per color sum and increment count per color
    // adds offset to push centroids apart
    function calculateCentroidPositions() {  // x location, y location, count, sum of square distances
        clearPositions();
        addupXYPositions();

        // scale sums by count....to calculate averages
        graphicData.clearCentroidPositions();
        normalizeCentroidByColorTypeCount(colorPositions, graphicData);
    }

    calculateCentroidPositions();

    // // calculate sums of squares of distances per color
    function sumOfSquares() {
        calculateCentroidPositions();
        for (var i = 0; i < gridSize2; i++) {
            var x = Math.floor(i % gridSize);
            var y = Math.floor(i / gridSize);
            var z = dataGrid[i];
            var dist = (x - colorPositions[z].X) * (x - colorPositions[z].X) +
                (y - colorPositions[z].Y) * (y * colorPositions[z].Y);
            colorPositions[z].SumSQ = colorPositions[z].SumSQ + dist;
        }
    }

    // calculate sum of squares distances from centroids
    sumOfSquares();

    function fetchColorCentroidVector(gridIndex, colorAtIndex) {
        var xYPosition = index2XYValues(gridIndex);
        var locationOfCentroidX = colorPositions[colorAtIndex].X - xYPosition.X;
        var locationOfCentroidY = colorPositions[colorAtIndex].Y - xYPosition.Y;
        return {X: locationOfCentroidX, Y: locationOfCentroidY}
    }

    for (var i = 0; i < gridSize2; i++) {
        var test = fetchColorCentroidVector(i, dataGrid[i]);
    }

    function distanceToCentroid(spotIndex, colorToTest) {
        var distance = 0;
        if (spotIndex >= 0 && spotIndex < gridSize2) {

            var k = fetchColorCentroidVector(spotIndex, colorToTest);
            var z = index2XYValues(spotIndex);
            distance = Math.sqrt((k.X - z.X) * (k.X - z.X) + (k.Y - z.Y) * (k.Y - z.Y));
        }
        return distance;
    }

    for (var i = 0; i < gridSize2; i++) {
        test2 = distanceToCentroid(i, 0);
    }

    function colorDiffers(gridIndex, colorID) {
        var k = 1;
        if (dataGrid[gridIndex] === colorID) {
            k = 0;
        }
        return k;
    }

    function freedomFromNeighbors(gridIndex, colorID) {
        var k = 0;
        if (gridIndex >= 0 && gridIndex < gridSize2) {
            k = colorDiffers(gridIndex, colorID);
        }
        return k;
    }

    function noNeighborsCount(gridIndex) {
        var colorHere = dataGrid[gridIndex];

        var free1 = freedomFromNeighbors(gridIndex - 1, colorHere);
        var free2 = freedomFromNeighbors(gridIndex + 1, colorHere);
        var free3 = freedomFromNeighbors(gridIndex - gridSize, colorHere);
        var free4 = freedomFromNeighbors(gridIndex + gridSize, colorHere);
        return free1 + free2 + free3 + free4;
    }

    function evaluateDistances(gridIndex, colorsBlock, signsOfVector) {

        var k1 = distanceToCentroid(gridIndex, colorsBlock.col1);
        var k2 = distanceToCentroid(gridIndex + signsOfVector.X, colorsBlock.col2);
        var k3 = distanceToCentroid(gridIndex + signsOfVector.X + signsOfVector.Y * gridSize, colorsBlock.col3);
        var k4 = distanceToCentroid(gridIndex + signsOfVector.Y * gridSize, colorsBlock.col4);

        var distances = k1 * k1 * k1 * k1 + k2 * k2 * k2 * k2 + k3 * k3 * k3 * k3 + k4 * k4 * k4 * k4;
        return distances;
    }

    function rotateColorsInGrid(gridIndex, signsOfVector, rotatedColors) {
        dataGrid[gridIndex] = rotatedColors.col1;
        dataGrid[gridIndex + signsOfVector.X] = rotatedColors.col2;
        dataGrid[gridIndex + signsOfVector.X + signsOfVector.Y * gridSize] = rotatedColors.col3;
        dataGrid[gridIndex + signsOfVector.Y * gridSize] = rotatedColors.col4;
    }

    function rotateColors(initialColors, signs, yInversion) {
        if (yInversion) {
            color1 = initialColors.col4;
            color2 = initialColors.col1;
            color3 = initialColors.col2;
            color4 = initialColors.col3;
            return {col1: color1, col2: color2, col3: color3, col4: color4};
        }
        color1 = initialColors.col2;
        color2 = initialColors.col3;
        color3 = initialColors.col4;
        color4 = initialColors.col1;
        return {col1: color1, col2: color2, col3: color3, col4: color4};
    }

    function getColors(gridIndex, signsOfVector) {
        color1 = dataGrid[gridIndex];
        color2 = dataGrid[gridIndex + signsOfVector.X];
        color3 = dataGrid[gridIndex + signsOfVector.X + signsOfVector.Y * gridSize];
        color4 = dataGrid[gridIndex + signsOfVector.Y * gridSize];
        return {col1: color1, col2: color2, col3: color3, col4: color4};
    }

    function evaluateRotation(gridIndex, centroidVector, signsOfVector, yInversionFlag) {
        var colorsInitial = getColors(gridIndex, signsOfVector);
        var scoreNotRotation = evaluateDistances(gridIndex, colorsInitial, signsOfVector);
        var colorsRotated = rotateColors(colorsInitial, signsOfVector, yInversionFlag)
        var scoreRotated = evaluateDistances(gridIndex, colorsRotated, signsOfVector);

        if (scoreRotated < scoreNotRotation) {
            rotateColorsInGrid(gridIndex, signsOfVector, colorsRotated);
        }
    }

    function signsOfVectorToCentroid(vector) {
        var signs = {X: Math.sign(vector.X), Y: Math.sign(vector.Y)};
        return signs;
    }

    function invertYRotationFlag(vector) {
        var yinversion = (Math.abs(vector.X) > Math.abs(vector.Y));
        if (Math.random() > 0.8) {
            yinversion = -yinversion;
        }
        return yinversion;
    }

    function processRotation(gridIndex, centroidVector) {
        var signsOfVector = signsOfVectorToCentroid(centroidVector);
        var yInversionFlag = invertYRotationFlag(centroidVector);
        evaluateRotation(gridIndex, centroidVector, signsOfVector, yInversionFlag)
    }

    function loopThroughDatagrid() {
        for (var gridIndex = 0; gridIndex < gridSize2; gridIndex++) {
            if (noNeighborsCount(gridIndex) > randGS(4)) {
                var colorAtIndex = dataGrid[gridIndex];
                var centroidVector = fetchColorCentroidVector(gridIndex, colorAtIndex);
                processRotation(gridIndex, centroidVector);

            }
        }

    }

    loopThroughDatagrid();
    var a = 0;
}