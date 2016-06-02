window.onload=function(){
	var cxdUtil={
		//ajax 函数
		ajax: function(method,url,data,fnsucc){
			var xhr=null;
			if(window.XMLHttpRequest){
				xhr=new XMLHttpRequest();
			}
			else{
				xhr=new ActiveXObject('microsoft.XMLHTTP') //IE6
			}
			if(method=='GET'){
				xhr.open('GET',url+'?'+data,true);
				xhr.send();
			}
			else{
				xhr.open('POST',url,true);
				xhr.setRequestHeader('Content-type','application/x-www-form-urlencoder');
				xhr.send(data);
			}
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4&&xhr.status==200){
					fnsucc(xhr.responseText)
				}
			}
		},
    //获取ajax中的数据参数
    getData: function(a, b, c){
    return "pageNo="+a+"&psize="+b+"&type="+c;//依据约定的ajax处理数据参数
    },
		//绑定事件函数
		addHandler: function(element,type,handler){
			if(element.addEventListener){
				element.addEventListener(type,handler,false);
			} else if(element.attachEvent){
				element.attachEvent("on"+type,handler)
			}else{
				element["on"+type]=handler;
			}			
		},
		//事件event对象/目标获取
		getEvent: function(event){
			return event ? event : window.event
		},
		getTarget:function(event){
			return event.target || event.srcElement; //srcElement兼容ie
		},
		//cookie的获取和设置函数
		getCookie: function(name){
			var arr=document.cookie.split("; ");
			for (var i = 0; i < arr.length; i++) {
				var arr2=arr[i].split("=");
				if(arr2[0]==name){
					return arr2[1]
				}
			}
		},
		setCookie: function(name,value,day){
			var odate=new date();
			odate.setDate(odate.getDate()+day)
			document.cookie=name+'='+value+';empire='+odate;
		},
		removeCookie: function(name){
      MainCookie.setCookie(name,'',-1);
    },
    getlogin: function(a, b){return "userName="+a+"&password="+b;},
		//运动函数
		//@param json为一个json对象，里面包含运动的类型
		starMove: function(obj,json,fnEnd,interval){
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				for(var name in json){
					var cur=parseInt(cxdUtil.getStyle(obj,name))
					if(name=="opacity"){
					var	cur=Math.round(parseFloat(cxdUtil.getStyle(obj,name))*100);//当前运动到哪一步
					}
					var speed=(json[name]-cur)/interval;//运动速度
					speed=speed<0?Math.floor(speed):Math.ceil(speed);// 如果速度大于0,则speed向上取整，否则向下取整，避免运动无法完成
            if(cur==json[name]){
            	clearInterval(obj.timer);
            	if(fnEnd)fuEnd();
            }else{
            	if(name=="opacity"){
            		obj.style.opacity=(cur+speed)/100;
            		obj.style.filter='alpha(opacity:'+cur+speed+')';
            	}else{
            		obj.style[name]=cur+speed+'px';
            	}
            }
				}
			}, 30);
		},
		//获取样式
		getStyle: function(obj, name){
			if(obj.currentStyle){
				return obj.currentStyle[name];
			}else{
				return getComputedStyle(obj, false)[name];
			}             
		},
		//获取classname
		getElementsByClass: function(className, target){
			if(document.getElementsByClassName){
				return target.getElementsByClassName(className)
			}else{
				var classn=[],
				element=target||document,
				obj=element.getElementsByTagName("*");
				for (var i = 0; i < obj.length; i++) {
					if(obj[i].className==className){
						classn.push(obj[i]);
					}
				}
				return classn
			}
		},
      //节流函数，防止页面尺寸变动时一直不停触发事件导致性能下降
    throttle: function(method, context){
      clearTimeout(method.tId) ;
      method.tId=setTimeout(function(){
      method.call(context);
      }, 100)   
    }
	}
  var oDiv= document.getElementById("clEnd"),//获取课程列表的盒子
  hot=document.getElementById('hot'),//获取最热排行
  pageNo=document.getElementById('page'),//获取页码
  cont=document.getElementById('content'),//编程语言和产品设计的父元素
  pageNow=1,//当前页码
  totalPage,//声明一个总页码变量
  type=10,//初始化发送给ajax中的数据
  pageSize,   //课程区接受的内容个数
  page=pageNo.getElementsByTagName('li'),  //获取页码中所有li标签
  pageL=page.length-1;   //取得page的长度-1，用于循环及后面计算
 
  //课程盒子函数
  function contList(response){
    totalPage=JSON.parse(response).totalPage;
  	var response=JSON.parse(response).list,
  	inser="";
  	oDiv.innerHTML="";
    //获取ajax返回的总页码为全局变量中的pageNow赋值
  	for (var i = 0; i < response.length; i++) {
  	var newBox=document.createElement("div");
  	newBox.className="clbox";
  	inser="<div class='smallbox'>"+
 			"<a href="+response[i].providerLink+">"+
 			"<img src="+response[i].middlePhotoUrl+">"+"</a>"+
			"<h2>"+response[i].name+"</h2>"+
			"<span>"+response[i].provider+"</span>"+
			"<div>"+"<img src=image/icon/peopleIcon.png>"+
			"<span>"+response[i].learnerCount+"</span>"+"</div>"+
			"<P>￥"+response[i].price+"</P>"+"</div>"
	newBox.innerHTML=inser;
	oDiv.appendChild(newBox);
    }
     // 绑定课程表移入移除时间
    var box=cxdUtil.getElementsByClass("clbox", oDiv);
    for (var i = 0; i < box.length; i++) {
      box[i].index=i;
      box[i].onmouseenter=function(){                     
      var inHTML=document.createElement('div');
      inHTML.className="bigbox";
      inHTML.innerHTML="<a href="+response[this.index].providerLink+">"+"<img src="+response[this.index].middlePhotoUrl+">"+
                   "</a>"+
                   "<div class='right'>"+
                   "<h2>"+response[this.index].name+"</h2>"+
                   "<div>"+"<img src='image/icon/peopleIcon.png'>"+"<span>"+response[this.index].learnerCount+
                   "</span>"+"</div>"+
                   "<span>"+response[this.index].provider+"</span>"+
                   "<P>"+response[this.index].categoryName+"</P>"+"</div>"+
                   "<div class='scrip'>"+"<P>"+response[this.index].description+"</P>"+
                   "</div>";
      this.appendChild(inHTML);
      }
      box[i].onmouseleave=function(){
      this.removeChild(this.lastChild)
      }
    }  
    box=null;//移除掉引用
  }
  // 右侧滚动最热排行榜
  function hotList(HotList){
    var HotList=JSON.parse(HotList);
    var list="";
    for (var i = 0; i < HotList.length; i++) {
        list="<a href="+HotList[i].providerLink+">"+
                "<img src="+HotList[i].smallPhotoUrl+">"+
                "<P>"+HotList[i].name+"</P>"+
                "<div><img src='image/icon/peopleIcon.png'>"+"<span>"+HotList[i].learnerCount+"</span>"+
                "</div>"+
              "</a>";
        var oDiv=document.createElement('div');
        oDiv.className="hotBox";
        oDiv.innerHTML=list;
        hot.appendChild(oDiv);
    }
    hotMove();
  }
 // 最热排行滚动函数
  function hotMove(){
    var pos=0;
    setInterval(function(){ 
      if(pos==21){  //当经过20次位置变化的时候将pos变成0，让滚动能重新循环一次上下滚动
          pos=0;
      }
      if (pos>10) {  
          cxdUtil.starMove(hot, {top:-70*(20-pos)},null,6);  //当pos大于10的时候说明滚动到底了，这时候需要往回滚动
          pos++;
      }else{
          cxdUtil.starMove(hot,{top:-70*pos},null,6);
          pos++;
      }
    }, 2000)
  }
  // 页码变化代码
  cxdUtil.addHandler(pageNo,"click",function(event){  //绑定页码点击事件
    var event=cxdUtil.getEvent(event),  //获得事件对象
    target=cxdUtil.getTarget(event),  //获得时间目标
    targetInner=target.innerHTML;   //获取li元素中的文本
    pageChange(targetInner);   //执行页码变换函数并传入参数
  })
  //绑定前一页函数
  page[0].onclick=function(){
    if(pageNow==1){
      return
    }else{
      var back=pageNow-1;
      pageChange(back);
    }
  }
  //下一页函数
  page[pageL].onclick=function(){
    if(pageNow==totalPage){
      return
    }else{
      var forward=pageNow+1;
      pageChange(forward);
    }
  };
  //课程表为产品设计还是编程语言的选择  前一个函数申明不能没有分号结尾，否则下面这个自执行函数会出错
  (function(){
    var onc=cont.getElementsByTagName('div');
    var name='onc';
    for (var i = 0, l=onc.length; i < l; i++) {
      onc[i].index=i;
      onc[i].onclick=function(){
        if (this.className==name) {return}
        else {
          onc[1].className="";
          onc[0].className="";
          if (this.index==0) {type=10;}
          else{type=20;};  
          this.className=name;
          pageNow=2;   //需要将当前页的数值修改为除1外的数字
          pageChange(1);  //在pageNow不等于一的时候传入1作为参数，让pageChange函数进行一个判断，避免传入参数和pageNow都为1直接返回；
        }
      }
    }
  })()
  //进行ajax具体数据发送
  function chooseAjax(pageNow){
    if(document.documentElement.clientWidth >=1205){
      pageSize=20;
      cxdUtil.ajax("GET", "http://study.163.com/webDev/couresByCategory.htm", cxdUtil.getData(pageNow, pageSize, type), contList)
    }else{
      pageSize=15;
      cxdUtil.ajax("GET", "http://study.163.com/webDev/couresByCategory.htm", cxdUtil.getData(pageNow, pageSize, type), contList)
    }
  }
  //页码变换函数
  function pageChange(targetInner){
    if(targetInner==pageNow){   //利用等号隐式转换先判断当前点击的页码是否已经处于选中状态，是的话返回
      return;
    }
    if(!isNaN(targetInner)){   //判断所点击的li元素内容是否为数字，如果是则执行下面代码
      pageNow=parseInt(targetInner);    //为pageNow赋值为点击的页码,targetInner的取值为字符串，为了保证计算无误，需要用parseInt进行显示转换
      halfPage=Math.ceil((pageL-1)/2)   //page的length-2再除以2，并向上取整，用于后续计算
      for (var i = 1, l=pageL; i < l; i++) {   //开一个循环，循环次数为page.length-2，为的是只作用于li中的数字部分，两头表示上一页和下一页的li元素不参与其中
        page[i].className="";   //清空循环中li的className
        if(pageNow>=halfPage&&pageNow<=totalPage-halfPage){ 
          page[i].innerHTML=pageNow-halfPage+i;   //当totalPage为28，halfPage为4时，pageNow大于等于4或者小于等于24，则让li中的数值以pageNow-4开始排到pageNow+8
          page[halfPage].className="current";   //将第5个li元素的class变成当前选中的状态，并且li中的数字为选中的数字
        }else{
          if(pageNow<halfPage){   
            page[i].innerHTML=i;   //当小于halfPage时，li中的数字为1～8
            page[pageNow].className="current";
          }
          if(pageNow>totalPage-halfPage){
            page[i].innerHTML=totalPage-l+1+i;   //当大于24时，li中数字为21～28
            page[pageNow-totalPage+l-1].className="current";
          }
        }
      }
      if(pageNow==1){   //当pageNow为1时，取消前一页按钮的样式
        page[0].className="";
        page[pageL].className="direct";
      }else if (pageNow==totalPage) {  //当前页为最后一页时，取消下一页的样式
        page[pageL].className="";
        page[0].className="direct";
      }else{
        page[pageL].className="direct";
        page[0].className="direct";
      }
    }
    chooseAjax(pageNow);
  }
  //页面第一次加载执行左侧课程列表的ajax函数以获得数据
  chooseAjax(1);
  //执行内容区右侧最热排行榜的ajax函数以获得数据
  cxdUtil.ajax("GET", "http://study.163.com/webDev/hotcouresByCategory.htm", "",hotList);
  //导航条的关闭
  var aSpan=cxdUtil.getElementsByClass('header-right', document)[0],
  direct=cxdUtil.getElementsByClass('header-m', document)[0],
  close=aSpan.getElementsByTagName('img')[0];
  close.onclick=function(){   //绑定导航条的关闭按钮函数
    direct.style.display='none';
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+1)  
    document.cookie='close=1;expires='+oDate;  //设置cookie，有效期为一天
  }
  //页面加载完成后，判断是否已设置取消导航条
  var ifClose=cxdUtil.getCookie('close');
  if(ifClose==1){ direct.style.display='none';}
  // 点击关注和取消的事件
  var focus=cxdUtil.getElementsByClass('act-icon', document)[0],
  cancer=cxdUtil.getElementsByClass('cancer', document)[0];
  cancer.onclick=function(){   //取消关注函数
    actedIcon.style.display='none';
    actIcon.style.background='#21a557';
    onfocus=1;
  }
  focus.onclick=function(){
    if (onfocus==1){loginPopup()};
  }
    // 登录框弹出
  var loginBox=document.getElementById('login'),
  login=loginBox.getElementsByTagName('button')[0],
  userName=loginBox.getElementsByTagName('input')[0],
  passWord=loginBox.getElementsByTagName('input')[1],
  loginc=loginBox.getElementsByTagName('span')[0],
  mask=document.getElementById('mask'),
  actIcon=cxdUtil.getElementsByClass('act-icon', document)[0],
  actedIcon=cxdUtil.getElementsByClass('acted-icon', document)[0],
  onfocus=1;
  function loginPopup(){   //将登录框弹出
    mask.style.display='block';
    loginBox.style.display='block';
  }
  loginc.onclick=loginClose;
  login.onclick=function(){
    cxdUtil.ajax("GET", "http://study.163.com/webDev/login.htm", cxdUtil.getlogin(hex_md5(userName.value), hex_md5(passWord.value)), checklogin);//对账户和密码加密
  }
  function checklogin(response){  //检查服务器返回值是否为1
    if (response==1) {
     loginClose();
     loginSucc();
    }
    else{
     alert("登录失败");
     passWord.value="";
    }
  }
  function loginClose(){   //登录框关闭按钮
    mask.style.display="none";
    loginBox.style.display="none";
  }
  function loginSucc(){  //登录成功
    passWord.value="";
    actedIcon.style.display="block";
    actIcon.style.background="#2fb556";
    onfocus=null;
  }
  //当浏览器大小发生变化是，改变其中的内容
  cxdUtil.addHandler(window, "resize", function(){
    cxdUtil.throttle(sizeChange)
  });
  //页面变化函数
  function sizeChange(){
    if (pageSize==15&&document.documentElement.clientWidth >=1205) {
      chooseAjax(pageNow)
    }else if(pageSize==20&&document.documentElement.clientWidth <1205)
      chooseAjax(pageNow)
  }
  //弹出右侧机构视频
  var playBtn=cxdUtil.getElementsByClass("play", document.getElementById("con-right"))[0],
  videoPlay=document.getElementById("videoPlay"),
  closePlay=document.getElementById("closePlay");
  cxdUtil.addHandler(playBtn, "click", videoPopup);
  function videoPopup(){  //弹出视频窗口
    mask.style.display="block";
    videoPlay.style.display="block";
  }
  cxdUtil.addHandler(closePlay, "click", videoClose);  //关闭视频窗口
  function videoClose(){
    mask.style.display="none";
    videoPlay.style.display="none";
  }
  //轮播图
  var moveImage=document.getElementById("image-move").getElementsByTagName("img"),
  buttons=document.getElementById("buttons"),
  aLi=buttons.getElementsByTagName("li"),
  nowIndex=0,
  current=0;
  for (var i = 0 ,l=aLi.length; i < l; i++) {
    aLi[i].index=i;
  };
  cxdUtil.addHandler(buttons, "click", function(event){
    var event=cxdUtil.getEvent(event),
    target=cxdUtil.getTarget(event);
    if (target.nodeName=="LI") {
    iMove(target.index);
    };
  });
  function iMove(target){
    if(target==nowIndex){
      return
    }else{
      nowIndex=target;
      for (var i = 0 ,l=moveImage.length; i < l; i++) {
        moveImage[i].style.display="none";
        aLi[i].className="";
      };
      var imagNow=moveImage[nowIndex];
      imagNow.style.display="block";
      imagNow.style.opacity=0;
      imagNow.style.filter="alpha(opacity:0)";
      aLi[nowIndex].className="on";
      cxdUtil.starMove(imagNow, {opacity:100},null,20)
    }
  }
  function auto(){
    var target=(++current%3);
    iMove(target);
  }
  var imageT=setInterval(auto, 3500),
  moveImageMask=document.getElementById("header-ci");
  cxdUtil.addHandler(moveImageMask, "mouseover", function(){
    clearInterval(imageT);
  });
  cxdUtil.addHandler(moveImageMask, "mouseout", function(){
    imageT=setInterval(auto,3500);
  });
}
