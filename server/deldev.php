<?php
$devinfo_raw=file_get_contents("devs.json");
$devinfo=json_decode($devinfo_raw,true);
$del_dev=$_POST['del_dev'];
echo($del_dev);
unset($devinfo[$del_dev]);
$devinfo[$del_dev]=[];
echo("[deleted]");
file_put_contents("devs.json", json_encode($devinfo));
?>