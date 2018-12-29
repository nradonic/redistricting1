<?php
/**
 * Created by IntelliJ IDEA.
 * User: NickRadonic
 * Date: 2018-12-18
 * Time: 00:18
 */


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

$dataDir = "./data937/";
$fileName = $dataDir . safe($payload).".txt";

//if (strlen($total->fileName) >= 5 ){
    $dataFromFile = file_get_contents($fileName);
//}

print ($dataFromFile);

?>