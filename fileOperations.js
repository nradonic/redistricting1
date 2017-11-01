// a collection of file operations for the redistricting data structures

function SaveData() {
    stop();
    savedData = JSON.stringify({
        gridSize: gridSize,
        gridSize2: gridSize2,
        screenDraw: screenDraw,
        ColorSpace: ColorSpace,
        screenDelay: screenDelay,
        dataGrid: dataGrid
    });
    ButtonLabelToPlay();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/Controller/Action");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
        }
    }
    xhr.send(savedData);
}

function LoadData() {
    stop();
    var b = JSON.parse(savedData);
    gridSize = b.gridSize;
    gridSize2 = b.gridSize2;
    screenDraw = b.screenDraw;
    screenDelay = b.screenDelay;
    ColorSpace = b.ColorSpace;
    dataGrid = b.dataGrid;
    drawCanvas1();
    ButtonLabelToPlay();
}
