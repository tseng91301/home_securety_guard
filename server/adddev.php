<?php

$deviceadd_name=$_POST['deviceadd_name'];
$deviceadd_type=$_POST['deviceadd_type'];
$deviceadd_ip=$_POST['deviceadd_ip'];
$deviceadd_secret_code=$_POST['deviceadd_secret_code'];
$devinfo_raw=file_get_contents("devs.json");
$devinfo=json_decode($devinfo_raw,true);
$tmp=0;
$dupn=0;
//echo(gettype($devinfo));
if($devinfo!=null){
    while($devinfo['dev'.strval($tmp)]["name"]!=""){
        if($tmp==0){
            $tmp1='dev0';
        }else{
            $tmp1='dev'.strval($tmp);
        }
        if($devinfo[$tmp1]['name']==$deviceadd_name){
            $dupn++;
            break;
        }
        $tmp++;
    }
}

if($dupn!=0){
    echo("[duplicate_device_name]");
    return;
}
echo("curl -X POST -d \"{'sc':'".$deviceadd_secret_code."','test':'test'}\" http://".$deviceadd_ip."/data ");

$output1=exec("curl -X POST -d \"{'sc':'".$deviceadd_secret_code."','test':'test'}\" http://".$deviceadd_ip."/data ",$output, $status);
echo($output1);
if($status!=0){
    echo("[connect_failed]");// Code to debug
    return;
}
echo(in_array("invalid_sc",$output));
if(in_array("invalid_sc",$output)){
    echo("[invalid_sc]");
    return;
}
$dev_number='dev'.strval($tmp);
$devinfo[$dev_number]['name'] = $deviceadd_name;
$devinfo[$dev_number]['type'] = $deviceadd_type;
$devinfo[$dev_number]['ip'] = $deviceadd_ip;
$devinfo[$dev_number]['code'] = $deviceadd_secret_code;
$devinfo_after=json_encode($devinfo);
file_put_contents("devs.json",$devinfo_after);
echo("[success]");
return;
?>


