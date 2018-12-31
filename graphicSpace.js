function GraphicSpace(GridSize, ColorSpace) {

    this.gridSize = GridSize;
    this.colorSpace = ColorSpace;
    var forceArray = [];

    var COLORSCALE = 255;

//unique color area objects [{r,g,b}]
    function ColorZone(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Generate scaled color numbers - uses external color
     * @param colorNumber  maximum 1 less than colorSpace ie 0..1
     * @param colorSpace  number of points in the color palette   0...(n-1)   i.e. n=2
     * @returns {number}  final scaled number  ie 0...255 in 2 steps.... 0 and 255
     */
    function scaleColor(colorNumber, colorSpace) {
        var tempColor = Math.min(colorNumber, colorSpace - 1);
        return Math.floor(tempColor * COLORSCALE / (colorSpace - 1));
    }

    // create array of color standards
    function fillColorZones(colorSpace) {
        this.colorSpace = colorSpace;
        var colorZones = [];
        for (var b = 0; b < colorSpace; b++) {
            for (var g = 0; g < colorSpace; g++) {
                for (var r = 0; r < colorSpace; r++) {
                    colorZones.push(
                        new ColorZone(
                            scaleColor(r, colorSpace),
                            scaleColor(g, colorSpace),
                            scaleColor(b, colorSpace))
                    );
                }
            }
        }
        return colorZones;
    }

    // array of predetermined color objects
    //unique color area objects [{r,g,b}]
    var colorZones = fillColorZones(ColorSpace);

    // external fetch of colorZones array
    this.getColorZones = function () {
        return colorZones;
    }

    var gridSize2 = gridSize * gridSize;

    // dataGrid stores graphic data
    var dataGrid = [];

    /**
     * fillDataGrid
     * @param dG data array
     * @param gs2 size of array
     */
    fillDataGrid: function fillDataGrid(gridLength) {
        for (var i = 0; i < gridLength; i++) {
            //dataGrid[i] = randGS(colorZones.length);
            dataGrid[i] = randGS(2);
            // dataGrid[i] = 1;
        }
        // dataGrid[gridSize+1]=2;
        // dataGrid[gridSize2 - gridSize -2]=2;
    }

    function fillForces(gridLength) {
        for (i = 0; i < gridLength; i++) {
            var q = {X: 0, Y: 0};
            forceArray.push(q);
        }
    }

    fillDataGrid(gridSize2);
    fillForces(gridSize2);

    //this.centroidPositions = []
    var centroidPositions = [];

    this.clearCentroidPositions = function () {
        centroidPositions = [];
    }
    this.pushCentroidPositions = function (x, y, count) {
        centroidPositions.push({X: x, Y: y, Count: count});
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

    // external get gridSize
    this.getGridSize = function () {
        return gridSize;
    }

    // external get dataGrid
    this.getDataGrid = function () {
        return dataGrid;
    }

    this.setDataGrid = function (dataGridIn) {
        dataGrid = dataGridIn;
    }

    this.setForceVectors = function (x, y, fx, fy) {
        forceArray[x + y * gridSize] = {X: fx, Y: fy};
    }

// draw data
    this.drawData = function (changesFound, totalChanges) {
        document.getElementById("screenDrawCount").innerHTML = screenDrawCount.toFixed(0);
        document.getElementById("changes").innerHTML = changesFound.toFixed(0);
        document.getElementById("totalChanges").innerHTML = totalChanges.toFixed(0);

    }

    var drawCentroids = function (ctx, squareSide) {
        for (var i = 0; i < centroidPositions.length; i++) {
            if (centroidPositions[i].Count === 0) {
                continue;
            }
            var cp = centroidPositions[i];
            cp.X = (cp.X) * squareSide;
            cp.Y = (cp.Y) * squareSide;
            var t = 'rgba(' + 200 + ',' + 200 + ',' + 200 + ',255)';
            if (i === 0) {  // black color complement....
                t = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',255)';
            }
            ctx.strokeStyle = t;
            if (squareSide > 10) {
                ctx.lineWidth = 5;
            } else {
                ctx.lineWidth = 5;
            }
            ctx.strokeRect(cp.X, cp.Y, squareSide, squareSide);
        }
    }

    function drawForce(ctx, i, x, y, squareSide, normalizeForce) {
        var t = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',255)';
        ctx.beginPath();
        ctx.strokeStyle = t;
        ctx.moveTo(x + squareSide / 2, y + squareSide / 2);
        q = normalizeForce;
        if (q === 0) {
            q = 1;
        }
        deltaX = forceArray[i].X * squareSide / q;
        deltaY = forceArray[i].Y * squareSide / q;
        ctx.lineTo(x + squareSide / 2 + deltaX, y + squareSide / 2 + deltaY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + squareSide / 2, y + squareSide / 2,
            2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

    }

    function maxForce() {
        maxF = 0.0;
        for (i = 0; i < gridSize2; i++) {
            maxF = Math.max(forceArray[i].X * forceArray[i].X +
                forceArray[i].Y * forceArray[i].Y, maxF);
        }
        return Math.sqrt(maxF);
    }

// draw raw graphics pattern
    this.drawCanvas1 = function () {
        var c = document.getElementById("drawHere");
        var ctx = c.getContext("2d");
        var myScreen = 800;

        var squareSide = myScreen / gridSize;
        var normalizeForce = maxForce();
        for (var i = 0; i < gridSize2; i++) {
            var squareRow = Math.floor(i / gridSize);
            var squareCol = Math.floor(i % gridSize);

            var y = squareRow * squareSide;
            var x = squareCol * squareSide;

            var t = 'rgba(' + colorZones[dataGrid[i]].red + ',' + colorZones[dataGrid[i]].green + ',' + colorZones[dataGrid[i]].blue + ',255)';
            ctx.beginPath();
            ctx.fillStyle = t;
            ctx.fillRect(x, y, squareSide, squareSide);
            ctx.stroke();
            drawForce(ctx, i, x, y, squareSide, normalizeForce);

        }
        drawCentroids(ctx, squareSide);
        // ctx.stroke();
    }

    return this;
}