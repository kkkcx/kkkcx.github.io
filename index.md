
# 软件工程课程设计——黄金点游戏


# 目录

[第8周周报](#第8周周报)

[第10周周报](#第10周周报)

[第12周周报](#第12周周报)

[第14周周报](#第14周周报)
# 第8周周报

一.本周课设要求

分组编写一个满足下列要求的黄金点游戏程序。  
➢ 游戏规则：N个同学（N通常大于10），每人写一个0~100之间的有理数   
(不包括0或100)，交给裁判，裁判算出所有数字的平均值，然后乘以0.618    
(所谓黄金分割常数），得到G值。提交的数字最靠近G（取绝对值）的同   
学得到N分，离G最远的同学得到－2分，其他同学得0分。  
➢ 采用单机方式实现，需要为用户提供便利的输入界面。  
➢ 该游戏每次至少可以运行10轮以上，并能够保留各轮比赛结果。  
➢ 后续在此基础上迭代开发。  

二.本周内完成的任务总结  
搭建博客，结对编程项目组成立，完成立项准备工作，进行需求收集和功能的讨论，以及相关安装环境的搭建

三.学习内容总结

1.结对编程：  
了解结对编程的概念以及如何结对编程：  
在结对编程模式下，一对程序员肩并肩地、平等地、互补地进行开发工作。  
两个程序员并排坐在一台电脑前，面对同一个显示器，使用同一个键盘，同一个鼠标一起工作。  
他们一起分析，一起设计，一起写测试用例，一起编码，一起单元测试，一起集成测试，一起写文档等。

结对编程中有两个角色：  
（a）驾驶员（Driver）是控制键盘输入的人。  
（b）领航员（Navigator）起到领航、提醒的作用。  
这两个角色是可以互换的。和现实生活中的例子类似，一个人负责具体的执行（驾驶，用键盘编辑程序等），另一人负责导航、检查、掩护等。  

为什么要结对编程？  
每人在各自独立设计、实现软件的过程中不免要犯这样那样的错误。  
在结对编程中，因为有随时的复审和交流，程序各方面的质量取决于一对程序员中各方面水平较高的那一位。  
这样，程序中的错误就会少得多，程序的初始质量会高很多，这样会省下很多以后修改、测试的时间。

如何结对编程？  
（1）驾驶员：写设计文档，进行编码和单元测试等XP开发流程。  
（2）领航员：审阅驾驶员的文档、驾驶员对编码等开发流程的执行；考虑单元测试的覆盖程度；是否需要和如何重构；帮助驾驶员解决具体的技术问题。  
（3）驾驶员和领航员不断轮换角色，不宜连续工作超过一小时。领航员要控制时间。  
（4）主动参与。任何一个任务都首先是两个人的责任，也是所有人的责任。没有“我的代码”、“你的代码”或“她的代码”，只有“我们的代码”。  
（5）只有水平上的差距，没有级别上的差异。尽管可能大家的级别资历不同，但不管在分析、设计或编码上，双方都拥有平等的决策权利。  

2.黄金点游戏规则  
N个同学（N通常大于10），每人写一个0~100之间的有理数 (不包括0或100)，交给裁判，裁判算出所有数字的平均值，然后乘以0.618（所谓黄金分割常数），得到G值。  
提交的数字最靠近G（取绝对值）的同学得到N分，离G最远的同学得到－2分，其他同学得0分。  

四.项目状态  
需求收集、项目启动  

五.风险分析及解决办法  
暂无  

# 第10周周报

一.本周课设要求  
继续完善黄金点游戏，添加前端界面  


二.本周内完成的任务总结  

1.实现黄金点游戏逻辑  

2.为黄金点游戏设计ui界面  

3.项⽬改进：
 + 优化页⾯UI设计
 + 设计构建⽤户数据库
 + 改变提⽰信息弹出⽅式


三.学习内容总结  
学习使用jsp将黄金点游戏在网页端进行实现  


四.项目状态  
进行项目构建和编码  


五.风险分析及解决办法    

风险分析：  
在实践需求过程中遇到一些之前理解不清的地方，需要落实  

解决办法：  
加强交流沟通，理解需求  

六.核心代码展示

 游戏算法（JS实现：）
```javascript
$(function()
{
 var num = 0.0;
 var lun =0;
 var i=1; 
 var j=1; 
 var data= [];
 $('input').keydown(function(event)
 {
 if(event.keyCode!=8 && (event.keyCode<48 || event.keyCode>57))
{
 return false; 
 }
 });
 $('#create').click(function(){
 //$('#res').html('');
 num = $('#num').val();
 lun = $('#lun').val();
 if(num == '')
{
 alert('请填写玩家的数量！');
 return false;
 }
else if(num>50)
{
 alert('游戏玩家最多为50⼈！');
 return false;
 }
 if(lun == '')
{
 alert('填写游戏轮次！');
 return false;
 }
else if(lun<2)
{
 alert('游戏轮次最少为2轮！');
 return false;
 }
 //初始化数组
 for(var a=1;a<=lun;a++)
{
 data[a] = [];
 for(var b=1;b<=num;b++)
{
 data[a][b] = 0;
 }
 }
 $('#createGame').css('display','none');//隐藏css中的元素，
 $('#input').css('display','block');
 $('#title').find('.lun').html(lun);
 $('#title').find('.num').html(num);
 });
 $('#test').click(function(){
 num = $('#num').val();
 lun = $('#lun').val();
 if(num == '')
{
 alert('请填写玩家数量！');
 return false;
 }
else if(num>50)
{
 alert('玩家最多为50⼈！');
 return false;
 }
 if(lun == ''){
 alert('请填写游戏轮次！');
 return false;
 }
else if(lun<2)
{
 alert('游戏轮次最少为2轮！');
 return false;
 }
 //随机产⽣数字
 var array = [];
 for(var a=1;a<=lun;a++){
 array[a] = [];
 for(var b=1;b<=num;b++){
 array[a][b] = Math.floor(Math.random()*100);
 }
 }
 count(array,num,lun);
 })
 $('#submit').click(function()
 {
 var val = $('input[name=val]').val();
 if(val<1 || val>99)
{
 alert('请输⼊0~100之间的有理数,不包括0或100');
 return false;
 }
 data[i][j] = val;
 $('input[name=val]').val('');
 j++;
 if(j>num)
{
 alert('本轮游戏结束，进⼊下⼀轮游戏！');
 j=1;
 i++;
 if(i>lun)
 {
 alert('本次游戏结束！');
 $('#createGame').css('display','block');
 $('#input').css('display','none');
 i = 1;
 j = 1;
 count(data,num,lun);
 }
 $('#now').find('.lun').html(i);
 }
 //重新设置表单内容
 $('#now').find('.num').html(j);
 });
 });
```
游戏结果计算及输出：
```javascript
function count(array,num,lun){
 var data = array;
 var s = [];
 //初始化数组
 for(var a=1;a<=lun;a++){
 s[a] = [];
 for(var b=1;b<=num;b++){
 s[a][b] = 0;
 }
 }
 var str = '<tr><td>&nbsp;</td>';
 for(var a=1;a<=num;a++){
 str += "<td>玩家"+a+"</td>";
 }
 str += "<td>总计</td><td>平均</td><td>G</td></tr>";
 for(var a=1;a<=lun;a++){
 var sum = 0;
 str += "<tr><td>第"+a+"轮</td>";
 for(var b=1;b<=num;b++){
 sum += parseInt(data[a][b]);
 //str += "<td>"+data[a][b]+"</td>";
 }
 var avg = sum/num;
 var G = 0.618*avg;
 //获取最⼤、最⼩
 var max = Math.abs(data[a][1] - G); 
 var min = Math.abs(data[a][1] - G);
 for(var b=1;b<=num;b++)
{
 if(Math.abs(data[a][b] - G) >= max)
 {
 max = Math.abs(data[a][b] - G);
 }
 if(Math.abs(data[a][b] - G) <=min)
 {
 min = Math.abs(data[a][b] - G);
 }
 }
 for(var b=1;b<=num;b++){
 var score = 0;
 var color = '';
 if(Math.abs(data[a][b]-G) == max){
 score = -2;
 color = 'red';
 }
 if(Math.abs(data[a][b]-G) == min){
 score = num;
 color = 'red';
 } 
 /*str += "<td>"+data[a][b]+"("+s+")"+score+","+max_index+","+min_index+"</td>";*/
 s[a][b] = score;
 str += "<td style='color:"+color+"'>"+data[a][b]+"("+score+")</td>";
 }
 str += "<td>"+sum+"</td><td>"+avg+"</td><td>"+G+"</td></tr>";
 }
 var res = [];
 str += '<tr><td>计分</td>';
 for(var b=1;b<=num;b++){
 var sum = 0;
 for(var a=1;a<=lun;a++){
 sum += parseInt(s[a][b]);
 }
 res[b] = sum;
 }
 var max_res = res[1];
 var min_res = res[1];
 for(var c=2;c<=num;c++){
 if(res[c] > max_res){
 max_res = res[c];
 }
 if(res[c] < min_res){
 min_res = res[c];
 }
 }
 var winner = '';
 var loser = '';
 for(var c=1;c<=num;c++){
 var res_color = '';
 if(res[c] == max_res){
 res_color = 'red';
 winner += '玩家'+c+',';
 }
 if(res[c] == min_res){
 res_color = 'red';
 loser += '玩家'+c+',';
 }
 str += "<td style='color:"+res_color+"'>"+res[c]+"</td>";
 }
 winner += '获胜<br>';
 loser += '输了';
 str += "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
 var col = parseInt(num)+3;
 str += "<tr><td>结果</td><td style='color:red' colspan='"+col+"'>"+winner+loser+"</td></tr>";
 $('#res').html(str);
 }
```

页⾯设计
```html
<body>
 <div class="showTime">当前时间：2020年3⽉17-0时54分14秒</div>
 <script>
 var t = null;
 t = setTimeout(time, 1000); //開始运⾏
 function time() {
 clearTimeout(t); //清除定时器
 dt = new Date();
 var y = dt.getFullYear();
 var mt = dt.getMonth() + 1;
 var day = dt.getDate();
 var h = dt.getHours(); //获取时
 var m = dt.getMinutes(); //获取分
 var s = dt.getSeconds(); //获取秒
 document.querySelector(".showTime").innerHTML =
 "当前时间：" +
 y +
 "年" +
 mt +
 "⽉" +
 day +
 "-" +
 h +
 "时" +
 m +
 "分" +
 s +
 "秒";
 t = setTimeout(time, 1000); //设定定时器，循环运⾏
 }
 </script>
<div id="container">
<h2> 黄⾦点游戏</h2>
<div id="div1">
<div id="CreateGame">
 <table>
 <tr>
 <td>玩家⼈数:</td>
 <td><input type="text" id="num" class=""></td>
 </tr>
 <tr>
 <td>游戏轮次：</td>
 <td><input type="text" id="lun" class=""></td>
 </tr> 
 </table>
 <table>
 <tr align="center"><td><button id="create">创建游戏</button></td><td><button id="test">模拟游戏</button></td></tr>
 </table>
 </div>
</div>
<div id="input">
 <table>
 <tr align="center" id="title">
 <td colspan="3">本次游戏共<span class="lun"></span>轮，玩家⼈数为<span class="num"></span>⼈</td>
 </tr>
 <tr align="center" id="now">
 <td colspan="3">当前轮次：第<span class="lun">1</span>轮，当前玩家为：玩家<span class="num">1</span></td>
 </tr>
 <tr>
 <td align="right">请输⼊数字：</td>
 <td><input type="text" name="val" class="val"></td>
 <td><span style="color:red;">(提⽰！0~100之间的有理数,不包括0或100)</span></td>
 </tr>
 <tr align="center">
 <td colspan="3"><button id="submit">提交</button></td>
 </tr>
 </table>
 </div>
 <table id="res" border='1px' style="margin-bottom:160px"></table>
</div>
<p>四川⼤学软件⼯程课程设计</p>
<p>胡斌 康采新</p>
<a href="mailto:1127235750@qq.com">联系我们</a>
</body>
```


# 第12周周报

## 一.本周课设要求

第二次增加要求：  
（1）两人合作，做成简单的 client/server App，用户从网页/手机上输入数字，  
并算出获胜者。 技术讨论的议题有：  
• 前面写的模块有多少是可以重用的？ 为何不能重用？  
• 研讨 client/server 的API 应该怎么设计，如何认证用户？  
• 如何开发client App？   

（2）如何设计测试用例， 保证server 的正确性， 效率， 压力测试 （如何模拟上千个客户端，从不同的端口，提交不同的数字？）

（3）原来我们是让用户从客户端输入数字， 看到结果之后，再玩下一轮。用户玩这个游戏是有一定的策略的， 我们如何能把这个策略  
变成程序，成为人工智能呢？ 能否利用 AI 算法提交数据？  
• client 程序能访问所有以前的历史记录， 它再推测下一个数字是多少，然后提交。  
• 这里面也有很多问题要克服，例如，如果数字很小0.0000000000000000001，下溢了， 怎么办？  
• 应该提交的是 double, float, 还是 string 类型？  

（4） 修改规则， 每个用户每次可以提交两个数字， 其他规则一样。  

（5）带 OCR 功能的App，语音播报游戏结果。

（6）多轮游戏结果可视化显示及数据分析。


## 二.本周内完成的任务总结  

1.改进黄金点游戏逻辑  

2.增加客户端登陆界面、用户登录

3.美化黄金点游戏设计ui界面  

4.增加语音播报结果功能

5.配置数据库

6.继续尝试数据可视化


## 三.学习内容总结

1.ECharts：  
缩写来自Enterprise Charts，商业级数据图表，一个纯Javascript的图表库，可以流畅的运行在PC和移动设备上，兼容当前绝大部分浏览器（IE6/7/8/9 /10/11，chrome，firefox，Safari等），底层依赖轻量级的Canvas类库ZRender，提供直观，生动，可交互，可高度个性化定制的数据可视化图表。创新的拖拽重计算、数据视图、值域漫游等特性大大增强了用户体验，赋予了用户对数据进行挖掘、整合的能力。

支持折线图（区域图）、柱状图（条状图）、散点图（气泡图）、K线图、饼图（环形图）、雷达图（填充雷达 图）、和弦图、力导向布局图、地图、仪表盘、漏斗图、事件河流图等12类图表，同时提供标题，详情气泡、图例、值域、数据区域、时间轴、工具箱等7个可交 互组件，支持多图表、组件的联动和混搭展现。

2.SpeechSynthesisUtterance：  
SpeechSynthesisUtterance是HTML5中新增的API,用于将指定文字合成为对应的语音.也包含一些配置项,指定如何去阅读(语言,音量,音调)等基本属性

SpeechSynthesisUtterance.lang 获取并设置话语的语言  
SpeechSynthesisUtterance.pitch 获取并设置话语的音调(值越大越尖锐,越低越低沉)  
SpeechSynthesisUtterance.rate 获取并设置说话的速度(值越大语速越快,越小语速越慢)  
SpeechSynthesisUtterance.text 获取并设置说话时的文本  
SpeechSynthesisUtterance.voice 获取并设置说话的声音  
SpeechSynthesisUtterance.volume 获取并设置说话的音量  
SpeechSynthesisUtterance.text基本方法  

speak() 将对应的实例添加到语音队列中  
cancel() 删除队列中所有的语音.如果正在播放,则直接停止  
pause() 暂停语音  
resume() 恢复暂停的语音  
getVoices 获取支持的语言数组. 注意:必须添加在voiceschanged事件中才能生效  


## 四.项目状态  

 + 进行项目构建  
 + 进行编码改进  
 + 进行代码测试  
 
 
## 五.风险分析及解决办法  

风险分析：  
在实践需求过程中遇到一些之前理解不清的地方，需要落实  

解决办法：  
加强交流沟通，理解需求  

## 六.代码展示

语音播报：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
<div>
    <input type="text" id="audio">
    <input type="button" id="tts_btn" onclick="test()" value="播放">
</div>

<script type="text/javascript">
    var speechSU = new window.SpeechSynthesisUtterance();
    function test(){
        let msg = new SpeechSynthesisUtterance("欢迎来到黄金点游戏");
        console.log(msg)
        //msg.rate = 4 播放语速
        //msg.pitch = 10 音调高低
        //msg.text = "播放文本"
        //msg.volume = 0.5 播放音量
        speechSynthesis.speak(msg);

        // var speechSU = new window.SpeechSynthesisUtterance();
        // function test(){
        //     var text = document.getElementById(‘audio‘).value;
        //     speechSU.text = text;
        //     window.speechSynthesis.speak(speechSU);
    }
</script>

</body>
</html>
```
登陆界面：

```html
<body>
<!-- contact -->
<div class="contact" id="contact">
	<div class="container">
		<div class="about-heading">
			<h3>欢迎登录黄金点游戏</h3>
			<p>May the odds be ever in your favour.</p>
		</div>
		<div class="w3l-about-grids">
			<div class="contact-w3ls-row">
				<form action="index.html" method="post">
					<div class="col-md-7 col-sm-7 contact-left agileits-w3layouts" style="margin-left:20%">
						<input type="text" name="user_id" placeholder="请输入用户名" required="">
						<input class="email" name="Last Name" type="text" placeholder="请输入密码" required="">
						<input type="submit" value="SUBMIT">
					</div>
					<div class="clearfix"> </div>
				</form>
			</div>
		</div>
	</div>
</div>
```
## 七.界面展示

登陆界面：
![avatar](https://raw.githubusercontent.com/kkkcx/kkkcx.github.io/main/image/1.png)

玩家输入数据：
![avatar](https://raw.githubusercontent.com/kkkcx/kkkcx.github.io/main/image/2.png)

结果展示：
![avatar](https://raw.githubusercontent.com/kkkcx/kkkcx.github.io/main/image/3.png)



# 第14周周报
 13-14周的主要任务是完成系统最后的附加功能的实现以及系统的整体调试过程，其中包括语音提示信息以及可视化的实现和UI设计最后的修改部分以及运用人工智能的算法分析。由于大部分功能仍处于调试阶段，本周周报未能展示项目正在制作的全部内容

> ## <font color ="#AB0D00">语音提示信息</font>
>
> ```javascript
> $(function(){
>     $('#submit').click(function(event)
>     {
>         speak('亲爱的 请填写玩家数量欧');
>     });
> });//玩家数量语音提示
> 
> //创建游戏语音提示
> if(num == '')
> 		{
>           
>           speak('亲爱的 请填写玩家数量欧');
>           return false;
>         }
> 		else if(num>50)
> 		{
>          
>           speak('亲爱的 游戏玩家最多为50人！');
>           return false;
>         }
>         if(lun == '')
> 		{
>           
>           speak('亲爱的 填写游戏轮次！');
>           return false;
>         }
> 		else if(lun<2)
> 		{
>           
>           speak('亲爱的 游戏轮次最少为2轮！');
>           return false;
>         
>     }
> 
> 
> 
> //游戏轮数语音提示信息
>  speak('本轮游戏结束啦，进入下一轮游戏！');
> //游戏结束
> speak('本次游戏结束！ 下面我要公布结果了');
> //结果公布
> speak(winner+'请大家恭喜他');
>         speak(loser+'真是菜鸡');
>         speak('具体统计数据请大家查看统计表');
>         speak('谢谢大家 下次再见');
> 
> //speak函数定义及设置
> function speak(x){
>     var msg = new SpeechSynthesisUtterance(x);
>     // msg.text = document.getElementById("audio").value;
>     // console.log(msg)
>     msg.rate = 1.0 //播放语速
>     msg.pitch = 1.2 //音调高低
>     // msg.text = "播放文本"
>     msg.volume = 1 //播放音量
>     speechSynthesis.speak(msg);
> }
> ```
>
> 同时我们注意到在不同的设备和浏览器上存在语音可能无法正常播放的问题，所以本周的重要工作之一即是完成这一部分的调试工作

> ## <font color ="#AB0D00">结果可视化</font>
>
> ### 计算可视化数据
>
> ```javascript
> function count(array,num,lun){
>         var data = array;
>         let s = [];
>         //初始化数组
>         for(var a=1;a<=lun;a++){
>             s[a] = [];
>             for(var b=1;b<=num;b++){
>                 s[a][b] = 0;
>             }
>         }
>         var str = '<tr><td>&nbsp;</td>';
>         for(var a=1;a<=num;a++){
>           str += "<td>玩家"+a+"</td>";
>         }
>         str += "<td>总计</td><td>平均</td><td>G</td></tr>";
>         
>         for(var a=1;a<=lun;a++){
>             var sum = 0;
>             str += "<tr><td>第"+a+"轮</td>";
>             for(var b=1;b<=num;b++){
>                 sum  += parseInt(data[a][b]);
>                 //str += "<td>"+data[a][b]+"</td>";
>             }
>             var avg = sum/num;
>             var G = 0.618*avg;
>             //获取最大、最小
>             var max = Math.abs(data[a][1] - G);  
>             var min = Math.abs(data[a][1] - G);
>             for(var b=1;b<=num;b++)
> 			{
>               if(Math.abs(data[a][b] - G) >= max)
> 			  {
>                 max = Math.abs(data[a][b] - G);
>               }
>               if(Math.abs(data[a][b] - G) <=min)
> 			  {
>                 min = Math.abs(data[a][b] - G);
>               }
>             }
>             for(var b=1;b<=num;b++){
>               var score = 0;
>               var color = '';
>               if(Math.abs(data[a][b]-G) == max){
>                 score = -2;
>                 color = 'red';
>               }
>               if(Math.abs(data[a][b]-G) == min){
>                 score = num;
>                 color = 'red';
>               }  
>              
>               /*str += "<td>"+data[a][b]+"("+s+")"+score+","+max_index+","+min_index+"</td>";*/
>               s[a][b] = score;
>               str += "<td style='color:"+color+"'>"+data[a][b]+"("+score+")</td>";
>               
>             }
>             str += "<td>"+sum+"</td><td>"+avg+"</td><td>"+G+"</td></tr>";
>         }
>          // var res = [];
>         str += '<tr><td>计分</td>';
>         for(var b=1;b<=num;b++){
>           var sum = 0;
>           for(var a=1;a<=lun;a++){
>             sum  += parseInt(s[a][b]);
>           }
>           res[b] = sum;
>         }
>         var max_res = res[1];
>         var min_res = res[1];
>         for(var c=2;c<=num;c++){
>           if(res[c] > max_res){
>             max_res = res[c];
>           }
>           if(res[c] < min_res){
>             min_res = res[c];
>           }
>         }
>         var winner = '';
>         var loser = '';
>         for(var c=1;c<=num;c++){
>           var res_color = '';
>           if(res[c] == max_res){
>             res_color = 'red';
>             winner += '玩家'+c+',';
>           }
>           if(res[c] == min_res){
>             res_color = 'red';
>             loser += '玩家'+c+',';
>           }
>           str += "<td style='color:"+res_color+"'>"+res[c]+"</td>";
>         }
>         winner += '获胜<br>';
>         loser += '输了';
>  
>         str += "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
>         var col = parseInt(num)+3;
>         str += "<tr><td>结果</td><td style='color:#ff0000' colspan='"+col+"'>"+winner+loser+"</td></tr>";
>         $('#res').html(str);
>         speak(winner+'请大家恭喜他');
>         speak(loser+'真是菜鸡');
>         speak('具体统计数据请大家查看统计表');
>         speak('谢谢大家 下次再见');
>         return res;
>     }
> ```
>
> 
>
> ### 热力图数据处理
>
> ```javascript
>  function getmap(array,lun,num){
>         var datalist = array;
>         var datamap = [];
>         var data = [];
> 
>         //数组初始化
>         data[0]= [1,2,3,4,5,6,7,8,9];
>         for(var i=0;i<data[0].length;i++){
>             data[0][i] = 0;
>         }
>         for (var i=1;i<10;i++){
>             for (var j=0;j<10;j++){
>                 data[i][j] = 0;
>             }
>         }
>         for (var i=1;i<=lun;i++){
>             for (var j=1;j<=num;j++){
>                   datamap.push(datalist[i][j])
>             }
>         }
>         for (var i=1;i<=datamap.length;i++){
>              var decade = 0;
>              var unit = 0;
>              decade=datamap[i]/10;
>              unit = datamap[i]%10;
>              data[decade][unit]++;
>         }
>         return data;
>     }
> ```
>
> ### 得分饼状图实现
>
> ```javascript
> function Echarts(array,num,lun){
>         var myChart = echarts.init(document.getElementById('gamescore'));
>         var data=[];
>         for (var i=1;i<=num;i++){
>             data[i-1] = array[i];
>         }
> 
>         option = {
>             title: {
>                 text: '游戏得分',
>             },
>             tooltip: {
>                 trigger: 'axis',
>                 axisPointer: {
>                     type: 'shadow'
>                 }
>             },
>             legend: {
>                 data:''
>             },
>             grid: {
>                 left: '3%',
>                 right: '4%',
>                 bottom: '50%',
>                 containLabel: true
>             },
>             xAxis: {
>                 type: 'value',
>                 boundaryGap: false,//[0, 0.01]
>             },
>             yAxis: [{
>                 type: 'category',
>                 data: function(){
>                     var player=[];
>                     for (var i=0;i<num;i++){
>                         player.push('玩家'+(i+1));
>                     }
>                     return player;
>                 }()
> 
>             }],
>             series: [
>                 {
>                     type: 'bar',
>                     data: data
>                 },
>             ]
>         };
>         myChart.setOption(option,true);
>         charts.push(myChart);
>     };
> ```
>饼状图：
>![avatar](https://raw.githubusercontent.com/kkkcx/kkkcx.github.io/main/image/score_chart.png)
> 我们已经实现了饼状图得分统计的动态实现，之后我们会将热力图的制作完成，并依据既定的设计规划，将所有可视化内容实现并对UI进行美化
## 问题总结

1. 语音和可视化内容中调节出现问题
2. 深度学习算法分析接口和实际结果不理想
3. 调试时间过长导致项目进展低于预期

## 预计项目进度

1. 因为框架内容已全部修改完毕，所以预计项目仍可以在2020/12/04-05完成
2. 本周可实现项目剩下的基本内容
3. 由于新增的用户填写用户名注册页面已经初步完成，预计接口调用和调试将在两天内完成，项目整体功能实现已经趋于完善，所以项目整体实现结果仍可满足预期 
