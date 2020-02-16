$(function(){
    //记住密码
    (function(){
        $.ajax({
            // url:method?oper="ck"
            type: "GET",
            url: "method",
            data: "oper=ck",
            success: function(data){
                let obj=JSON.parse(data);
                $(".techAccount>input").val(obj["adname"]);
                $(".techPassword>input").val(obj["adid"]);
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    })();

    //为学生提交，老师登录绑定事件 进行切换
    $(".content>input").click(function(){
        if($(this).val()==="学生提交"){
            $(".footStudent").removeClass("disappear");
            $(".footTeacher").addClass("disappear");
        }else{
            $(".footTeacher").removeClass("disappear");
            $(".footStudent").addClass("disappear");
        }
    })

    //学生提交部分
    //判断姓名、学号、考核码、文件是否填入
    function judInfo(){
        let $info=$(".footStudent input[type=\"text\"]");
        let $fileInfo=$("#upFile")[0].files;
        if($info.eq(0).val()==""){
            $info.eq(0).focus();
            return false;
        }else if($info.eq(1).val()==""){
            $info.eq(1).focus();
            return false;
        }else if($info.eq(2).val()==""){
            $info.eq(2).focus();
            return false;
        }else if($fileInfo.length==0){
            return false;
        }else{
            return true;
        }
    }
    //判断文件类型是否已知
    function judFileType($tp){
        let knowType=["zip","rar","doc","html","mp3","mp4","ppt","txt","xml",
                      "xls","pdf"];
                    // console.log($tp)
        for(let i=0;i<knowType.length;i++){
            if($tp===knowType[i]) return $tp+".png";
        }
        return "unknow.png";
    }
    
    //文件显示部分
    $("#upFile").change(function(){
        //清空整个ul
        $("#fileList").empty();
        //获得文件
        let $fileMsg=$("#upFile")[0].files;
        //获取文件长度
        let $fileLen=$fileMsg.length;
        //定义一个空字符串，存放需要添入的html，li
        let $addHtml="";
        for(let i=0;i<$fileLen;i++){
            let $fileName=$fileMsg[i].name;
            let $type=($fileName.substr($fileName.lastIndexOf(".")).substr(1)).toLowerCase();
            // console.log($type);
            $type=judFileType($type);
            $addHtml+="<li><img src=\"image\\"+$type+"\"></br><span>"+$fileName+"</span></li>"
            // console.log($type);
        }
        let $tmp=$($addHtml);
        $("#fileList").append($tmp);
    })
    //文件提交部分
    $(".footStudent>input").click(function(){
        let $jud=judInfo();
        if(!$jud){
            $(".errorStyle").eq(0).removeClass("disappear");
        }else{
            let formData =new FormData(document.getElementById("fr"));
            // formData.append("oper","submit");
            $.ajax({
                type: "POST", //POST?
                url: "upload",//接口
                data: formData,
                cache: false,    
                processData: false,
                contentType: false, 
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==0){
                        alert("文件传输成功！");
                    }else{
                        alert("文件传输失败!");
                    }
                    // 刷新页面
                    location.reload();
                },
                error: function(xhr){
                    alert(xhr.status);
                    //刷新页面
                    location.reload();
                }
            })
        }  
    })
    
    //老师登录部分
    //点击眼睛按钮使密码是否显示
    $("#eye").click(function(){
        let $type=$(".techPassword>input").attr("type");
        if($type==="password"){
            $("#eye>i").eq(1).removeClass("disappear");
            $("#eye>i").eq(0).addClass("disappear");
            $(".techPassword>input").attr("type","text");
        }else{
            $("#eye>i").eq(0).removeClass("disappear");
            $("#eye>i").eq(1).addClass("disappear");
            $(".techPassword>input").attr("type","password");
        }
    })

    //点击登录按钮传输数据到服务器，再判断是否登录
    $(".footTeacher>input").click(function(){
        let $account=$(".techAccount>input").val(),
            $password=$(".techPassword>input").val(),
            flag=true;
        //提示账号密码不能为空
        (function(){
            if($account==""){
                $(".errorStyle").eq(1).addClass("disappear");
                $(".errorStyle").eq(2).removeClass("disappear");
                $(".techAccount>input").focus();
                return flag=false;
            }
            if($password==""){
                $(".errorStyle").eq(1).addClass("disappear");
                $(".errorStyle").eq(2).removeClass("disappear");
                $(".techPassword>input").focus();
                return flag=false;
            }
        })();
        if(flag){
            //判断记住密码是否选中
            let $ck=$("#remember >input").prop("checked")?1:0;
            // console.log($ck);
            $.ajax({
                // Url:method?adname=用户名&adid=密码&ck=1需要记住密码0不需要&oper=“login”
                // return {error:0, time:2020-2-9}
                type: "GET",
                url: "method",    //接口
                data: "adname="+$account+"&adid="+$password+"&ck="+$ck+"&oper=login",
                beforeSend: function(){
                    //防止重复点击使服务器崩溃
                    $(this).attr("disabled","disabled");
                },
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==0){
                        let $name=obj["htmlName"];
                        // location.href="Backstage.html";
                        window.open($name);  
                    }else{
                        $(".errorStyle").eq(2).addClass("disappear");
                        $(".errorStyle").eq(1).removeClass("disappear");
                        //$(".techAccount>input").val()=""为什么不行？ <-现在看你就是个傻啤 我fo了
                        $(".techAccount>input").get(0).value="";
                        $(".techPassword>input").get(0).value="";
                        $(".techAccount>input").focus();
                    }
                },
                complete: function(){
                    $(this).removeAttr("disabled");
                },
                error: function(xhr){
                    alert(xhr.status)
                }
            })
        }
    })

    //为考核码失去焦点绑定事件 显示出考核内容
    $(".stuCheckCode>input").bind("input propertychange",function(){
        // 通过test查看考核信息
        // Url:manager?test=考核码&oper=”getTestNoticeByTest”
        // 响应：{"period":"时间间隔","test":"考核码","tName":"考核题目","state":"状态"
        // ,"tContent":"考核内容","tDeadline":"考核日期","tId":"考核id"}
        let $val=$(".stuCheckCode>input").val();
        $.ajax({
            type: "GET",
            url: "manager",
            data: "test="+$val+"&oper=getTestNoticeByTest",
            success: function(data){
                let $data=JSON.parse(data);
                if($data["error"]==0){
                    //清除信息
                    $(".khInfo").empty().removeClass("disappear");
                    $(".preInfo").addClass("disappear");
                    //补上信息
                    let $addInfo=$("<span>考核题目："+$data["tName"]+"</span></br>"
                                   +"<span>考核内容："+$data["tContent"]+"</span></br>"
                                   +"<span>截止日期："+$data["tDeadline"]+"</span></br>")
                    $(".khInfo").append($addInfo);
                }else{
                    $(".khInfo").addClass("disappear");
                    $(".preInfo").removeClass("disappear");
                }
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    })
})