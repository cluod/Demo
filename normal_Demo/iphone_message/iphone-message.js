$(document).ready(function() {
	var tag = true;
	var input_text = '';

	
	$(".tag").click(function() {
		if (tag) {
			$(this).attr("src", "images/green.png");
			tag = false;
		} else {
			$(this).attr("src", "images/black.png");
			tag = true;
		}
	})
	$(".send").click(function() {
    input_text = $(".input_word").val();
    var str = '<div class="one">' +
		'<img src="images/black.png" class="one_pic">' +
		'<span class="blackword">' + input_text + '</span></div>'
	var str1 = '<div class="two">' +
		'<span class="greenword">' + input_text + '</span>' +
		'<img src="images/green.png" class="one_pic">'
		if (tag) {
			$(".mess_body").prepend(str);
			input_text = '';
		} else {
			$(".mess_body").prepend(str1);
			input_text = '';
		}
	})
})