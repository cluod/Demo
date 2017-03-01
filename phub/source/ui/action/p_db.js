Core.init(() => {
	let C = Core;
	let $ = C.$;
	let _require = C.require;
	let echarts = _require('echarts');
	let ip = [],
		txYun = [],
		alYun = [],
		inNet = [],
		stYun = [],
		zyYun = [];
		let timer = '';
		let opTimer = '';	
	$.ajax({
		type: "get",
		async: false,
		url: "https://zabbix.tianqi.cn/servers_status/default/cpu_mem2.json",
		success: function(res) {
			var data = res.data;
			var len = res.data.length;
			for (var i = 0; i < len; i++) {
				let x = data[i].ip;
				ip.push(data[i].ip)
				switch (x) {
					// txYun
					case '123.206.25.170':
						txYun.push(data[i]);
						break;
					case '123.206.44.81':
						txYun.push(data[i]);
						break;
					case '123.206.45.174':
						txYun.push(data[i]);
						break;
					case '182.254.135.221':
						txYun.push(data[i]);
						break;
					case '123.206.29.172':
						txYun.push(data[i]);
						break;
					case '123.206.17.251':
						txYun.push(data[i]);
						break;
					case '123.206.44.109':
						txYun.push(data[i]);
						break;
					case '123.206.20.215':
						txYun.push(data[i]);
						break;
					case '123.206.25.155':
						txYun.push(data[i]);
						break;
					case '123.206.50.97':
						txYun.push(data[i]);
						break;
					case '123.206.51.90':
						txYun.push(data[i]);
						break;
					case '123.206.24.203':
						txYun.push(data[i]);
						break;

						// alYun
					case '112.124.35.90':
						alYun.push(data[i]);
						break;
					case '218.244.147.83':
						alYun.push(data[i]);
						break;
					case '112.124.11.91':
						alYun.push(data[i]);
						break;
					case '115.29.161.191':
						alYun.push(data[i]);
						break;
					case '115.29.174.100':
						alYun.push(data[i]);
						break;
					case '115.29.190.33':
						alYun.push(data[i]);
						break;
					case '120.26.247.194':
						alYun.push(data[i]);
						break;
					case '120.26.11.91':
						alYun.push(data[i]);
						break;
					case '112.124.16.201':
						alYun.push(data[i]);
						break;
					case '112.124.34.76':
						alYun.push(data[i]);
						break;
					case '120.26.106.108':
						alYun.push(data[i]);
						break;
					case '121.40.115.81':
						alYun.push(data[i]);
						break;

						// strom
					case '61.4.186.48':
						stYun.push(data[i]);
						break;
					case '61.4.186.49':
						stYun.push(data[i]);
						break;
					case '61.4.186.50':
						stYun.push(data[i]);
						break;
					case '61.4.186.51':
						stYun.push(data[i]);
						break;
					case '61.4.186.52':
						stYun.push(data[i]);
						break;
					case '61.4.186.53':
						stYun.push(data[i]);
						break;
					case '61.4.186.54':
						stYun.push(data[i]);
						break;
					case '61.4.186.55':
						stYun.push(data[i]);
						break;
					case '61.4.186.56':
						stYun.push(data[i]);
						break;
					case '61.4.186.57':
						stYun.push(data[i]);
						break;

						// inNet
					case '10.16.58.101':
						inNet.push(data[i]);
						break;
					case '10.16.58.102':
						inNet.push(data[i]);
						break;
					case '10.16.58.103':
						inNet.push(data[i]);
						break;
					case '10.16.58.104':
						inNet.push(data[i]);
						break;
					case '10.16.58.106':
						inNet.push(data[i]);
						break;
					case '10.16.58.113':
						inNet.push(data[i]);
						break;
					case '10.16.58.116':
						inNet.push(data[i]);
						break;
					case '10.16.58.117':
						inNet.push(data[i]);
						break;
					case '10.16.58.118':
						inNet.push(data[i]);
						break;

						// zyYun
					case '61.4.184.171':
						zyYun.push(data[i]);
						break;
					case '211.99.240.6':
						zyYun.push(data[i]);
						break;
					case '61.4.184.172':
						zyYun.push(data[i]);
						break;
					case '211.99.240.5':
						zyYun.push(data[i]);
						break;
					case '61.4.184.122':
						zyYun.push(data[i]);
						break;
					case '61.4.184.123':
						zyYun.push(data[i]);
						break;
					case '61.4.184.124':
						zyYun.push(data[i]);
						break;
					case '61.4.184.150':
						zyYun.push(data[i]);
						break;
					case '61.4.184.151':
						zyYun.push(data[i]);
						break;
					case '61.4.184.173':
						zyYun.push(data[i]);
						break;
					case '61.4.184.174':
						zyYun.push(data[i]);
						break;
					case '61.4.184.177':
						zyYun.push(data[i]);
						break;
					case '61.4.184.32':
						zyYun.push(data[i]);
						break;
					case '61.4.184.33':
						zyYun.push(data[i]);
						break;
					case '61.4.184.61':
						zyYun.push(data[i]);
						break;
					case '61.4.184.62':
						zyYun.push(data[i]);
						break;
					case '211.99.240.4':
						zyYun.push(data[i]);
						break;
					case '61.4.184.181':
						zyYun.push(data[i]);
						break;
					case '211.99.240.2':
						zyYun.push(data[i]);
						break;
					case '211.99.240.3':
						zyYun.push(data[i]);
						break;
					case '61.4.184.210':
						zyYun.push(data[i]);
						break;
					case '61.4.184.211':
						zyYun.push(data[i]);
						break;
					case '61.4.184.212':
						zyYun.push(data[i]);
						break;
					case '61.4.184.34':
						zyYun.push(data[i]);
						break;
					case '61.4.184.29':
						zyYun.push(data[i]);
						break;
					case '61.4.184.31':
						zyYun.push(data[i]);
						break;
					case '61.4.184.185':
						zyYun.push(data[i]);
						break;
					case '211.99.240.7':
						zyYun.push(data[i]);
						break;
					case '61.4.184.180':
						zyYun.push(data[i]);
						break;
					case '61.4.184.175':
						zyYun.push(data[i]);
						break;
					case '61.4.184.186':
						zyYun.push(data[i]);
						break;
					case '61.4.185.122':
						zyYun.push(data[i]);
						break;
					case '61.4.184.184':
						zyYun.push(data[i]);
						break;
					case '61.4.184.187':
						zyYun.push(data[i]);
						break;
				}
			}

		}
	})
	$(".net").click(function() {
		$(".info").css("display",'none');
		clearInterval(timer);
		$(".net").find(".sm_line").css("display", "none");
		$(".net").find(".eff").css("opacity", "0");
		$(this).find(".eff").css("opacity", "1");
		var txt = $(this).find("p:first").text();
		$(this).find(".sm_line").css("display", "block");
		let le = $(this).offset().left + 80;
		let to = $(this).offset().top;
		let _index = $(this).index();
		$(".info").css({
			"left": le,
			"top": to,
		})
		$(".info").fadeIn(800);
		let flag = $(this).parent().hasClass("in_net");

		if ($(this).parent().hasClass("in_net")) {
			justDb(inNet, txt)
			if (_index == 4 || _index == 8) {
				$(".info").css({
					"left": le - $(".info").width() - 100,
					"top": to

				})
			}

		}
		if ($(this).parent().hasClass("st")) {
			justDb(stYun, txt)
			if (_index == 3 || _index == 4 || _index == 8 || _index == 9) {
				$(".info").css({
					"left": le - $(".info").width() - 100,
					"top": to

				})
			}

		}
		if ($(this).parent().hasClass("zy")) {
			justDb(zyYun, txt)
			if (_index == 11 || _index == 14 || _index == 16 || _index == 15 || _index == 21 || _index == 22 || _index == 30 || _index == 31 || _index == 32 || _index == 33) {
				$(".info").css({
					"left": le,
					"top": to - 100

				})
			}

		}
		if ($(this).parent().hasClass("tx_yun")) {
			justDb(txYun, txt)
		}
		if ($(this).parent().hasClass("al_yun")) {
			justDb(alYun, txt)
		}
	})
	function radomShow() {
		$(".info").css("display","none");
		let bNum = parseInt(Math.random() * 4);
		let len = document.getElementsByClassName("rad")[bNum].getElementsByClassName("net").length;
		let sNum = parseInt(Math.random() * len);
		let a =  document.getElementsByClassName("rad")[bNum].getElementsByClassName("net")[sNum];
		let $a = $(a);
		let b = document.getElementsByClassName("rad")[bNum];
		let $b = $(b);
		let _txt = $a.find("p:first").text();
		let thisIndex = $a.index();
		let le = $a.offset().left + 80;
		let to = $a.offset().top;
		$(".net").find(".sm_line").css("display", "none");
		$a.find(".sm_line").css("display", "block");
		$(".net").find(".eff").css("opacity", "0");
		$a.find(".eff").css("opacity", "1");
		$(".info").css({
			"left": le,
			"top": to
		})
		$(".info").fadeIn(800);
		if ($b.hasClass("in_net")) {
			justDb(inNet, _txt)
			if (thisIndex == 4 || thisIndex == 8) {
				$(".info").css({
					"left": le - $(".info").width() - 100,
					"top": to
				})
			}

		}
		if ($b.hasClass("st")) {
			justDb(stYun, _txt)
			if (thisIndex == 3 || thisIndex == 4 || thisIndex == 8 || thisIndex == 9) {
				$(".info").css({
					"left": le - $(".info").width() - 100,
					"top": to
				})
			}

		}
		if ($b.hasClass("zy")) {

			justDb(zyYun, _txt)
			if (thisIndex == 11 || thisIndex == 14 || thisIndex == 16 || thisIndex == 15 || thisIndex == 21 || thisIndex == 22 || thisIndex == 30 || thisIndex == 31 || thisIndex == 32 || thisIndex == 33) {
				$(".info").css({
					"left": le,
					"top": to - 100
				})
			}

		}
		if ($b.hasClass("tx_yun")) {
			justDb(txYun, _txt)
		}
		if ($b.hasClass("al_yun")) {
			justDb(alYun, _txt)
		}
	}
	function justDb(arr, txt) {
		let num = 0;
		let len = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i].ip == txt) {
				num = i;
			}
		}
		var order = arr[num].order.reverse();
		var orLen = order.length;
		var dataX=[],dataY=[];
		for(var i=0;i<orLen;i++){
			dataX.push(order[i].t.split(" ")[1].split(":")[0]+":"+order[i].t.split(" ")[1].split(":")[1])
			dataY.push(order[i].mu)
		}
		chartRendar(dataX,dataY);
		var nc_yl = arr[num].order[0].mt - arr[num].order[0].ma;
		$(".db_ip").text("服务器IP:" + arr[num].ip);
		$(".syl_rate").css("width", arr[num].order[0].cu+"%");
		$(".ip_syl_txt").html(arr[num].order[0].cu+"%");
		$(".nc_rate").css("width", arr[num].order[0].mu+"%");
		$(".nc_syl_txt").html(arr[num].order[0].mu+"%");
		$(".nc_yl").text("内存使用量：" +Math.floor(nc_yl * 100) / 100   + "G");
		$(".nc_zl").text("内存总量:" + arr[num].order[0].mt + "G");
		$(".ph_fz").text("平衡负载：" + arr[num].order[0].l5);
		
	}
	function showfade(){
		$(".rad").removeClass('oj');
		let run_num = parseInt(Math.random() * 4);
		let _oj =  document.getElementsByClassName("rad")[run_num];
		let $_oj = $(_oj);
		$_oj.addClass('oj');
	}
	function chartRendar(dataX,dataY){
		var chart = echarts.init($("#chart")[0]);
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			// legend: {
			// 	data: ['空气质量', '逐小时', '预警', 'aqi', '3小时'],
			// 	icon: 'bar',
			// 	textStyle: {
			// 		color: "white",
			// 		fontSize: 10
			// 	}

			// },
			// grid: {
			// 	left: '3%',
			// 	right: '4%',
			// 	bottom: '3%',
			// 	containLabel: true
			// },
			xAxis: [{
				type: 'category',
				splitLine: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: "white"
					}
				},
				boundaryGap: false,
				// data:["1:01","2:02","3:03","4:04","5:05","6:06","7:07","8:08","9:09","10:10","11:11","12:12"]
				data:dataX
			}],
			yAxis: [{
				type: 'value',
				min: 0,
				max: 100,
				// axisLine:{
				// 	show:false
				// },
				// axisTick:{
				// 	show:false
				// },
				// splitLine: {
				// 	show: false
				// },
				axisLabel: {
					// show:false,
					textStyle: {
						color: "white"
					}
				},
				splitLine: {
					show: false
				},
			}],
			series: [{
				name: '内存使用率',
				type: 'line',
				stack: '总量',
				data: dataY
			}]
		};
		chart.setOption(option)
	}
	showfade();
	timer = setInterval(radomShow,5000);
	opTimer = setInterval(showfade,4000);
})