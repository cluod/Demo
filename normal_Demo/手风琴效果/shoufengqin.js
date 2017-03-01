$(document).ready(function(){
	$("ul li").mouseenter(function(){
		$(this).stop().animate({"width":"538"}, 500);
		$(this).siblings('li').stop().animate({"width":"106"},500)
	})
	$("ul li").mouseleave(function(){
		$(this).stop().animate({"width":"538"}, 500);
})
})