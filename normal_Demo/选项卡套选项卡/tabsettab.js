$(document).ready(function(){
	var _index = 0;
	$(".nav ul li").click(function(){
		_index = $(this).index();
		$(this).addClass('active').siblings('').removeClass("active");
		$(".text .soso-txt").eq(_index).fadeIn(500).siblings().fadeOut(500);
	})
	$(".soso-txt-nav ul li ").click(function(){
		_index = $(this).index();
		$(this).addClass('select').siblings('').removeClass("select");
        $(this).parent().parent().siblings().children('').eq(_index).fadeIn(500).siblings('').fadeOut();

	})
})