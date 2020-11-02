
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
        // $('#res').html('');
        num = $('#num').val();
        lun = $('#lun').val();
        if(num == '')
		{
          alert('请填写玩家的数量！');
          return false;
        }
		else if(num>50)
		{
          alert('游戏玩家最多为50人！');
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
          alert('玩家最多为50人！');
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
        //随机产生数字
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
          alert('请输入0~100之间的有理数,不包括0或100');
          return false;
        }
        data[i][j] = val;
        $('input[name=val]').val('');
        j++;
        if(j>num)
		{
          alert('本轮游戏结束，进入下一轮游戏！');
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
                sum  += parseInt(data[a][b]);
                //str += "<td>"+data[a][b]+"</td>";
            }
            var avg = sum/num;
            var G = 0.618*avg;
            //获取最大、最小
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
            sum  += parseInt(s[a][b]);
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