<?php
$devinfo_raw=file_get_contents("devs.json");
$devinfo=json_decode($devinfo_raw,true);
$dev_num=0;
if($devinfo!=null){
    while(isset($devinfo['dev'.strval($dev_num)])){
        $dev_num++;
    }
}
for($a=0;$a<$dev_num;$a++){
    $tmpid='dev'.strval($a);
    if(isset($devinfo[$tmpid]['name'])){
        $output1=exec("curl -X POST -d \"{'sc':'".$devinfo[$tmpid]['code']."','test':'test'}\" http://".$devinfo[$tmpid]['ip']."/data --connect-timeout 2",$output, $status);
        if($status!=0){
            $devinfo[$tmpid]['status']="offline";
            continue;
        }
        if($output1=="yes"){
            $devinfo[$tmpid]['status']="yes";
            continue;
        }
        if($output1=="no"){
            $devinfo[$tmpid]['status']="no";
            continue;
        }
    }
    
    
}
echo(json_encode($devinfo));
file_put_contents("devs.json", json_encode($devinfo));
?>