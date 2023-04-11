inited=0;
var all_devs_info={};
var default_device_type=[null,"按鈕"];
if(inited==0){
    init_page();
    inited=1;
}
function init_page(){
    try{
        list_devices();
    }catch{
        setTimeout(init_page,1000);
    }
}
function list_devices(){
    $.ajax({
        url:"/server/listdev.php",
        method:"GET",
        error: function(xhr, status, error) {
            alert('伺服器連線失敗. Error code: ' + status);
        },
        success:function(response){
            document.getElementById('devicelist_page').innerHTML=response;
        }
    })
}
try{
    check_device();
}catch{
    setTimeout(check_device,100);
}

function check_device(){
    $.ajax({
        url:"/server/checkdev.php",
        method:"GET",
        error: function(xhr, status, error) {
            console.log('伺服器連線失敗. Error code: ' + status);
        },
        success:function(response){
            var stas=JSON.parse(response);
            console.log(stas);
            all_devs_info=stas;
            try{
                update_status(stas);
            }catch{
                setTimeout(() => {
                    update_status(stas);
                }, 500)
            }
            
            setTimeout(check_device,1500);
        }
    })

}
function lift(devid){
    $.ajax({
        async:false,
        url:"/server/liftdev.php",
        method:"POST",
        data:{
            "lift_devid":devid
        },
        error: function(xhr, status, error) {
            console.log('伺服器連線失敗. Error code: ' + status);
        },
        success:function(response){
            console.log(response);
            alert("解除成功!");
            document.getElementById(devid).style.backgroundColor="#96ff7d";
            document.getElementById(devid+"-state").innerHTML="裝置狀態：按鈕未被按下";
        }
    })
}
function infdevice(devid){
    output="裝置名稱："+all_devs_info[devid]['name']
    +"\n裝置ID："+devid
    +"\n裝置類型："+default_device_type[all_devs_info[devid]['type']]
    +"\n裝置IP位址："+all_devs_info[devid]['ip']
    +"\n裝置secret code："+all_devs_info[devid]['code'];
    document.getElementById('deviceinf_page').innerHTML="<pre>"+output+"</pre><button onclick=\"closeinf()\">關閉</button>";
    document.getElementById('deviceinf_page').style.display="block";
    return;
}
function closeinf(){
    document.getElementById('deviceinf_page').innerHTML="";
    document.getElementById('deviceinf_page').style.display="none";
    return;
}
function update_status(data){
    var data_num=0
    while("dev"+data_num in data){
        data_num++;
    }
    for(a=0;a<data_num;a++){
        var tmp="dev"+a;
        if("name" in data[tmp]){
            var sta=data[tmp]['status'];
            var output;
            if(sta=="no"){
                output="按鈕未被按下";                
                document.getElementById(tmp).style.backgroundColor="#96ff7d";
            }
            if(sta=="yes"){
                output="按鈕已被按下&emsp;<button onclick=\"lift('"+tmp+"')\">解除按下警戒</button>";
                document.getElementById(tmp).style.backgroundColor="#ff5858";
            }
            if(sta=="offline"){
                output="裝置已離線";
                document.getElementById(tmp).style.backgroundColor="#c8c8c8";
            }
            output="裝置狀態："+output;
            document.getElementById(tmp+"-state").innerHTML=output;
        }
    }
}
function add_device_(){
    document.getElementById("deviceadd_page").style.display='block';//顯示增加裝置對話框
}
function cancel_add_device(){
    var deviceadd_name=document.getElementById('deviceadd_name').value="";
    var deviceadd_ip=document.getElementById('deviceadd_ip').value='';
    var deviceadd_secret_code=document.getElementById('deviceadd_secret_code').value='';
    document.getElementById("deviceadd_page").style.display='none';//關閉增加裝置對話框
    init_page();
}
function added_device(){
    var deviceadd_name=document.getElementById('deviceadd_name').value;
    var deviceadd_type=document.getElementById('deviceadd_type').value;
    var deviceadd_ip=document.getElementById('deviceadd_ip').value;
    var deviceadd_secret_code=document.getElementById('deviceadd_secret_code').value;
    
    var ad_dev_but=document.getElementById('ad_dev_but');
    
    
    $.ajax({
        //async:false,
        url:"/server/adddev.php",
        method: 'POST',
        data:{
            "deviceadd_name":deviceadd_name,
            "deviceadd_type":deviceadd_type,
            "deviceadd_ip":deviceadd_ip,
            "deviceadd_secret_code":deviceadd_secret_code
        },
        beforeSend:()=>{
            ad_dev_but.innerHTML="連線中...";
        },
        success: function(response) {
            //alert("添加成功");
            console.log(response);
            seeresponse(response);
            
        },
        error: function(xhr, status, error) {
            alert('伺服器連線失敗. Error code: ' + status);
        },
        complete:function(){
            ad_dev_but.innerHTML="新增裝置";
        }
    });
}
function seeresponse(response){
    if(response.indexOf("[duplicate_device_name]")!=-1){
        alert("Error:裝置名稱重複");
        return;
    }
    if(response.indexOf("[connect_failed]")!=-1){
        alert("Error:裝置連接失敗");
        return;
    }
    if(response.indexOf("[invalid_sc]")!=-1){
        alert("Error:錯誤secret code");
        return;
    }
    if(response.indexOf("[success]")!=-1){
        alert("添加成功!");
        cancel_add_device();
        return;
    }
}
function deldevice(dev_id){
    if(confirm("確認刪除此裝置?此動作無法復原")){
        $.ajax({
            url:"/server/deldev.php",
            method:"POST",
            data:{
                "del_dev":dev_id
            },
            success:function(response){
                console.log(response);
                if(response.indexOf('[deleted]')!=-1){
                    //alert("成功刪除");
                    init_page();
                }else{
                    alert("刪除失敗");
                }
            }
        })
    }
    
}