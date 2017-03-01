$(document).ready(function() {
	$("img").lazyload({
		placeholder: "images/lazyload.png",
		event: "scroll",    //通过什么事件图片才会加载出来
		effect: "slideDown" // 图片出来的效果
	});

})