// a collection of file operations for the redistricting data structures

function SaveData() {
    stop();
    tempFileName = document.getElementById("canvasgamesfilename").value;
    dataGrid = districts.getDataGrid();
    forcesArray = districts.getForceVectors();
    savedData = JSON.stringify({
        fileName: tempFileName,
        gridSize: gridSize,
        gridIndex: document.getElementById("select1").selectedIndex,
        gridSize2: gridSize2,
        screenDraw: screenDrawCount,
        ColorSpace: ColorSpace,
        gridColorSpaceIndex: document.getElementById("select2").selectedIndex,
        screenDelay: screenDelay,
        delayIndex: document.getElementById("select3").selectedIndex,
        districts: districts,
        dataGrid: dataGrid,
        forcesArray: forcesArray
    });
    ButtonLabelToPlay();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "savefile.php");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert(xhr.responseText);

            //document.getElementById("Show1").innerHTML = xhr.responseText;
            document.getElementById("Show1").innerHTML = "<br/>Colors:<br/>" +
                datagridAsColorValues(districts.getDataGrid(), gridSize, gridSize2) +
                "<br/>Forces:<br/>" +
                forcesAsTextArray(b.forcesArray, gridSize, gridSize2);
        }
    }
    xhr.send(savedData);
}

function LoadData() {
    stop();

    tempFileName = document.getElementById("canvasgamesfilename").value;

    //  ButtonLabelToPlay();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "loadfile.php");
    xhr.setRequestHeader('Content-Type', 'application/text');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // alert(xhr.responseText);
            savedData = xhr.responseText;

            var b = JSON.parse(savedData);

            gridSize = b.gridSize;
            document.getElementById("select1").selectedIndex = b.gridIndex;
            gridSize2 = b.gridSize2;
            screenDrawCount = b.screenDraw;
            screenDelay = b.screenDelay;
            document.getElementById("select3").selectedIndex = b.delayIndex;
            ColorSpace = b.ColorSpace;
            document.getElementById("select2").selectedIndex = b.gridColorSpaceIndex;
            reconfigureGridRelatedStructures(document.getElementById("select1"), document.getElementById("select2"));
            districts.setDataGrid(b.dataGrid);
            districts.setForceVectors(b.forcesArray);
            drawDistricts();
            document.getElementById("Show1").innerHTML = "<br/>Colors:<br/>" +
                datagridAsColorValues(districts.getDataGrid(), gridSize, gridSize2) +
                "<br/>Forces:<br/>" +
                forcesAsTextArray(b.forcesArray, gridSize, gridSize2);
            //document.getElementById("Show2").innerHTML = xhr.responseText;
            document.getElementById("Show2").innerHTML = "<br/>Filename: " + tempFileName +
                ",  gridSize: " + gridSize + ",  gridSize2: " + gridSize2 + ",  ScreenDraw: " + screenDrawCount +
                ",  Color Space: " + ColorSpace + ",  Screen Delay: " + screenDelay;
        }
    }
    xhr.send(tempFileName);

}
