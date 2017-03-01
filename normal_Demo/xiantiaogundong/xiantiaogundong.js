$(document).ready(function() {
	var t1, t2;
	$(".card").hover(function() {
		$(".line1,.line4").show();
		$(".line1").animate({
			"left": '+0px',
			"width": '+300px'
		}, 300);
		$(".line4").animate({
			"width": '+400px'
		}, 300);
		t1 = setTimeout(function() {
			$(".line2,.line5").show();
			$(".line2").animate({
				"height": '+300px'
			}, 300);
			$(".line5").animate({
				"height": '+300px'
			}, 300);

		}, 200)
		t2 = setTimeout(function() {
			$(".line3,.line6").show();
			$(".line3").animate({
				"width": '+300px'
			}, 400);
			$(".line6").animate({
				"width": '+400px'
			}, 400);

		}, 700)

	}, function() {
		$(".line1").animate({
			"left": '+299px',
			"width": '+0px'
		});
		$(".line2").animate({
			"height": '+0px'
		});
		$(".line3").animate({
			"width": '+0px'
		});
		$(".line4").animate({
			"width": '+0px'
		});
		$(".line5").animate({
			"height": '+0px'
		});
		$(".line6").animate({
			"width": '+0px'
		});
	})
})