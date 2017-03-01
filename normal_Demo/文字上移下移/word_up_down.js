$(document).ready(function(){
	$(".up").click(function(){ 
		$(this).parent("li").insertBefore($(this).parent("li").prev());
	})
	$(".down").click(function(){ 
		$(this).parent("li").insertAfter($(this).parent("li").next());
	})
})