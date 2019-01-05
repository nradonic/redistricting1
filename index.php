<!doctype html>
<html>
<head>
<meta name="description" content="Redistricting Process">
	<meta name="keywords" content="HTML,CSS,Canvas,JavaScript">
	<meta name="author" content="Nick Radonic nick@radonic.us">
	<title>Color Grouping - Redistricting</title>

	<link rel="stylesheet" type="text/css" href="fillCanvas.css">
	<link rel="SHORTCUT ICON" href="../radonicimages/happy.ico">

	<link rel="shortcut icon" type="image/png" href="jasmine-standalone-2.3.4/lib/jasmine-2.3.4/jasmine_favicon.png">
    <style type="text/css">
   		p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; -webkit-text-fill-color: black}
    	p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; -webkit-text-fill-color:black; min-height: 14.0px}
    	span.s1 {font-kerning: none}
  	</style>
</head>

<body>
<H1>/Library/Server/Web/Data/Sites/redistricting1</h1>
	<h1>Visual Redistricting Process - Grouping Like-Elements</h1>
	<div id="info">
		<h3>Nick Radonic <img src="radonicimages/OffsetHappyFace.png"/></h3>
		<br>www.radonic.us/redistricting/
		<br>nick@radonic.us
		<!--<br>https://github.com/nradonic/CanvasGames-->
		<br>October 2017
	</div>
	<br>
	<h3 style="width:800px;text-align:center">Simple redistricting - by element flow</h3>
	<p>Nearby colored pixels are swapped if the net local color matches are better</p>
	<p>Screen Draw: <span id="screenDrawCount"></span>
	<span width="200px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
	<button  id="step" onclick='step();'>Step</button>&nbsp;&nbsp;
	<button  id="PausePlay" onclick='PausePlay();'>Pause/Play</button>

	</p>

	<p>Grid Size
	<select  id="select1" name=select1 onchange='OnChange(1);'>
		<option selected>4</option>
		<option>5</option>
		<option>6</option>
		<option>8</option>
		<option>10</option>
		<option>12</option>
		<option>20</option>
		<option>25</option>
		<option>30</option>
		<option>40</option>
		<option>50</option>
		<option>80</option>
		<option>120</option>
		<option>150</option>
		<option>200</option>
		<option>300</option>
		<option>400</option>
		<option>800</option>

	</select>
	&nbsp;&nbsp;&nbsp;&nbsp;
	Color Space:
	<select  id="select2" name=select2 onchange='OnChange(2);'>
		<option selected>2</option>
		<option>3</option>
	</select>
	&nbsp;&nbsp;&nbsp;&nbsp;
	Delay:
	<select  id="select3" name=select3 onchange='cycleDelay();'>
	<option>1</option>
		<option>3</option>
		<option>10</option>
		<option>30</option>
		<option>100</option>
		<option>300</option>
		<option selected>1000</option>

	</select>
	&nbsp;&nbsp;&nbsp;
	</p>

	<div>
		<canvas id="drawHere" width="800" height="800" >
		</canvas>
	</div>

	<div style="border:green 1px solid">
		<p>Changes: <span id="changes" style="border:green 1px solid"></span> Total Changes: <span id="totalChanges"  style="border:green 1px solid"></span>
		</p>
        <p>Response 1: <span id="Show1" style="border:green 1px solid"></span></p>
	</div>

	<div>

		<p>File Name: <input id="canvasgamesfilename"  placeholder="File Name">
            &nbsp;&nbsp;&nbsp;&nbsp; <button  id="SaveData" onclick='SaveData();'>Save Data</button>
            &nbsp;&nbsp;&nbsp;&nbsp; <button  id="LoadData" onclick='LoadData();'>Load Data</button>
		</p>
        <p>View Layer&nbsp;&nbsp; <select id=select4 onchange='forceLayer();' >
                <option selected>All</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
                <option>13</option>
                <option>14</option>
                <option>15</option>
		</select>
		</p>
	</div>
    <div style="border:green 1px solid">
        <p>Response 2: <span id="Show2" style="border:green 1px solid"></span></p>
    </div>

<?php
    include("description.php");

    ?>



<br>
</body>
<script type="text/JavaScript" src="graphicSpace.js"> </script>
<script type="text/JavaScript" src="nextGen.js"> </script>
<script type="text/JavaScript" src="fileOperations.js"> </script>
<script type="text/JavaScript" src="fillCanvas.js"> </script>
</html>