$(document).ready(function(){
	$(".next").click(function(){
		$(this).parent("section").animate({"left":"-100%"},1000);
		$(this).parent("section").next("section").animate({"left":"0%"});
	});
	$(".prev").click(function(){
		$(this).parent("section").animate({"left":"+100%"},1000);
		$(this).parent("section").prev("section").animate({"left":"0%"});
	});
})