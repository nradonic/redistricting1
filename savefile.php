<?php

$break = "<br/>";
function printX($arraY)
{
    global $break;
    $result = $break;
    $gridsize = sqrt(count($arraY));
    $kount = 0;
    foreach ($arraY as $key => $value) {
        $kount++;
        if ($kount > 101) {
            $result = $result . "...";
            break;
        }
        if ($kount % $gridsize != 1) {
            $result = $result . ",";
        }
        $result = $result . $value;
        if (($kount % $gridsize) == 0)
            $result = $result . $break;
    }
    return $result;
}
function printXY($arraY)
{
    global $break;
    $result = $break;
    $gridsize = sqrt(count($arraY));
    $kount = 0;
    foreach ($arraY as $key => $value) {
        $kount++;
        if ($kount > 101) {
            $result = $result . "...";
            break;
        }
        if ($kount % $gridsize != 1) {
            $result = $result . " , ";
        }
        $result = $result . round($value->X) . ":" . round($value->Y);
        if (($kount % $gridsize) == 0)
            $result = $result . $break;
    }
    return $result;
}

function safe($line){
    $result = "";
    $pattern = "/[A-Za-z0-9_]/";
    for($i = 0; $i<strlen($line); $i++) {
        if( preg_match($pattern , $line[$i])){
            $result  = $result .$line[$i];
        }
        if (strlen($result)>15) break;
    }
    return $result;
}
$payload = file_get_contents('php://input');

$total = json_decode($payload);

$fileName = safe($total->fileName).".txt";
print('File name  : ' . $fileName . $break);
print('Grid size  : ' . $total->gridSize . $break);
print('Screen draw: ' . $total->screenDraw . $break);
print('Color space: ' . $total->ColorSpace . $break);
print('Delay (ms) : ' . $total->screenDelay . $break);

print('Data Grid  : ' . printX($total->dataGrid) . $break);
print('Forces     : ' . printXY($total->forcesArray) . $break);

if(strlen($fileName) >= 5){
    $myfile = fopen("./data937/" . $fileName, "w");
    fwrite($myfile, $payload);
    fclose($myfile);
}


?>