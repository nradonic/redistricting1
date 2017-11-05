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

var districts;

var changes = 0;
var totalChanges = 0;
var noiseLevel = 0;

var forceRange = 10;
var savedData = "";

var fftLayer = "All";


// dataGrid stores graphic data
var dataGrid = new Array(gridSize2);
var fftGrid = new Array(gridSize2);

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
    screenDraw = 0;
}

// handle html button presses
function OnChange(param) {
    var dropdownSize = document.getElementById("select1");
    var dropdownColor = document.getElementById("select2");
    var dropdownRange = document.getElementById("select4");

    reconfigureGridRelatedStructures(dropdownSize, dropdownColor, dropdownRange);
    districts.drawData();
    districts.drawCanvas1();
    serviceFlag = true;
}

function smooth() {
    screenDraw++;
    districts.drawData();
    districts.drawCanvas1();
    nextGen(districts);
    districts.drawData();
    districts.drawCanvas1();
}

function cycle(myVarr) {
    smooth();
    districts.drawData();
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

OnChange(0);
