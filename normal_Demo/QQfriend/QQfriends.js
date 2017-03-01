$(document).ready(function() {
	$("h1").click(function() {
if($(this).hasClass('h_bg')){
	$(this).removeClass("h_bg").next("ul").removeClass("listshow");

}else{
		$(this).next("ul").addClass("listshow").parent("li").siblings().children("ul").removeClass('listshow');
		$(this).addClass("h_bg").parent("li").siblings().children('h1').removeClass('h_bg');

	}
	});
	$(".list_ul li").click(function(){
$(this).addClass("list_li").siblings('li').removeClass("list_li");
	})
})