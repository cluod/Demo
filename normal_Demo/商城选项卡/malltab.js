$(document).ready(function() {
	var _index = 0;
	$(".left ul li").hover(function() {
		$(this).addClass('active').siblings('').removeClass('active');
		$(this).children("img").addClass("now").end().siblings('').children("img").removeClass('now');
		// end()方法解决jq链式操作过长断链，回到当前对象
		_index = $(this).index();
		$(".right ul").eq(_index).addClass("now").siblings().removeClass("now");
	})
})