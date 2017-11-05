function GraphicSpace(GridSize, ColorSpace) {

    this.gridSize = GridSize;
    this.colorSpace = ColorSpace;

    var gridSize2 = gridSize * gridSize;

    // dataGrid stores graphic data
    var dataGrid = new Array(gridSize2);

    var COLORSCALE = 255;

//unique color area objects [{r,g,b}]
    function ColorZone(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    //this.centroidPositions = []
    var centroidPositions = [];

    this.clearCentroidPositions = function () {
        centroidPositions = [];
    }
    this.pushCentroidPositions = function (x, y) {
        centroidPositions.push({X: x, Y: y});
    }

    this.centroid = function (x, y) {
        this.x = x;
        this.y = y;
        return {X: x, Y: y};
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
                    colorZones.push(new ColorZone(scaleColor(r, colorSpace), scaleColor(g, colorSpace), scaleColor(b, colorSpace)));
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


    /**
     * returns a random integer scaled to argument
     * @param scaleIt
     * @returns {number}
     */
    function randGS(scaleIt) {
        var a = Math.floor(Math.random() * scaleIt);
        return a;
    }

    /**
     * fillDataGrid
     * @param dG data array
     * @param gs2 size of array
     */
    fillDataGrid: function fillDataGrid(gridSize1) {
        gridSize = gridSize1;
        gridSize2 = gridSize1 * gridSize1;
        for (var i = 0; i < gridSize2; i++) {
            dataGrid[i] = randGS(colorZones.length);
        }
    }

    fillDataGrid(gridSize);

    // external get gridSize
    this.getGridSize = function () {
        return gridSize;
    }

    // external get dataGrid
    this.getDataGrid = function () {
        return dataGrid;
    }

    // extension to Array type for 2D, with initialization - from Douglas Crockford
    Array.matrix = function (numrows, numcols, initial) {
        var arr = [];
        for (var i = 0; i < numrows; ++i) {
            var columns = [];
            for (var j = 0; j < numcols; ++j) {
                columns[j] = {dist: 0, dist2: 0};
            }
            arr[i] = columns;
        }
        return arr;
    };

// draw data
    this.drawData = function () {
        document.getElementById("screenDraw").innerHTML = screenDraw.toFixed(0);
        document.getElementById("changes").innerHTML = changes.toFixed(0);
        document.getElementById("totalChanges").innerHTML = totalChanges.toFixed(0);
        document.getElementById("noiseLevel").innerHTML = noiseLevel.toFixed(0);
    }

    var drawCentroids = function (ctx, squareSide) {
        for (var i = 0; i < centroidPositions.length; i++) {
            var cp = centroidPositions[i];
            cp.X = (cp.X) * squareSide;
            cp.Y = (cp.Y) * squareSide;
            var t = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',255)';
            ctx.strokeStyle = t;
            if (squareSide > 10) {
                ctx.lineWidth = 5;
            } else {
                ctx.lineWidth = 1;
            }
            ctx.strokeRect(cp.X, cp.Y, squareSide, squareSide);
        }
    }


// draw raw graphics pattern
    this.drawCanvas1 = function () {
        var c = document.getElementById("drawHere");
        var ctx = c.getContext("2d");
        var myScreen = 800;
        ctx.beginPath();
        var squareSide = myScreen / gridSize;
        for (var i = 0; i < gridSize2; i++) {
            var squareRow = Math.floor(i / gridSize);
            var squareCol = Math.floor(i % gridSize);

            var y = squareRow * squareSide;
            var x = squareCol * squareSide;

            var t = 'rgba(' + colorZones[dataGrid[i]].red + ',' + colorZones[dataGrid[i]].green + ',' + colorZones[dataGrid[i]].blue + ',255)';
            ctx.fillStyle = t;
            ctx.fillRect(x, y, squareSide, squareSide);
        }
        drawCentroids(ctx, squareSide);
        ctx.stroke();
    }

    function diffSQ0(ST1, ST2) {
        if (dataGrid[ST1].r === dataGrid[ST2].r &&
            dataGrid[ST1].g === dataGrid[ST2].g &&
            dataGrid[ST1].b === dataGrid[ST2].b) {
            return 0;
        } else {
            return 10000;
        }
    }

// color space maximum less color differences squared
    function diffSQ(ST1, ST2) {
        return maxTest - diffSQ0(ST1, ST2);
    }

    function fitColor(i1, j1, i2, j2) {
        var ST1 = i1 * gridSize + j1;
        var ST2 = i2 * gridSize + j2;
        var edge = gridSize - 1;

        var total = 0;
        var cnt = 0;
        if (j2 !== 0) {
            total = diffSQ(ST1, ST2 - 1);
            cnt++;
        }
        if (i2 !== 0 && j2 !== 0) {
            total += diffSQ(ST1, ST2 - gridSize - 1) / 2;
            cnt++;
        }//2;
        if (i2 !== 0) {
            total += diffSQ(ST1, ST2 - gridSize);
            cnt++;
        }
        if (i2 !== 0 && j2 !== edge) {
            total += diffSQ(ST1, ST2 - gridSize + 1) / 2;
            cnt++;
        }///2;
        if (j2 !== edge) {
            total += diffSQ(ST1, ST2 + 1);
            cnt++;
        }
        if (i2 !== edge && j2 !== 0) {
            total += diffSQ(ST1, ST2 + gridSize - 1) / 2;
            cnt++;
        }//2;
        if (i2 !== edge) {
            total += diffSQ(ST1, ST2 + gridSize);
            cnt++;
        }
        if (i2 !== edge && j2 !== edge) {
            total += diffSQ(ST1, ST2 + gridSize + 1) / 2;
            cnt++;
        }//2;
        return total / cnt;
    }

//convert i position in array to column value x
    function iToX(i, gS) {
        return Math.floor(i % gS);
    }

//convert i position in array to row value y
    function iToY(i, gS) {
        return Math.floor(i / gS);
    }

// convert x,y to i in square grid
    function xYToI(x, y, gS) {
        return x * gS + y;
    }

// calculate weighted color-diff^2/distance^2 over entire array for a specific cell
    function forceAtGridPoint(i1, j1) {
        var posn1 = xYToI(i1, j1, gridSize);
        // sum of forces variable
        var force = 0;

        var i1Min = Math.max(i1 - forceRange, 0);
        var i1Max = Math.min(i1 + forceRange, gridSize);

        var j1Min = Math.max(j1 - forceRange, 0);
        var j1Max = Math.min(j1 + forceRange, gridSize);

        for (var i = i1Min; i < i1Max; i++) {
            for (var j = j1Min; j < j1Max; j++) {
                // get grid locations for 'i' element   2D->1D
                // calculate position differences
                var dx = j1 - j;
                var dy = i1 - i;
                // lookup location difference squared vector
                var dist2 = distanceGrid[Math.abs(dy)][Math.abs(dx)].dist2;
                var posn0 = xYToI(i, j, gridSize);
                // calculate color difference squared
                var dc = diffSQ0(posn0, posn1);
                // add weighted force to sum of forces
                var forceScalar = dc * dist2;
                force += forceScalar;
            }
        }
        return force;
    }

// trade colors at two locations
    function trade(i1, j1, i2, j2) {
        var one = i1 * gridSize + j1;
        var two = i2 * gridSize + j2;

        var r = dataGrid[one].r;
        var g = dataGrid[one].g;
        var b = dataGrid[one].b;

        dataGrid[one].r = dataGrid[two].r;
        dataGrid[one].g = dataGrid[two].g;
        dataGrid[one].b = dataGrid[two].b;

        dataGrid[two].r = r;
        dataGrid[two].g = g;
        dataGrid[two].b = b;
    }

// returns force reduction for swap : positive is an improvement, negative is a worsening of differences
    function fitColorAll(i1, j1, i2, j2, force1) {
        var posn1 = xYToI(i1, j1, gridSize);
        var posn2 = xYToI(i2, j2, gridSize);
        //var force1 = forceAtGridPoint(i1,j1);
        var force2 = forceAtGridPoint(i2, j2);
        trade(i1, j1, i2, j2);
        var force1At2 = forceAtGridPoint(i2, j2);
        var force2At1 = forceAtGridPoint(i1, j1);
        trade(i1, j1, i2, j2);
        return force1 + force2 - force1At2 - force2At1;
    }

// var cellColors = {
//     colors: [],
//     findOrAddColor: function (cellColor, cell, i, j) {
//         var found = false;
//         this.colors.forEach(function (element) {
//             if (element.r === cellColor.r && element.g === cellColor.g && element.b === cellColor.b) {
//                 found = true;
//             }
//         })
//         if (!found) {
//             this.colors.push(cellColor);
//         }
//     }
// };
//
// var steps = [1, -1, gridSize, -gridSize];
//
// var colorCenters = [];

    /**
     * zeroColorCenters - zeros out the x,y location parameters for all color zones
     * @param colorZones
     */
    function zeroColorCenters(colorZones) {
        colorCenters = [];
        for (var i = 0; i < colorZones.size; i++) {
            colorCenters.push({x: 0, y: 0});
        }
    }

    return this;
}