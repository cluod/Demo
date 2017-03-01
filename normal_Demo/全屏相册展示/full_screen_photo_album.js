$(document).ready(function() {
	var flag = false
	$(".sc").mousedown(function(e) {

		var x = e.clientX; //鼠标距左距离
		var c_left = $(".car").offset().left; //红色滑动条到左边距离
		var sc_left = $(this).offset().left;//滑动按钮到左边距离
		var lon = x - sc_left;//鼠标当前位置减去滑动按钮距左位置，得到鼠标当前点距滑动按钮左侧距离
		var w = $(".car").width() - $(this).width(); //滑动条宽减去按钮宽度，得到滑动条可滑动总的范围宽
		$(document).mousemove(function(e) {
			var n_x = e.clientX;
			var n_left = n_x - c_left - lon;//得到滑动条已华东的距离
			if (n_left<0) {
				n_left = 0;
			} else if (n_left > w) {
				n_left = w;
			}
			$(".sc").css("left", n_left);
			var bl = n_left/w ; //定义一个比例。滑动条滑动距离占可滑动区域总宽度的比列
		    var n_width= 5*$(window).width()*bl;
			$("ul").css("left",-n_width);
		})
		$(document).mouseup(function(e) {
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");

		})
		return false;
	});
})