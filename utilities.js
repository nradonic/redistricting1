/**
 * convert i (0 - gridsize-1) to x,y coords
 * @param gridIndex
 * @returns {{X: number, Y: number}}
 */
function index2XYValues(gridIndex, gridSize, gridSize2) {
    if (gridIndex < 0 || gridIndex > gridSize2) {
        return {X: 0, Y: 0};
    }
    var x = Math.floor(gridIndex % gridSize);
    var y = Math.floor(gridIndex / gridSize);
    return {X: x, Y: y};
}

var lineBreak = "<br/>";

function datagridAsColorValues(dataGrid, gridSize, gridSize2) {
    result = lineBreak;
    count = 0;
    for (var i = 0; i < gridSize2; i++) {
        count++;
        if (count > 101) {
            result = result + "..." + lineBreak;
            break;
        }
        if ((count % gridSize) !== 1) {
            result = result + " , ";
        }
        result = result + dataGrid[i];
        if ((count % gridSize) === 0) {
            result = result + lineBreak
        }
    }
    result = result + lineBreak;
    return result;
}

function forcesAsTextArray(forceArray, gridSize, gridSize2) {

    result = lineBreak;
    kount = 0;
    for (var i = 0; i < gridSize2; i++) {
        kount++;
        if (kount > 101) {
            result = result + "..." + lineBreak;
            break;
        }
        if (kount % gridSize !== 1) {
            result = result + " , ";
        }
        result = result + Math.round(forceArray[i].X) + ":" + Math.round(forceArray[i].Y);
        if ((kount % gridSize) === 0) {
            result = result + lineBreak;
        }
    }
    result = result + lineBreak;
    return result;
}
