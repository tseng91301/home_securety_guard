<?php
$devinfo_raw=file_get_contents("devs.json");
$devinfo=json_decode($devinfo_raw,true);
$dev_num=0;
if($devinfo!=null){
    while(isset($devinfo['dev'.strval($dev_num)])){
        $dev_num++;
    }
}else{
    $devinfo= new stdClass();
}
$outp_html="";
for($a=0;$a<$dev_num;$a++){
    $tmpid='dev'.strval($a);
    if(isset($devinfo[$tmpid]['name'])){
        $outp_html.="<div id=\"".$tmpid."\" class=\"dev_page\">";
        $outp_html.="<h3>裝置名稱：".$devinfo[$tmpid]['name']."</h3>";
        $outp_html.="<h3 id=\"".$tmpid."-state\">準備中...</h3>";
        $outp_html.="<button onclick=\"infdevice('".$tmpid."')\">查看此裝置資訊</button>
        <button onclick=\"deldevice('".$tmpid."')\">刪除裝置</button>";
        $outp_html.="</div>";
    }
    
    
}
echo($outp_html);
?>
