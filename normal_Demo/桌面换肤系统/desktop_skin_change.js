$(document).ready(function(){
	document.oncontextmenu = function(){  //禁用浏览器右键的默认功能
		return false ;
	}
	$(document).mousedown(function(e){
       var key = e.which;
       if(key==3){     //判断是鼠标哪个按键点击了 1左，2中，3右
       	var _left =e.pageX;
       var _top = e.pageY;
       	$(".box").show();
       	$(".box").css({
           "left":_left,
           "top":_top
       	})
       }
	});
	$(document).click(function(){
			$(".box").hide();
	});
	$(".box ul li").hover(function(){
		$(this).addClass("hover").siblings('').removeClass("hover");
	})
	$(".box ul li").click(function(){
		var _this =$(this).index();
		if(_this == 3){
			$(".box_chose").show();
		}
	})
	
	$(".box_chose ul li").click(function(){
		var imgurl =$(this).attr("deta");  //页面自定义属性deta
		$("body").css("background","url('images/"+imgurl+"')");
	});
})