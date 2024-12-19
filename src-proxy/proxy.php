<?php

function curlTX($url){
    $curl = curl_init();

    $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';
    curl_setopt($curl, CURLOPT_USERAGENT, $config['useragent']);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);
    curl_close($curl);

    echo $result;
}

header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-type: application/json');

if(isset($_GET['txid'])){
    $server = "https://btc1.trezor.io/api/v2/tx-specific/";
    if(isset($_GET['server'])){
        $server = "https://btc2.trezor.io/api/v2/tx-specific/";
    }
    if(isset($_GET['fit'])){
        $server = "http://147.229.14.216:3001/api/v2/tx-specific/";
    }
    $txid = filter_input(INPUT_GET, "txid");
    if(strlen($txid) == 64){
        $url = $server.$txid;
        curlTX($url);
    }
}