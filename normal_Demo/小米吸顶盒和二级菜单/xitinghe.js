$(document).ready(function(){
	$(".nav ul li.thediff").hover(function(){
		$(".second_nav").slideDown();
	},function(){
		$(".second_nav").slideUp();
	})
	$(window).scroll(function(){
		if($(this).scrollTop()>200)
		{
		$(".nav").addClass('nav_position');	
		}else{
			$(".nav").removeClass('nav_position');	
		}
	});
})