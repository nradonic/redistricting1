// a collection of file operations for the redistricting data structures

function SaveData() {
    stop();
    tempFileName = document.getElementById("canvasgamesfilename").value;
    dataGrid = districts.getDataGrid();
    savedData = JSON.stringify({
        fileName: tempFileName,
        gridSize: gridSize,
        gridSize2: gridSize2,
        screenDraw: screenDrawCount,
        ColorSpace: ColorSpace,
        screenDelay: screenDelay,
        districts: districts,
        dataGrid: dataGrid
    });
    ButtonLabelToPlay();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "savefile.php");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert(xhr.responseText);

            document.getElementById("Show1").innerHTML = xhr.responseText;
        }
    }
    xhr.send(savedData);
}

function LoadData() {
    stop();
    var b = JSON.parse(savedData);
    gridSize = b.gridSize;
    gridSize2 = b.gridSize2;
    screenDrawCount = b.screenDraw;
    screenDelay = b.screenDelay;
    ColorSpace = b.ColorSpace;
    dataGrid = b.dataGrid;
    drawCanvas1();
    ButtonLabelToPlay();
}
