// CanvasGames - Annealing of colors - swapping two cell values if it is a better color match

var screenDraw = 0;
var screenDelay = 1;
var gridSize = 4;
var gridSize2 = gridSize * gridSize;
var serviceFlag = true; // set when operating parameters change
var Pause = true; // Pause Play button state
var Step = false; // runs through 1 cycle of smooth + FFT when true

var ColorSpace = 3;
var maxTest = 3 * 255 * 255;

var districts ;



var avgPosn = {x:0, y:0};



var changes = 0;
var totalChanges = 0;
var noiseLevel = 0;

var forceRange = 10;
var savedData = "";

var fftLayer = "All";


// dataGrid stores graphic data
var dataGrid = new Array(gridSize2);
var fftGrid = new Array(gridSize2);

// fill FFT grid with zeros in RGB elements
function zeroFFTGrid(fG, gS2) {
    for (var i = 0; i < gS2; i++) {
        fG[i] = new gridCell(0, 0, 0);
    }
}

// draw raw graphics pattern
function drawFFTCanvas() {
    var c = document.getElementById("drawFFT2D");
    var ctx = c.getContext("2d");
    var myScreen = 800;
    ctx.beginPath();
    var squareSide = myScreen / gridSize;
    for (var i = 0; i < gridSize2; i++) {
        var squareRow = Math.floor(i / gridSize);
        var squareCol = Math.floor(i % gridSize);

        var y = squareRow * squareSide;
        var x = squareCol * squareSide;
        var t = '';
        switch (fftLayer) {
            case "All":
                t = 'rgba(' + fftGrid[i].r + ',' + fftGrid[i].g + ',' + fftGrid[i].b + ',255)';
                break;
            case "Red":
                t = 'rgba(' + fftGrid[i].r + ',' + 0 + ',' + 0 + ',255)';
                break;
            case "Green":
                t = 'rgba(' + 0 + ',' + fftGrid[i].g + ',' + 0 + ',255)';
                break;
            case "Blue":
                t = 'rgba(' + 0 + ',' + 0 + ',' + fftGrid[i].b + ',255)';
                break;

            default:
                t = 'rgba(' + fftGrid[i].r + ',' + fftGrid[i].g + ',' + fftGrid[i].b + ',255)';
                break;
        }
        ctx.fillStyle = t;
        ctx.fillRect(x, y, squareSide, squareSide);
    }
    ctx.stroke();
}

// reset grid related values
function reconfigureGridRelatedStructures(dropdownSize, dropdownColor, dropdownRange) {
    gridSize = parseInt(dropdownSize.options[dropdownSize.selectedIndex].value);
    gridSize2 = gridSize * gridSize;
    fftGrid = new Array(gridSize2);

    ColorSpace = parseInt(dropdownColor.options[dropdownColor.selectedIndex].value);
    ColorScale = Math.floor(255 / (ColorSpace - 1));

    cycleDelay();

    // generate new grid....
    districts = new GraphicSpace(gridSize, ColorSpace);
    //zeroFFTGrid(fftGrid, gridSize2);
    screenDraw = 0;
}

// handle html button presses
function OnChange(param) {
    var dropdownSize = document.getElementById("select1");
    var dropdownColor = document.getElementById("select2");
    var dropdownRange = document.getElementById("select4");
    fftLayer = document.getElementById("selectFFTL").value;

    // adjust smoothing range
    if (param == 4) {
        forceRange = parseInt(dropdownRange.options[dropdownRange.selectedIndex].value);

    } else if (param == 5) {
        // already read in the new parameter fftLayer
        var a = 0; // for break point...
    } else {
        reconfigureGridRelatedStructures(dropdownSize, dropdownColor, dropdownRange);
    }
    districts.drawData();
    districts.drawCanvas1();
    //fftGrid = fft2d(dataGrid, gridSize);
    //drawFFTCanvas();
    serviceFlag = true;
}

function smooth() {
    screenDraw++;
    districts.drawData();

    nextGen(districts);
    //vectorSwap2();
    //fftGrid = fft2d(dataGrid, gridSize);
}

function cycle(myVarr) {
    smooth();
    districts.drawData();
    //drawFFTCanvas();
    if (serviceFlag) {
        clearInterval(myVarr);
        if (Step === false) {
            startLooping();
        }
    }
}

var myVar;

// start calculating updates
function startLooping() {
    myVar = setInterval(function () {
        cycle(myVar)
    }, screenDelay);
    Pause = false;
    document.getElementById("PausePlay").innerHTML = "Pause";
}

// start repeating operations
function start() {
    Step = false;
    startLooping();
    //document.getElementById("PausePlay").innerHTML="Pause";
}

function stop() {
    clearInterval(myVar);
    Pause = true;
    document.getElementById("PausePlay").innerHTML = "Play";
}

function step() {
    stop();
    Step = true;
    cycle(myVar);
}

function cycleDelay() {
    var dropdownDelay = document.getElementById("select3");
    screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
    serviceFlag = true;
}

function ButtonLabelToPlay() {
    document.getElementById("PausePlay").innerHTML = "Play";
}

// toggle between running and paused if current state is not paused
function PausePlay() {
    if (Pause) {
        start();
    }
    else {
        stop();
    }
}

//fillDistanceGrid();
OnChange(0);
//drawCanvas1();
//start();
