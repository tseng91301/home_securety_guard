<?php
$lift_devid=$_POST['lift_devid'];
$devinfo_raw=file_get_contents("devs.json");
$devinfo=json_decode($devinfo_raw,true);
exec("curl -X POST -d \"{'sc':'".$devinfo[$lift_devid]['code']."','restore':'restore'}
\" http://".$devinfo[$lift_devid]['ip']."/data --connect-timeout 2",$output, $status);
$devinfo[$lift_devid]['status']="no";
file_put_contents("devs.json", json_encode($devinfo));
?>
