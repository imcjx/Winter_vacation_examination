$(function(){
    //存放当前查看的考核码
    let mainNum;
    //页面一进来 就要获取第一面信息
    getKhFirstPage();
    //判断是谁登录了后台系统
    (function(){
        let flag="";
        $.ajax({
            type: "GET",
            url: "manager",
            data: "oper=useSession",
            success: function(data){
                $(".head>h3").html("欢迎您，"+data)
            },
            error: function(xhr){
                // location.href="errorPage.html";
                alert(xhr.status);
            }
        })
    })();

    //创建存放每个考核信息结点
    function createKhNode(key,value){
        if(key!=0){
            let $class;
            if(value["state"]==1){
                value["state"]="已结束";
                $class="finishStatus";
            }else{
                value["state"]="未结束";
                $class="notFinishStatus";
            }
            let $node=$("<tr>"+
                "<td><input type=\"checkbox\"></td>"+
                "<td>"+value["test"]+"</td>"+
                "<td>"+value["tName"]+"</td>"+
                "<td>"+value["tContent"]+"</td>"+
                "<td class=\"khStatus\">"+
                    "<span class=\""+$class+"\">"+value["state"]+"</span>&nbsp;"+
                    "<span class=\"khOver\">点击结束</span>"+
                "</td>"+
                "<td>"+value["tDeadline"]+"</td>"+
                "<td class=\"khTool\">"+
                    "<span><i title=\"详情\" class=\"icon ion-ios-search-strong\"></i></span>&nbsp;"+
                    "<span><i title=\"删除\" class=\"icon ion-ios-close-outline\"></i></span>"+
                "</td>"+
            "</tr>")
            return $node;
        }
    }

    //创建存放每个作业信息结点
    function createHwNode(key,value){
        if(key!=0){
            let $class;
            if(value["pass"]==-1){
                value["pass"]="审核中";
                $class="auditing";
            }else if(value["pass"]==0){
                value["pass"]="未通过";
                $class="notPass";
            }else if(value["pass"]==1){
                value["pass"]="已通过";
                $class="pass";
            }
            let $node=$("<tr>"+
                "<td><input type=\"checkbox\"></td>"+
                "<td>"+value["wid"]+"</td>"+
                "<td>"+value["studentId"]+"</td>"+
                "<td>"+value["studentName"]+"</td>"+
                "<td>"+value["subTime"]+"</td>"+
                "<td><span class=\""+$class+"\">"+value["pass"]+"</span></td>"+
                "<td class=\"hwTool\">"+
                    "<i title=\"下载\" class=\"icon ion-android-download\"></i>&nbsp;"+
                    "<i title=\"已通过\" class=\"icon ion-android-happy\"></i>&nbsp;"+
                    "<i title=\"未通过\" class=\"icon ion-android-sad\"></i>&nbsp;"+
                    "<i title=\"审核中\" class=\"icon ion-android-radio-button-on\"></i>"+
                "</td>"+
            "</tr>")
            return $node;
        }
    }

    //创建考核页码
    function createPageControl(key,value,number){
        if(key==0){
            //先清空页码
            $(".khPageNum").empty();
            let $node;
            for(let i=0;i<parseInt(value["CAPages"]);i++){
                if(i==(number-1)) $node=$("<a class=\"curPage\" href=\"javascript:;\">"+(i+1)+"</a>")
                else $node=$("<a href=\"javascript:;\">"+(i+1)+"</a>")
                $(".khPageNum").append($node);
            }      
        }
    }

    //创建作业页码
    function createHwPageControl(key,value,number){
        if(key==0){
            //先清空页码
            $(".hwPageNum").empty();
            let $node;
            for(let i=0;i<parseInt(value["CAPages"]);i++){
                if(i==(number-1)) $node=$("<a class=\"curPage\" href=\"javascript:;\">"+(i+1)+"</a>")
                else $node=$("<a href=\"javascript:;\">"+(i+1)+"</a>")
                $(".hwPageNum").append($node);
            } 
        }
    }

    //获取考核的第一面
    function getKhFirstPage(){
        // 第一次进入考核详情页面：
        // Url:manager?page=1&CAPages=1&oper=”getTestDetails”;
        // [{"CAPages":总页码},{"period":"时间间隔","test":"考核码","tName":"考核题目","state":"状态"
        // ,"tContent":"考核内容","tDeadline":"考核日期","tId":"考核id"},{}]
        $.ajax({
            type: "GET",
            url: "manager",
            data: "page=1&CAPages=1&oper=getTestDetails",
            success: function(data){
                //清除原有元素
                $(".checkList tbody").empty();
                let arr=eval("("+data+")");
                // let test='[{"CAPages":"2"},{"period":"时间间隔","test":"555","tName":"555","state":"未结束","tContent":"12456","tDeadline":"2020/2/13","tId":"886"},{"period":"时间间隔","test":"755","tName":"555","state":"未结束","tContent":"12456","tDeadline":"2020/2/13","tId":"886"}]'
                // let arr=eval("("+test+")");
                $.each(arr,function(k,v){
                    let $addNode=createKhNode(k,v);
                    //加入不同的考核
                    $(".checkList tbody").append($addNode);
                    //创建页码
                    createPageControl(k,v,1);
                })
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    }

    //获取考核的其他页面(第一面除外)
    function getKhOtherPage(number){
        // Url:manager?page=页面&CAPages=0&oper=”getTestDetails”;
        $.ajax({
            type: "GET",
            url: "manager",
            data: "page="+number+"&CAPages=0&oper=getTestDetails",
            success: function(data){
                //清除原有元素
                $(".checkList tbody").empty();
                let arr=eval("("+data+")");
                $.each(arr,function(k,v){
                    let $addNode=createKhNode(k,v);
                    //加入不同的考核
                    $(".checkList tbody").append($addNode);
                    //创建页码
                    createPageControl(k,v,number);
                })
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    }

    //获取某个考核作业的第一面
    function getHwFirstPage(){
        // Url:manager?test=”考核码”&page=页数&CAPages=0&&oper=”getWorkDetails”
        // 响应: [{"CAPages":总页数},{"studentId":"学号","wid":"作业id","test":"考核码","studentName":"学生姓名","subTime":"作业提交时间"},{同理},{同理}]
        $.ajax({
            type: "GET",
            url: "manager",
            data: "test="+mainNum+"&page=1&CAPages=1&oper=getWorkDetails",
            success: function(data){
                //清除所有元素
                $(".detailPageTwo tbody").empty();
                let arr=eval("("+data+")");
                $.each(arr,function(k,v){
                    let $addNode=createHwNode(k,v);
                    //加入不同的作业
                    $(".detailPageTwo tbody").append($addNode);
                    //创建页码
                    createHwPageControl(k,v,1);
                })
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    }

    //获取某个考核作业的其他面
    function getHwOtherPage(number){
        // Url:manager?test=”考核码”&page=页数&CAPages=0&&oper=”getWorkDetails”
        $.ajax({
            type: "GET",
            url: "manager",
            data: "test="+mainNum+"&page="+number+"&CAPages=0&oper=getWorkDetails",
            success: function(data){
                //清除所有元素
                $(".detailPageTwo tbody").empty();
                let arr=eval("("+data+")");
                $.each(arr,function(k,v){
                    let $addNode=createHwNode(k,v);
                    //加入不同的作业
                    $(".detailPageTwo tbody").append($addNode);
                    //创建页码
                    createHwPageControl(k,v,number);
                })
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
    }
    
    //为工具栏按钮动态绑定删除查询事件
    $(".checkList").delegate(".khTool i","click",function(ev){
        //执行删除
        if($(ev.target).attr("class")=="icon ion-ios-close-outline"){
            let $data=[];
            let $tmp={};
            $tmp["code"]=$(this).parent().parent().siblings().eq(1).html();
            $data.push($tmp);         
            let $jsonStr=JSON.stringify($data);
            // console.log($jsonStr);
            $.ajax({
                type: "POST",    //method:"POST",
                url: "manager",
                data: "test="+$jsonStr+"&oper=deleteTestNotice",
                contentType: "application/x-www-form-urlencoded",
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==1) alert("删除失败!");
                    //判断当前页码并返回
                    if($(".khPageNum>.curPage").html()==1) getKhFirstPage();
                    else getKhOtherPage($(".khPageNum>.curPage").html());
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
        }
        //转入查询页面
        else{
            //转查询页面前让内容处于考核内容栏
            $(".iDownload").addClass("disappear");
            $(".iModify").removeClass("disappear");
            $(".iDelete").addClass("disappear");
            $(".detailPageOne").removeClass("disappear");
            $(".detailPageTwo").addClass("disappear");
            $(".checkDetailContent").siblings().addClass("disappear");
            $(".checkDetailContent").removeClass("disappear");
            // Url:manager?test=考核码&oper=”getTestNoticeByTest”
            // 响应：{"period":"时间间隔","test":"考核码","tName":"考核题目","state":"状态"
            // ,"tContent":"考核内容","tDeadline":"考核日期","tId":"考核id"}
            let $test=$(this).parent().parent().siblings().eq(1).html();
            mainNum=$test;
            $.ajax({
                type: "GET",
                url: "manager",
                data: "test="+$test+"&oper=getTestNoticeByTest",
                success: function(data){
                    let obj=JSON.parse(data);
                    $(".dOne span").eq(1).html(obj["tName"]);
                    $(".dTwo span").eq(1).html(obj["tContent"]);
                    $(".dThree span").eq(1).html(obj["period"]);
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
        }
    })

    //点击按钮结束考核状态
    $(".checkList").delegate(".khOver","click",function(){
        let $finshOrNot=$(this).siblings().eq(0)
        let $val=$finshOrNot.html();
        if($val=="未结束"){
            let $test=$(this).parent().siblings().eq(1).html();
            $.ajax({
                // 考核状态修改页面。
                // Url:manager?test=考核码&state=考核状态&oper=”changeTestNoticeState””
                // ”响应：{"error":"是否修改成功"}
                type: "GET",
                url: "manager",
                data: "test="+$test+"&state=1&oper=changeTestNoticeState",
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==1) alert("结束失败！请重试！");
                    if($(".khPageNum>.curPage").html()==1) getKhFirstPage();
                    else getKhOtherPage($(".khPageNum>.curPage").html());
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
        }
    })

    //为考核列表tr中的复选框绑定事件，进行全选与全不选操作
    $(".checkList th>input").click(function(){
        // console.log($(this).prop("checked")); true/false
        let $allCheckbox=$(".checkList td>input");
        //如果被选中 进行全选
        if($(this).prop("checked")){
            for(let i=0;i<$allCheckbox.length;i++){
                $allCheckbox.eq(i).prop("checked",true);
            }
        }else{
            for(let i=0;i<$allCheckbox.length;i++){
                $allCheckbox.eq(i).prop("checked",false);
            }
        }
    })

    //为考核列表td中的复选框绑定事件
    $(".checkList").delegate("td>input","click",function(){
        if(!$(this).prop("checked")){
            //将tr的复选框变为false状态
            $(".checkList th>input").prop("checked",false);
        }else{
            //对td的所有复选框进行判断
            let $flg=true;
            let $allCheckbox=$(".checkList td>input");
            for(let i=0;i<$allCheckbox.length;i++){
                if(!$allCheckbox.eq(i).prop("checked")){
                    $flg=false;
                    break;
                }
            }
            if($flg) $(".checkList th>input").prop("checked",true);
            else $(".checkList th>input").prop("checked",false);
        }
    })

    //为批量删除考核绑定事件
    $("i[title=\"删除选中\"]").click(function(){
        //存放即将要删除的考核的考核码
        let $checkCode=[];
        //获得td中所有复选框
        let $allCheckbox=$(".checkList td>input");
        //获取已勾选复选框的考核码
        for(let i=0;i<$allCheckbox.length;i++){
            if($allCheckbox.eq(i).prop("checked")){
                //一定要放在里面 不然push的都是同一个对象
                let $tmp={};
                $tmp["code"]=$allCheckbox.eq(i).parent().next().eq(0).html();
                $checkCode.push($tmp);
            }      
        }
        // 考核删除页面。
        // Url:manager?test=考核码&oper=“deleteTestNotice”
        // 响应：{"error":"是否修改成功"}
        let $jsonStr=JSON.stringify($checkCode);
        console.log($jsonStr);
        $.ajax({
            type: "POST",    //method:"POST",
            url: "manager",
            data: "test="+$jsonStr+"&oper=deleteTestNotice",
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                let obj=JSON.parse(data);
                if(obj["error"]==1) alert("删除失败!");
                //判断当前页码并返回
                if($(".khPageNum>.curPage").html()==1) getKhFirstPage();
                else getKhOtherPage($(".khPageNum>.curPage").html());
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
        // 测试json
        // let t='[{"name":"cjx","age":"18"},{"name":"abv","age":"22"}]';
        // let arr=eval("("+t+")");
        // console.log(arr[1]);
        
    })
    
    //考核发布、考核查看，点击后页面改变
    $(".head .nav span").eq(0).click(function(){
        //清除考核发布栏里的内容
        clearContent();
        //清除报告错误的提示
        $(".errorTips").addClass("disappear");
        //解决bug
        $(".detailPageOne").removeClass("disappear");
        $(".detailPageTwo").addClass("disappear");
        if($flg) {inputToDiv(); $flg=false}

        $(".checkPublishContent").removeClass("disappear");
        $(".checkPublishContent").siblings().addClass("disappear");
    })
    $(".head .nav span").eq(1).click(function(){
        //解决bug
        $(".detailPageOne").removeClass("disappear");
        $(".detailPageTwo").addClass("disappear");
        if($flg) {inputToDiv(); $flg=false}

        $(".checkListContent").removeClass("disappear");
        $(".checkListContent").siblings().addClass("disappear");
        //获取第一面信息
        getKhFirstPage();
    })

    //为按钮绑定事件使点击时 考核发布、考核查看两个按钮弹出
    $(".head>h1>i").click(function(){
        $("h1>.nav").toggle(500);
    })

    //为按钮绑定事件使点击时 考核内容、提交详情两个按钮弹出
    $(".iNav").click(function(){
        $(".smallNav").fadeToggle(500);
    })

    //清除考核发布栏里的内容
    function clearContent(){
        $(".checkPublish input[type=\"text\"]").val("");
        $(".checkPublish textarea").val("");
        $(".errorTips").addClass("disappear");
    }

    //为考核发布的提交按钮绑定事件
    $(".checkPublish input[type=\"button\"]").click(function(){
        //判断每个栏目是否填写
        let $flg=true;
        let $test=$("#khID").val(),$tName=$("#khTitle").val(),
            $tContent=$("#khDetail").val(),$time=$("#khDeadline").val();
        if($test==""){
            $("#khID").focus();
            $flg=false;
        }else if($tName==""){
            $("#khTitle").focus();
            $flg=false;
        }else if($tContent==""){
            $("#khDetail").focus();
            $flg=false;
        }else if($time==""){
            $("#khDeadline").focus();
            $flg=false;
        }
        //判断时限是否为正整数
        let $reg=/^[1-9]{1,}[0-9]{0,}$/;

        if(!$flg){
            $(".errorTips").eq(0).removeClass("disappear");
            $(".errorTips").eq(1).addClass("disappear");
        }else if(!$reg.test($time)){
            $(".errorTips").eq(1).removeClass("disappear");
            $(".errorTips").eq(0).addClass("disappear");
        }else{
            // Url: manager?tName=考核题目&tContent=考核内容&test=考核码&time=考核时限&oper=”giveTestNotice”
            // 响应 {error:(1失败，0成功) }；
            $.ajax({
                type: "GET",
                url: "manager",
                data: "tName="+$tName+"&tContent="+$tContent+"&test="+$test+"&time="+$time+"&oper=giveTestNotice",
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==0){
                        alert("考核发布成功");
                    }else{
                        alert("考核发布失败，请重试");
                    }
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
            //清除考核发布栏里所有内容
            clearContent();
        }
    })

    //点击铅笔按钮可以进行修改
    function divToInput(){
        //存放先前的考核信息
        let $preInfo=[];
        $preInfo.push($(".dOne").children().eq(1).text());
        $preInfo.push($(".dTwo").children().eq(1).text());
        $preInfo.push($(".dThree").children().eq(1).text());
        //添加input textarea框
        $(".dOne").children().eq(1).html("<input type=\"text\" class=\"addInput\">");
        $(".addInput").eq(0).val($preInfo[0]);
        $(".dTwo").children().eq(1).html("<textarea class=\"addInput\" style=\"height: 210px; resize: none;\" cols=\"10\" rows=\"10\"></textarea>")
        $(".addInput").eq(1).val($preInfo[1]);
        $(".dThree").children().eq(1).html("<input type=\"text\" class=\"addInput\">");
        $(".addInput").eq(2).val($preInfo[2]);
        //聚焦到input框
        $(".addInput").eq(0).focus();
    }

    //点击提交按钮修改结果保存去除input
    function inputToDiv(){
        //存放更改后的考核信息
        let $preInfo=[];
        $preInfo.push($(".dOne").find("input").val());
        $preInfo.push($(".dTwo").find("textarea").val());
        $preInfo.push($(".dThree").find("input").val());
        //添加span
        $(".dOne").children().eq(1).html("<span>"+$preInfo[0]+"</span>");
        $(".dTwo").children().eq(1).html("<span>"+$preInfo[1]+"</span>");
        $(".dThree").children().eq(1).html("<span>"+$preInfo[2]+"</span>")
    }

    //判断铅笔按钮当前状态
    let $flg=false;
    //为修改考核信息按钮绑定事件
    $(".iModify").click(function(){
        if(!$flg){
            divToInput();
            $flg=!$flg;
        }else{
            $(".addInput").eq(0).focus();
        }
    })

    //为更改信息的提交按钮绑定事件
    $("#modifyBtn").click(function(){
        if($flg){
            inputToDiv();
            $flg=!$flg;
            // 考核修改页面。
            // Url:manager?test=考核码&tName=考核题目&tContent=考核内容&period=考核时限&oper=”changeTestNotice””
            // ”响应：{"error":"是否修改成功"}
            let $tName=$(".dOne span").eq(1).html(),$tContent=$(".dTwo span").eq(1).html()
                    ,$period=$(".dThree span").eq(1).html();
            $.ajax({
                type: "GET",
                url: "manager",
                data: "test="+mainNum+"&tName="+$tName+"&tContent="+$tContent+"&period="+$period+"&oper=changeTestNotice",
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==1) alert("提交失败");
                    else alert("提交成功");
                    getKhContent();
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
        }
    })

    //为作业审核绑定事件
    $(".detailPageTwo").delegate(".hwTool i","click",function(ev){
        let $statusSpan=$(this).parent().parent().find("span");
        let $pass=null,$wid=$(this).parent().siblings().eq(1).html();
        if($(this).attr("title")=="下载"){
            $pass=10086;
            //执行下载操作
        }else if($(this).attr("title")=="已通过"){
            $pass=1;
            //状态变为通过
            // $statusSpan.removeClass("notPass").removeClass("auditing");
            // $statusSpan.addClass("pass");
            // $statusSpan.html("已通过");
        }else if($(this).attr("title")=="未通过"){
            $pass=0;
            //状态变为未通过
            // $statusSpan.removeClass("pass").removeClass("auditing");
            // $statusSpan.addClass("notPass");
            // $statusSpan.html("未通过");
        }else if($(this).attr("title")=="审核中"){
            $pass=-1;
            //状态变为审核中
            // $statusSpan.removeClass("notPass").removeClass("pass");
            // $statusSpan.addClass("auditing");
            // $statusSpan.html("审核中");
        }
        if($pass==10086){
            //下载
            let $fr=$("<form></form>").attr("action","download").attr("method","POST");
            let $ip=$("<input>").attr("type","hidden").attr("name","wid").attr("value",$wid);
            $fr.append($ip);
            $fr.appendTo("body").submit().remove();
        }else{
            $.ajax({
                // Url:manager?pass=通过是否或审核中&wid=作业id&oper=”changeWorkPass”
                // 响应：{"error":"是否修改成功"}
                type: "GET",
                url: "manager",
                data: "pass="+$pass+"&wid="+$wid+"&oper=changeWorkPass",
                success: function(data){
                    let obj=JSON.parse(data);
                    if(obj["error"]==1) alert("修改信息失败！请重试！");
                    //判断当前页码并返回
                    if($(".hwPageNum>.curPage").html()==1) getHwFirstPage();
                    else getHwOtherPage($(".hwPageNum>.curPage").html());
                },
                error: function(xhr){
                    alert(xhr.status);
                }
            })
        } 
    })

    //获取某一个考核的信息
    function getKhContent(){
        $.ajax({
            type: "GET",
            url: "manager",
            data: "test="+mainNum+"&oper=getTestNoticeByTest",
            success: function(data){
                let obj=JSON.parse(data);
                $(".dOne span").eq(1).html(obj["tName"]);
                $(".dTwo span").eq(1).html(obj["tContent"]);
                $(".dThree span").eq(1).html(obj["period"]);
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })        
    }

    //为考核内容，提交列表绑定事件
    $(".smallNav").children().eq(0).click(function(){
        $(".iModify").removeClass("disappear");
        $(".iDownload").addClass("disappear");
        $(".iDelete").addClass("disappear");
        $(".detailPageOne").removeClass("disappear");
        $(".detailPageTwo").addClass("disappear");
        getKhContent();
    })
    $(".smallNav").children().eq(1).click(function(){
        $(".detailPageTwo").removeClass("disappear");
        $(".detailPageOne").addClass("disappear");
        $(".iModify").addClass("disappear");
        $(".iDownload").removeClass("disappear");
        $(".iDelete").removeClass("disappear");
        if($flg) {inputToDiv(); $flg=false}
        //获取该考核的第一面学生信息
        getHwFirstPage();
    })

    //为作业列表tr中的复选框绑定事件，进行全选与全不选操作
    $(".detailPageTwo th>input").click(function(){
        // console.log($(this).prop("checked")); true/false
        let $allCheckbox=$(".detailPageTwo td>input");
        //如果被选中 进行全选
        if($(this).prop("checked")){
            for(let i=0;i<$allCheckbox.length;i++){
                $allCheckbox.eq(i).prop("checked",true);
            }
        }else{
            for(let i=0;i<$allCheckbox.length;i++){
                $allCheckbox.eq(i).prop("checked",false);
            }
        }
    })

    //为作业列表td中的复选框绑定事件
    $(".detailPageTwo").delegate("td>input","click",function(){
        if(!$(this).prop("checked")){
            //将tr的复选框变为false状态
            $(".detailPageTwo th>input").prop("checked",false);
        }else{
            //对td的所有复选框进行判断
            let $flg=true;
            let $allCheckbox=$(".detailPageTwo td>input");
            for(let i=0;i<$allCheckbox.length;i++){
                if(!$allCheckbox.eq(i).prop("checked")){
                    $flg=false;
                    break;
                }
            }
            if($flg) $(".detailPageTwo th>input").prop("checked",true);
            else $(".detailPageTwo th>input").prop("checked",false);
        }
    })

    //为批量下载考核绑定事件
    $("i[title=\"批量下载\"]").click(function(){
        //获得td中所有复选框
        let $allCheckbox=$(".detailPageTwo td>input:checked");
        if($allCheckbox.length>0){
            let $fr=$("<form></form>").attr("action","download").attr("method","POST");
            for(let i=0;i<$allCheckbox.length;i++){
                let $wid=$allCheckbox.eq(i).parent().next().eq(0).html()
                let $ip=$("<input>").attr("type","hidden").attr("name",i).attr("value",$wid);
                $fr.append($ip);
            }
            $fr.appendTo("body").submit().remove();
        }
    })

    //为批量删除考核绑定事件
    $("i[title=\"批量删除\"]").click(function(){
        //存放即将要下载的作业的作业ID
        let $hwID=[];
        //获得td中所有复选框
        let $allCheckbox=$(".detailPageTwo td>input");
        //获取已勾选复选框的考核码
        for(let i=0;i<$allCheckbox.length;i++){
            if($allCheckbox.eq(i).prop("checked")){
                let $tmp={}
                $tmp["code"]=$allCheckbox.eq(i).parent().next().eq(0).html();
                $hwID.push($tmp);
            }  
        }  
        //发送ajax请求
        let $jsonStr=JSON.stringify($hwID);
        $.ajax({
            // 上传文件删除：
            // Url:manager?wid=[作业码]&oper=”deleteWork”
            // 响应:error;
            type: "POST",    //method:"POST",
            url: "manager",
            data: "wid="+$jsonStr+"&oper=deleteWork",
            contentType: "application/x-www-form-urlencoded",
            success: function(data){
                let obj=JSON.parse(data);
                if(obj["error"]==1) alert("删除失败");
                //判断当前页码并返回
                if($(".hwPageNum>.curPage").html()==1) getHwFirstPage();
                else getHwOtherPage($(".hwPageNum>.curPage").html());
            },
            error: function(xhr){
                alert(xhr.status);
            }
        })
        //测试json
        // let t='[{"name":"cjx","age":"18"},{"name":"abv","age":"22"}]';
        // let obj=eval("("+t+")");
        // console.log(obj);
    })

    //为考核列表的页码绑定事件
    $(".khPageNum").delegate("a","click",function(){
        // console.log($(this).html());
        //点击后变为点击状态
        let $num=$(this).html();
        if($num==1) getKhFirstPage();
        else getKhOtherPage($num);
        console.log($(this).html());
    })

    //为作业列表的页码绑定事件
    $(".hwPageNum").delegate("a","click",function(){
        // console.log($(this).html());
        //点击后变为点击状态
        let $num=$(this).html();
        if($num==1) getHwFirstPage();
        else getHwOtherPage($num);
    })
})