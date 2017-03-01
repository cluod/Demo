Core.init(() => {
	let C = Core;
	let $ = C.$;
	let _require = C.require;
	let echarts = _require('echarts');
	let dataTool = _require('dataTool');
	var chart_Arr = [];
	var weiboOption = null;
	realationShipChart();
	// weiboChart();
	var chart = echarts.init($("#bottom")[0]);
	chart_Arr.push(chart);
	getData();
	weiboChart();
	setInterval(getData, 10000)

	// setTimeout(function() {
	// 	_div.animate({
	// 		top: -_hi
	// 	}, 3000)
	// }, 1000)
	function getData() {
		$.ajax({
			url: 'http://scapi.weather.com.cn/weather/pushdate?test=ncg',
			type: 'GET',
			success: function(res) {
				var res = $.parseJSON(res);
				var count = res.count;
				var url = res.url;
				var url_len = url.length;
				var ip_Arr = [],
					url_Arr = [],
					date_Arr = [],
					schema_Arr = [],
					parallelAxis = [],
					dataSj = [];
				var len = res.ip.length;
				for (var i = 0; i < len; i++) {
					ip_Arr.push(res.ip[i].rectangle.split(","));
				}
				var time_Arr = [];
				if (url_len) {
					for (var i = 0; i < url[0].timeArray.length; i++) {
						time_Arr.push(url[0].timeArray[i].substr(url[0].timeArray[i].length - 2) + "时");
					}
				}

				// for (var i = 0; i < url_len; i++) {
				// 	if (url[i].content == '/gridDataInterface/getPredictionData') {
				// 		url_Arr.push(justName("格点精细化-逐小时", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/MeiTuanService/weather/rgwst/nearNewest/') {
				// 		url_Arr.push(justName("美团", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/getaqiobserve') {
				// 		url_Arr.push(justName("aqi", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/getBase_WindD') {
				// 		url_Arr.push(justName("等风来", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/getRank') {
				// 		url_Arr.push(justName("Aqi、风力排行", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/gridData') {
				// 		url_Arr.push(justName("格点精细化-实况", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/historycount') {
				// 		url_Arr.push(justName("站点数据统计，站点历史统计", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/historydaydetails') {
				// 		url_Arr.push(justName("站点数据统计，站点详细信息", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/micaps/windfile') {
				// 		url_Arr.push(justName("风场", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/raintime') {
				// 		url_Arr.push(justName("分钟级降水", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/stationinfo') {
				// 		url_Arr.push(justName("站点列表", url[i].countArray));
				// 	}
				// 	if (url[i].content == '/weather/typhoon') {
				// 		url_Arr.push(justName("台风", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'air') {
				// 		url_Arr.push(justName("空气质量", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'alarm') {
				// 		url_Arr.push(justName("预警", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'forecast') {
				// 		url_Arr.push(justName("小时精细化预报", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'hourfc') {
				// 		url_Arr.push(justName("逐小时预报", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'index') {
				// 		url_Arr.push(justName("指数", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'observe') {
				// 		url_Arr.push(justName("城市搜索", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'pastweather') {
				// 		url_Arr.push(justName("昨日天气", url[i].countArray));
				// 	}
				// 	if (url[i].content == 'product') {
				// 		url_Arr.push(justName("专业产品图形", url[i].countArray));
				// 	}
				// }
				var axisLabel = {};
				axisLabel.show = false;
				for (var i = 0; i < time_Arr.length; i++) {
					schema_Arr.push(schema(time_Arr[i], i))
					parallelAxis.push(parallel(time_Arr[i], i))

				}

				for (var i = 0; i < parallelAxis.length; i++) {
					if (i % 2 == 0 && i != 0) {
						parallelAxis[i].axisLabel = axisLabel;
						parallelAxis[i].name = '';
					}
				}
				for (var i = 0; i < url_len; i++) {
					dataSj.push(url[i].countArray);
				}
				countRendar(count);
				weiboOption.series[0].data = ip_Arr;
				chart_Arr[2].setOption(weiboOption);
				// lineChart(url_Arr)
				lineChart2(dataSj, schema_Arr, parallelAxis);
			}
		})
	}

	function realationShipChart() {
		function colorChos(color) {
			var itemStyle = {};
			var normal = itemStyle.normal = {};
			normal.color = color;
			return itemStyle;
		}

		function fontS(n) {
			var label = {};
			var normal = label.normal = {};
			var textStyle = normal.textStyle = {};
			textStyle.fontSize = n;
			return label;
		}
		var chart = echarts.init($("#left")[0]);
		chart_Arr.push(chart);
		var link = [{
				source: '数据接口服务',
				target: 'SmartWeatherApi'
			}, {
				source: '数据接口服务',
				target: 'SCAPI'
			}, {
				source: 'SCAPI',
				target: '格点精细化预报'
			}, {
				source: 'SCAPI',
				target: '流场预报'
			}, {
				source: 'SCAPI',
				target: '等风来'
			}, {
				source: 'SCAPI',
				target: '格点实况'
			}, {
				source: 'SCAPI',
				target: '台风数据'
			}, {
				source: 'SCAPI',
				target: '站点实况统计数据'
			}, {
				source: 'SCAPI',
				target: '站点历史统计数据'
			}, {
				source: 'SCAPI',
				target: '站点实况'
			}, {
				source: 'SCAPI',
				target: '排行'
			}, {
				source: 'SCAPI',
				target: '气象要素色斑图'
			}, {
				source: 'SmartWeatherApi',
				target: '15天天气预报'
			}, {
				source: 'SmartWeatherApi',
				target: '逐小时精细化天气预报'
			}, {
				source: 'SmartWeatherApi',
				target: '3小时精细化天气预报'
			}, {
				source: 'SmartWeatherApi',
				target: '气象指数预报'
			}, {
				source: 'SmartWeatherApi',
				target: '预警信息'
			}, {
				source: 'SmartWeatherApi',
				target: '云图、雷达图'
			}, {
				source: 'SmartWeatherApi',
				target: 'GEO定位'
			}

			, {
				source: '云图、雷达图',
				target: 'GEO定位'
			}, {
				source: '气象指数预报',
				target: 'GEO定位'
			}, {
				source: '15天天气预报',
				target: 'GEO定位'
			}, {
				source: '气象指数预报',
				target: '云图、雷达图'
			}, {
				source: '预警信息',
				target: '3小时精细化天气预报'
			}, {
				source: '预警信息',
				target: '站点实况统计数据'
			}, {
				source: '预警信息',
				target: '站点历史统计数据'
			}, {
				source: '预警信息',
				target: '站点历史统计数据'
			}, {
				source: 'SCAPI',
				target: '数据接口服务'
			}, {
				source: '预警信息',
				target: '数据接口服务'
			}, {
				source: '预警信息',
				target: '15天天气预报'
			}, {
				source: '格点精细化预报',
				target: '15天天气预报'
			}, {
				source: '气象指数预报',
				target: '15天天气预报'
			}, {
				source: '等风来',
				target: '台风数据'
			}, {
				source: 'SmartWeatherApi',
				target: '台风数据'
			}, {
				source: 'SmartWeatherApi',
				target: '排行'
			}, {
				source: '站点实况统计数据',
				target: '站点历史统计数据'
			}, {
				source: '站点历史统计数据',
				target: '排行'
			}, {
				source: '格点精细化预报',
				target: '站点历史统计数据'
			}, {
				source: '格点精细化预报',
				target: '气象指数预报'
			}
		]
		var ca = [{
			name: '数据接口服务'
		}, {
			name: 'SmartWeatherApi'
		}, {
			name: 'SCAPI'
		}, {
			name: '格点精细化预报'
		}, {
			name: '流场预报'
		}, {
			name: '等风来'
		}, {
			name: '格点实况'
		}, {
			name: '台风数据'
		}, {
			name: '站点实况统计数据'
		}, {
			name: '站点历史统计数据'
		}, {
			name: '站点实况'
		}, {
			name: '排行'
		}, {
			name: '气象要素色斑图'
		}, {
			name: '15天天气预报'
		}, {
			name: '逐小时精细化天气预报'
		}, {
			name: '3小时精细化天气预报'
		}, {
			name: '气象指数预报'
		}, {
			name: '预警信息'
		}, {
			name: '云图、雷达图'
		}, {
			name: 'GEO定位'
		}]
		var node = [{
			name: 'SmartWeatherApi',
			// name: '数据接口服务',
			x: -266.82776,
			y: 299.6904,
			symbolSize: 30,
			value: 12,
			category: 'SmartWeatherApi'
				// category: '数据接口服务'
		}, {
			name: '数据接口服务',
			x: -350.08344,
			y: 446.8853,
			symbolSize: 50,
			value: 28,
			category: '数据接口服务'
		}, {
			name: 'SCAPI',
			x: -212.76357,
			y: 245.29176,
			symbolSize: 30,
			value: 12,
			category: 'SCAPI'
		}, {
			name: '格点精细化预报',
			x: -242.82404,
			y: 235.26283,
			symbolSize: 15,
			value: 6,
			category: '格点精细化预报'
		}, {
			name: '流场预报',
			x: -379.30386,
			y: 429.06424,
			symbolSize: 15,
			value: 6,
			category: '流场预报'
		}, {
			name: '等风来',
			x: -417.26337,
			y: 406.03506,
			symbolSize: 15,
			value: 6,
			category: '等风来'
		}, {
			name: '格点实况',
			x: -332.6012,
			y: 485.16974,
			symbolSize: 15,
			value: 6,
			category: '格点实况'
		}, {
			name: '台风数据',
			x: -382.69568,
			y: 475.09113,
			symbolSize: 15,
			value: 6,
			category: '台风数据'
		}, {
			name: '站点实况统计数据',
			x: -320.384,
			y: 387.17325,
			symbolSize: 15,
			value: 6,
			category: '站点实况统计数据'
		}, {
			name: '站点历史统计数据',
			x: -344.39832,
			y: 451.16772,
			symbolSize: 15,
			value: 6,
			category: '站点历史统计数据'
		}, {
			name: '站点实况',
			x: -89.34107,
			y: 234.56128,
			symbolSize: 15,
			value: 6,
			category: '站点实况'
		}, {
			name: '排行',
			x: -87.93029,
			y: -6.8120565,
			symbolSize: 15,
			value: 6,
			category: '排行'
		}, {
			name: '气象要素色斑图',
			x: -339.77908,
			y: -184.69139,
			symbolSize: 15,
			value: 6,
			category: '气象要素色斑图'
		}, {
			name: '15天天气预报',
			x: -194.31313,
			y: 178.55301,
			symbolSize: 15,
			value: 6,
			category: '15天天气预报'
		}, {
			name: '逐小时精细化天气预报',
			x: -158.05168,
			y: 201.99768,
			symbolSize: 15,
			value: 6,
			category: '逐小时精细化天气预报'
		}, {
			name: '3小时精细化天气预报',
			x: -127.701546,
			y: 242.55057,
			symbolSize: 15,
			value: 6,
			category: '3小时精细化天气预报'
		}, {
			name: '气象指数预报',
			x: -385.2226,
			y: -393.5572,
			symbolSize: 15,
			value: 6,
			category: '气象指数预报'
		}, {
			name: '预警信息',
			x: -516.55884,
			y: -393.98975,
			symbolSize: 15,
			value: 6,
			category: '预警信息'
		}, {
			name: '云图、雷达图',
			x: -464.79382,
			y: -493.57944,
			symbolSize: 15,
			value: 6,
			category: '云图、雷达图'
		}, {
			name: 'GEO定位',
			x: -515.1624,
			y: -456.9891,
			symbolSize: 15,
			value: 6,
			category: 'GEO定位'
		}];
		var colorArr = ["#ff4200", "#da001f", " #da008b", "#c300da", "#c300da", "#c300da", " #7600da", " #7600da", " #7600da", " #7600da", " #7600da", " #7600da", "#2e00da", "#0052da", "#0052da", "#0052da", "#0052da", " #0071da", "#31859c", "#009ada"]
		var len = colorArr.length;
		for (var i = 0; i < len; i++) {
			node[i].label = fontS(10);
			node[i].itemStyle = colorChos(colorArr[i]);
		}
		var option = {
			legend: {
				data: ca,
				bottom: 60,
				itemGap: 15,
				// width:40,
				// orient:'vertical',
				textStyle: {
					color: "white",
					fontSize: 10
				}
			},
			series: [{
				top: 10,
				type: 'graph',
				layout: 'circular',
				roam: false,
				zoom: 1.7,
				tooltip: {},
				label: {
					normal: {
						show: true,
						position: 'right',
						textStyle: {
							color: "white"
						}
					}
				},
				data: node,
				links: link,
				categories: ca,
				lineStyle: {
					normal: {
						curveness: 0.3
					}
				}
			}]
		};
		chart.setOption(option)
	}

	function weiboChart() {
		var chart = echarts.init($("#middle")[0]);
		chart_Arr.push(chart);
		var dw = $(".middle").width();
		var dh = $(".middle").height();
		var data_china = require('../data/map/china');
		echarts.registerMap('china', data_china);
		var option = {
			width: dw * 0.7,
			tooltip: {
				show: false
			},
			geo: {
				top: 50,
				name: '强',
				type: 'scatter',
				map: 'china',

				label: {
					emphasis: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#1a2135',
						borderColor: '#111'
					},
					emphasis: {
						areaColor: '#2a333d'
					}
				}
			},
			series: [{
				name: '弱',
				type: 'scatter',
				symbol: 'image://img/db/icon.png',
				coordinateSystem: 'geo',
				symbolSize: 15,
				large: true,
				itemStyle: {
					normal: {
						shadowBlur: 2,
						shadowColor: 'rgba(14, 241, 242, 0.8)',
						color: '#15b1ff'
					}
				},

				data: []
			}]
		};
		weiboOption = option;
		chart.setOption(option);
		// console.log(option);
	}

	function lineChart(data) {
		var option = {
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				right: '3%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				splitLine: {
					show: true,
					lineStyle: {
						type: 'dotted',
						color: 'rgba(255,255,255,0.2)'
					}
				},
				axisLine: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: "white"
					}
				},
				boundaryGap: false,
				data: []
					// data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
			}],
			yAxis: [{
				type: 'value',
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitLine: {
					show: false
				},
			}],
			series: data
		};
		chart.setOption(option)
	}

	function lineChart2(sj, schema_Arr, parallelAxis) {
		var chart = echarts.init($("#bottom")[0]);
		chart_Arr.push(chart);
		var dataGZ = sj;
		// var schema = [{
		// 		name: 'SO2',
		// 		index: 0,
		// 		text: 'SO2'
		// 	}, {
		// 		name: 'AQIindex',
		// 		index: 1,
		// 		text: 'AQI'
		// 	}, {
		// 		name: 'PM25',
		// 		index: 2,
		// 		text: 'PM2.5'
		// 	}, {
		// 		name: 'PM10',
		// 		index: 3,
		// 		text: 'PM10'
		// 	}, {
		// 		name: 'CO',
		// 		index: 4,
		// 		text: ' CO'
		// 	}, {
		// 		name: 'NO2',
		// 		index: 5,
		// 		text: 'NO2'
		// 	}
		// ];
		var schema = schema_Arr
		var lineStyle = {
			normal: {
				width: 1,
				opacity: 1
			}
		};

		var option = {
			textStyle: {
				color: 'rgba(255,255,255,0.1)'
			},
			color: [
				'#577bea'
			],
			parallelAxis: parallelAxis,
			// parallelAxis: [{
			// 	dim: 0,
			// 	name: schema[0].text	
			// }, {
			// 	dim: 1,
			// 	name: schema[1].text
			// }, {
			// 	dim: 2,
			// 	name: schema[2].text
			// }, {
			// 	dim: 3,
			// 	name: schema[3].text
			// }, {
			// 	dim: 4,
			// 	name: schema[4].text
			// }, {
			// 	dim: 5,
			// 	name: schema[5].text
			// }],
			parallel: {
				// axisExpandable: true,
				//     		axisExpandCenter: 15,
				//     		axisExpandCount: 10,
				//     		axisExpandWidth: 50,
				parallelAxisDefault: {
					type: 'value',
					name: 'AQIindex',
					splitLine: {
						show: true
					},
					nameLocation: 'start',
					nameGap: 12,
					nameTextStyle: {
						fontSize: 12,
						color:'rgba(255,255,255,0.5)'
					}
				}
			},
			series: [{
				name: 'parallel',
				type: 'parallel',
				lineStyle: lineStyle,
				blendMode: 'lighter',
				data: dataGZ
			}]
		};
		chart.setOption(option);
	}

	// function justName(name, d) {
	// 	var data = {};
	// 	var lineStyle = {};
	// 	var normal = {};
	// 	normal.color = "rgba(255,255,255,0.3)";
	// 	normal.shadowColor = "rgba(0,0,0,0.5)";
	// 	lineStyle.normal = normal;
	// 	data.lineStyle = lineStyle;
	// 	data.symbolSize = 0;
	// 	data.smooth = true;
	// 	data.name = name;
	// 	data.type = 'line';
	// 	data.stack = '总量';
	// 	data.data = d;
	// 	return data;
	// }
	function justName(n, url) {
		var data = {};
		var sj = {};
		data.sj = sj;
		data.name = n;
		data.text = n;
		data.sj = url
		return data;
	}

	function schema(url_Arr, i) {
		var data = {};
		data.name = url_Arr;
		data.index = i;
		data.text = url_Arr;
		return data;
	}

	function parallel(url_Arr, i) {
		var data = {};
		data.dim = i;
		data.name = url_Arr;
		return data;
	}

	function countRendar(n) {
		if (n) {
			var len = n.length;
			var n_Arr = n.split("");
			if (len < 2) {
				n_Arr = n_Arr;
			}
			if (len > 2 && len <= 5) {
				n_Arr.splice(len - 2, 0, ",");
			}
			if (len == 6) {
				n_Arr.splice(len - 2, 0, ",");
				n_Arr.splice(1, 0, ",");
			}
			if (len == 7) {
				n_Arr.splice(len - 2, 0, ",");
				n_Arr.splice(2, 0, ",");
			}
			if (len == 8) {
				n_Arr.splice(len - 2, 0, ",");
				n_Arr.splice(3, 0, ",");
			}
			if (len == 9) {
				n_Arr.splice(len - 2, 0, ",");
				n_Arr.splice(1, 0, ",");
				n_Arr.splice(4, 0, ",");
			}
			if (len == 10) {
				n_Arr.splice(len - 2, 0, ",");
				n_Arr.splice(2, 0, ",");
				n_Arr.splice(5, 0, ",");
			}

			var str = '';
			for (var i = 0; i < n_Arr.length; i++) {
				str += "<li><div><span>" + n_Arr[i] + "</span><span>" + n_Arr[i] + "</span></div></li>"
			}
			$(".number_c").html(str);
			var _hi = $(".number_c li").find('span').height();
			var _swi = $(".number_c li").find('span').width();
			var _div = $(".number_c li div");
			$(".number_c").width(_div.length * _swi);
			var _wi = $("#number_c").width();
			$(".number_c").css("margin-left", -_wi / 2);
			$(".number_c li").height(_hi);
			$(".number_c li").width(_swi);
			_div.width(_swi);
			_div.height(2 * _hi);
		}

	}
	$(window).resize(function() {
		chart_Arr.forEach(chart => {
			chart.resize();
		});
		var dw = $(".middle").width();
		weiboOption.width = dw * 0.7;
		chart_Arr[2].setOption(weiboOption);
	})
	require('lib/star')($('.star_wrap'))
})