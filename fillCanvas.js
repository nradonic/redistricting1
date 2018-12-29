// CanvasGames - Annealing of colors - swapping two cell values if it is a better color match

var screenDrawCount = 0;
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

// reset grid related values
function reconfigureGridRelatedStructures(dropdownSize, dropdownColor){
    gridSize = parseInt(dropdownSize.options[dropdownSize.selectedIndex].value);
    gridSize2 = gridSize * gridSize;

    ColorSpace = parseInt(dropdownColor.options[dropdownColor.selectedIndex].value);
    ColorScale = Math.floor(255 / (ColorSpace - 1));

    cycleDelay();

    // generate new grid....
    districts = new GraphicSpace(gridSize, ColorSpace);
    screenDrawCount = 0;
}
var changesFound = 0;
/**
 *
 */
function drawDistricts() {
    districts.drawData(changesFound, totalChanges);
    districts.drawCanvas1();
}


/**
 * handle html button presses
 * @param param
 * @constructor
 */
function OnChange(param) {
    var dropdownSize = document.getElementById("select1");
    var dropdownColor = document.getElementById("select2");
    // var dropdownRange = document.getElementById("select4");

    reconfigureGridRelatedStructures(dropdownSize, dropdownColor);
    drawDistricts();
    serviceFlag = true;
}

/**
 *
 */
function smooth() {
    screenDrawCount++;
    drawDistricts();

    changesFound = nextGen(districts);
    totalChanges += changesFound

    drawDistricts();
}

var myLoopingVariable;

// start calculating updates
/**
 *
 */
function startLooping() {
    myLoopingVariable = setInterval(function () {
        smooth()   // cycle()
    }, screenDelay);
    Pause = false;
    document.getElementById("PausePlay").innerHTML = "Pause";
}


/**
 * start repeating operations
 */
function start() {
    Step = false;
    startLooping();
}

function stop() {
    clearInterval(myLoopingVariable);
    Pause = true;
    document.getElementById("PausePlay").innerHTML = "Play";
}

function step() {
    stop();
    Step = true;
    smooth(); //cycle();
}

function cycleDelay() {
    var dropdownDelay = document.getElementById("select3");
    var state = Pause;
    stop();
    screenDelay = parseInt(dropdownDelay.options[dropdownDelay.selectedIndex].value);
    if (!state) {
        start();
    }
    // serviceFlag = true;
}

function ButtonLabelToPlay() {
    document.getElementById("PausePlay").innerHTML = "Play";
}

// toggle between running and paused if current state is not paused
function PausePlay() {
    if (Pause) {
        start();
        return;
    }
    stop();
}

OnChange(0);
