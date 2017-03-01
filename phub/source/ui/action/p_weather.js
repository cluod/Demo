Core.init(() => {
    let C = Core;
    let _require = C.require;
    let $ = C.$;
    let echarts = _require('echarts');
    let tool = _require('tool');
    let encryURL = tool.encryURL;
    let encryURL2 = tool.encryURL2;
    let Store = tool.Store;
    let req = tool.req;
    let sites = _require('sites');

    function _formatNum(num) {
        return Math.round(num * 100)/100;
    }
    function _tip(text, css) {
        let $div = $('<div class="tip_dialog">'+text+'</div>').appendTo('body');
        if (css) {
            $div.css(css);
        }
        $div.fadeIn(() => {
            setTimeout(_ => {
                $div.fadeOut(v => {
                    setTimeout(_ => {
                        $div.remove();
                    }, 1000);
                });
            }, 1000);
        });
    }
    Core.on('index.search', (() => {
        let tt_search;
        let _data;
        let _len;
        let _index_current = 0;
        function _run() {
            if (_data) {
                stop_auto = true;
                change_station(_data[_index_current++][2]);
                if (_index_current >= _len - 1) {
                    _index_current = 0;
                } 
                tt_search = setTimeout(_run, DELAY_CHANGE_STATION);
            }
        }
        return (data) => {
            let keyword = data.keyword;
            _tip('搜索城市:'+keyword);
            let _result = data.result;
            let len = _result.length;
            if (len > 0) {
                _data = _result;
                _len = len;
                _run();
            } else {
                setTimeout(v => {
                    _tip('没有搜索结果', {
                        color: 'red'
                    });
                }, 1500);
            }
        }
    })());
    let $body = $('body');
    if ($body.hasClass('videoPlaying')) {
        let $video = $('video').on('ended', e => {
            $body.removeClass('videoPlaying');
            $video.fadeOut();
        });
    } else {
        $body.removeClass('videoPlaying');
    }
    // 数据动效延时
    const DELAY = 1000;
    // 切换站点数据延时
    const DELAY_CHANGE_STATION = 1000*10;

    
    function _getRun(option) {
        const NUM_SHOW = 11;
        let tt_run;
        let index_current = 0;
        const DELAY = option.delay || 5000;
        let _xAxis = option.xAxis.slice(-NUM_SHOW*2);
        let _data = option.data.slice(-NUM_SHOW*2);
        let onData = option.onData;
        let onRun = option.onRun;

        onData && onData({
            xAxis: _xAxis,
            data: _data
        });
        function _run() {
            clearTimeout(tt_run);
            let index_start = index_current * NUM_SHOW, 
                index_end = (index_current + 1) * NUM_SHOW;

            onRun && onRun({
                xAxis: _xAxis.slice(index_start, index_end),
                data: _data.slice(index_start, index_end)
            });


            index_current = index_current == 0? 1: 0;
            tt_run = setTimeout(_run, DELAY); 
        }
        _run();
    }
    let chart_arr = [];
    /**
     * 初始化温度
     */
    let chart_temperate = (() => {
        var chart = echarts.init($('.chart_temperature').get(0));
        chart_arr.push(chart);
        var option = {
            grid: {
                show: true,
                borderWidth: 0,
                borderColor: 'transparent',
                left: 40,
                right: 20,
                bottom: 40
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                interval: 4,
                boundaryGap: false
            },
            yAxis: {
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                minInterval: 1
            },
            series: [{
                name: '温度',
                type: 'line',
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: '#c60e15' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#1646cd' // 100% 处的颜色
                        }], false)
                    }
                },
                lineStyle: {
                    normal: {
                        width: 5,
                        shadowBlur: 10,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: '#c60e15' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#1646cd' // 100% 处的颜色
                        }], false)
                    }
                },
                // markLine: {
                //     lineStyle: {
                //         normal: {
                //             type: 'solid',
                //             color: '#fff',
                //             width: 2,
                //         }
                //     },
                //     symbol: 'circle',
                //     data: [[{
                //         // x: 50,
                //         // y: 200
                //         symbolSize: 0.1,
                //         coord: ['羊毛衫', 5]
                //     },
                //     {
                //         symbolSize: 16,
                //         coord: ['羊毛衫', 20]
                //         // x: 50,
                //         // y: 100
                //     }]]
                // },
                data: []
            }]
        };

        // const NUM_SHOW = 20;
        let $tip_temperature = $('.tip_temperature');
        let tt_run;
        let _xAxis, _data, _len;
        let max_v, min_v;

        let NUM_SHOW = 12;
        let index_current = 0;
        function _run() {
            let index_start = index_current * NUM_SHOW, 
                index_end = (index_current + 1) * NUM_SHOW;
            
            option.xAxis.data = _xAxis.slice(index_start, index_end);
            let data_show = _data.slice(index_start, index_end);

            if (min_v < 0) {
                data_show.forEach((v, i) => {
                    data_show[i] = v - min_v;
                });
                option.yAxis.axisLabel.formatter = (val, index) => {
                    return _formatNum(val + min_v);
                }
                option.tooltip.formatter = (val) => {
                    val = val[0];
                    return val.seriesName+': '+_formatNum(val.value + min_v)+'°C';
                }
            } else {
                option.yAxis.axisLabel.formatter = (val, index) => {
                    return _formatNum(val);
                };
                option.tooltip.formatter = (val) => {
                    val = val[0];
                    return val.seriesName+': '+_formatNum(val.value)+'°C';
                }
            }
            option.series[0].data = data_show;
            chart.clear();
            chart.setOption(option);

            index_current = index_current == 0? 1: 0;
            tt_run = setTimeout(_run, DELAY);
        }
        return {
            init: (data) => {
                chart.setOption(option);
            },
            changeData: (xAxis, data) => {
                chart.hideLoading();
                _xAxis = xAxis;
                _data = data;
                
                _getRun({
                    xAxis: _xAxis,
                    data: _data,
                    onData: ({xAxis, data}) => {
                        max_v = Math.max(...data);
                        min_v = Math.min(...data);
                        
                        let step = (max_v - min_v) / 10;
                        let max_val = max_v;
                        let min_val = min_v;
                        if (min_val < 0) {
                            max_val -= min_v;
                            min_val = 0;
                        }
                        option.yAxis.min = min_val - step;
                        option.yAxis.max = max_val + step;
                        if (min_v < 0) {
                            data.forEach((v, i) => {
                                data[i] = v - min_v;
                            });
                            option.yAxis.axisLabel.formatter = (val, index) => {
                                return _formatNum(val + min_v);
                            }
                            option.tooltip.formatter = (val) => {
                                val = val[0];
                                return val.seriesName+': '+_formatNum(val.value + min_v)+'°C';
                            }
                        } else {
                            option.yAxis.axisLabel.formatter = (val, index) => {
                                return _formatNum(val);
                            };
                            option.tooltip.formatter = (val) => {
                                val = val[0];
                                return val.seriesName+': '+_formatNum(val.value)+'°C';
                            }
                        }
                        
                        $tip_temperature.text(data[data.length - 1]+'°C').show();
                    },
                    onRun: ({xAxis, data}) => {
                        option.xAxis.data = xAxis;
                        option.series[0].data = data;
                        
                        chart.clear();
                        chart.setOption(option);
                    }
                });
            }
        }
    })();
    /**
     * 初始化降水
     */
    let chart_rain = (() => {
        var chart = echarts.init($('.chart_rain').get(0));
        chart_arr.push(chart);

        var option = {
            grid: {
                show: true,
                borderWidth: 0,
                borderColor: 'transparent',
                bottom: 40,
                right: 10
            },
            tooltip: {
                trigger: 'axis',
                formatter: (val) => {
                    val = val[0];
                    return val.seriesName+': '+_formatNum(val.value)+'mm'; 
                }
            },
            xAxis: {
                data: [],
                axisLabel: {
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                }
            },
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            },
            series: [{
                type: 'bar',
                name: '降水',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: '#c60e15' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#1646cd' // 100% 处的颜色
                        }], false)
                    }
                },
                data: [],
                z: 1
            }, {
                type: 'bar',
                itemStyle: {
                    normal: {color: '#072149'}
                },
                silent: true,
                barGap:'-100%',
                barCategoryGap:'40%',
                data: [40, 40, 40, 40, 40, 40],
                animation: false,
                z: 0
            }]
        };

        const NUM_SHOW = 11;
        let num_current = 0;
        let tt_run;
        let _xAxis, _data, _len, _arr_bg_fill;

        let $tip_rain = $('.tip_rain');
        return {
            init: (data) => {
                chart.setOption(option);
            },
            changeData: (xAxis, data) => {
                chart.hideLoading();
                _xAxis = xAxis;
                _data = data;
                
                _getRun({
                    xAxis: _xAxis,
                    data: _data,
                    onData: ({xAxis, data}) => {
                        let len = data.length;
                        let _max_val = Math.max(...data) || 20;
                        _arr_bg_fill = new Array(len / 2);
                        _arr_bg_fill.fill(_max_val);
                        
                        option.series[1].data = _arr_bg_fill;
                        $tip_rain.text(data[len - 1]+'mm');
                    },
                    onRun: ({xAxis, data}) => {
                        option.xAxis.data = xAxis;
                        option.series[0].data = data;
                        
                        chart.clear();
                        chart.setOption(option);
                    }
                });
            }
        }
    })();
    /**
     * 初始化能见度
     */
    let chart_visibility = (() => {
        const NUM_SHOW = 8;
        const DISTANCE_MAX = 20000;
        let p = 1/NUM_SHOW*100+'%';
        let $chart_visibility = $('.chart_visibility');

        let $tip = $('<tip></tip>').appendTo('.main')
        $chart_visibility.on('mouseenter', 'item', function(e) {
            $tip.text('能见度: '+$(this).data('v')+'米').show().css({
                left: e.pageX,
                top: e.pageY
            });
        });
        $chart_visibility.on('mouseleave', e => {
            $tip.hide();
        });
        function _init_html(data, xAxis) {
            var html = ''
            data.slice(0, NUM_SHOW).forEach((v, i) => {
                let opacity = 1-v/DISTANCE_MAX;
                if (opacity < 0) {
                    opacity = 0;
                } else if (opacity > 1) {
                    opacity = 1;
                }
                html += '<item style="width: '+p+'" data-v='+v+'>';
                html += '<span style="opacity: '+opacity+'"></span>';
                html += '<text>'+xAxis[i]+'</text>';
                html += '</item>';
            });
            $chart_visibility.html(html);
        }
        let num_current = 0;
        let tt_run;
        let _xAxis, _data, _len;

        function _run() {
            clearTimeout(tt_run);
            let arr_x = _xAxis.slice(num_current, num_current+NUM_SHOW);
            let arr_data = _data.slice(num_current, num_current+NUM_SHOW);

            _init_html(arr_data, arr_x);
            num_current++;
            if (num_current > _len - NUM_SHOW) {
                num_current = 0;
            }
            tt_run = setTimeout(_run, DELAY);
        }
        // _init_html([10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);
        return {
            changeData: (xAxis, data) => {
                _xAxis = xAxis;
                _data = data;
                _len = xAxis.length;
                _run();
            }
        }
    })();
    /**
     * 初始化风力风向
     */
    let chart_wind = (() => {
        var chart = echarts.init($('.chart_wind').get(0));
        chart_arr.push(chart);
        var option = {
            grid: {
                show: true,
                borderWidth: 0,
                borderColor: 'transparent',
                bottom: 40
            },
            tooltip: {
                trigger: 'axis',
                formatter: (val) => {
                    val = val[0];
                    return '风力: '+_formatNum(val.value)+'米/秒';
                }
            },
            xAxis: {
                type: 'category',
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                boundaryGap: false
            },
            yAxis: {
                scale: false,
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                splitNumber: 6,
                minInterval: 1,
                min: 0
            },
            series: [{
                type: 'scatter',
                symbolSize: 24,
                symbolOffset: ['50%', '50%']
                // symbol: 'image://img/index/flag_wind_blue.png',
                // symbol: (...args) => {
                //     console.log(args);
                // }
                // symbolSize: 12,
                // itemStyle: {
                //     normal: {
                //         color: (data) => {
                //             return data.value < 5? '#094de2': '#d7090c'
                //         }
                //     }
                // },
                // data: [3, {
                //     value: 10,
                //     symbolRotate: 45
                // }, {
                //     value: 4,
                //     symbol: 'circle'
                // }, 5, 7, 3]
            }]
        };

        const NUM_SHOW = 11;
        let num_current = 0;
        let tt_run;
        let _xAxis, _data, _len, _arr_bg_fill;
        let $tip_wind = $('.tip_wind');

        return {
            changeData: (xAxis, data) => {
                chart.hideLoading();
                
                _getRun({
                    xAxis: xAxis,
                    data: data,
                    onData: ({xAxis, data}) => {
                        data.forEach(v => {
                            v.symbol = v.value < 5? 'image://img/index/flag_wind_blue.png': 'image://img/index/flag_wind_red.png';
                        });
                        let arr_val = data.map(v => {
                            return v.value;
                        });
                        option.yAxis.max = Math.ceil(Math.max(...arr_val) * 1.2);

                        $tip_wind.text(data[data.length - 1].value+'m/s');
                    },
                    onRun: ({xAxis, data}) => {
                        option.xAxis.data = xAxis;
                        option.series[0].data = data;

                        chart.clear();
                        chart.setOption(option);
                    }
                })
            }
        }
    })();
    /**
     * 初始化湿度
     */
    let chart_humidity = (() => {
        var chart = echarts.init($('.chart_humidity').get(0));
        chart_arr.push(chart);
        var option = {
            grid: {
                show: true,
                borderWidth: 0,
                borderColor: 'transparent',
                bottom: 40,
                left: 50
            },
            tooltip: {
                trigger: 'axis',
                formatter: (val) => {
                    val = val[0];
                    return '湿度: '+val.value+'%';
                }
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                boundaryGap: false
            },
            yAxis: {
                scale: true,
                axisLine: { 
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisTick: {
                    show: false
                },
                splitLine: { 
                    show: true,
                    lineStyle: { 
                        type: 'dotted',
                        color: '#575963' 
                    } 
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    },
                    formatter: v => {
                        return v + '%';
                    }
                },
                minInterval: 1,
                max: 100
            },
            series: [{
                type: 'scatter',
                name: '湿度',
                symbolSize: v => {
                    return 30 * v/100;
                },
                itemStyle: {
                    normal: {
                        color: (data) => {
                            return data.value > 50? '#d7090c': '#0c41ba'
                            // return Math.random() > 0.5? '#d7090c': '#0c41ba'
                        }
                    }
                },
                data: [30, 20, 30, 40, 90, 30]
            }],
        };
        const NUM_SHOW = 11;
        let num_current = 0;
        let tt_run;
        let _xAxis, _data, _len, _arr_bg_fill;
        let $tip_humidity = $('.tip_humidity');

        return {
            changeData: (xAxis, data) => {
                chart.hideLoading();

                _getRun({
                    xAxis: xAxis,
                    data: data,
                    onData: ({xAxis, data}) => {
                        $tip_humidity.text(data[data.length - 1]+'%');
                    },
                    onRun: ({xAxis, data}) => {
                        option.xAxis.data = xAxis;
                        option.series[0].data = data;

                        chart.clear();
                        chart.setOption(option);
                    }
                })
            }
        }
    })();
    /**
     * 初始化气压
     */
    let chart_pressure = (() => {
        var $chart_pressure = $('.chart_pressure');
        var chart = echarts.init($chart_pressure.get(0));
        chart_arr.push(chart);

        var option = {
            grid: {
                left: 60
            },
            tooltip: {
                trigger: 'axis',
                formatter: (val) => {
                    val = val[1];
                    return '气压: '+_formatNum(val.value)+'百帕';
                }
            },
            xAxis: {
                data: [],
                axisLabel: {
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                min: 500
            },
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            },
            series: [{
                type: 'bar',
                itemStyle: {
                    normal: {color: '#072149'}
                },
                silent: true,
                barGap:'-100%',
                barCategoryGap:'40%',
                data: [40, 40, 40, 40, 40, 40],
                animation: false
            }, {
                type: 'bar',
                itemStyle: {
                    normal: {//'#c60e15'
                        color: '#1646cd'
                    }
                },
                animationDelay: idx => {
                    return idx * 100;
                },
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        const PER_HEIGTH = 24;
        function _get_mask() {
            let option_grid = chart.getOption().grid[0];
            let top = option_grid.top;
            let bottom = option_grid.bottom;
            let height = chart.getHeight();
            let h = height - bottom - PER_HEIGTH;
            let html = '';

            let t = top;
            while(t < h) {
                html += '<div class="mask" style="top:'+t+'px"></div>';
                t += PER_HEIGTH;
            }
            $chart_pressure.append(html);
        }
        const NUM_SHOW = 11;
        let num_current = 0;
        let tt_run;
        let _xAxis, _data, _len, _arr_bg_fill;
        let $tip_pressure = $('.tip_pressure');

        function _run() {
            clearTimeout(tt_run);
            option.xAxis.data = _xAxis.slice(num_current, num_current+NUM_SHOW);
            option.series[1].data = _data.slice(num_current, num_current+NUM_SHOW);
            option.series[0].data = _arr_bg_fill;
            chart.setOption(option);

            num_current++;
            if (num_current > _len - NUM_SHOW) {
                num_current = 0;
            }
            tt_run = setTimeout(_run, DELAY);
        }

        return {
            changeData: (xAxis, data) => {
                chart.hideLoading();

                _getRun({
                    xAxis: xAxis,
                    data: data,
                    onData: ({xAxis, data}) => {
                        let len = data.length;
                        let _max_val = (Math.max(...data) || 500) * 1.2;
                        _arr_bg_fill = new Array(len/2);
                        _arr_bg_fill.fill(_max_val);
                        option.series[0].data = _arr_bg_fill;
                        $tip_pressure.text(data[len - 1]);
                    },
                    onRun: ({xAxis, data}) => {
                        option.xAxis.data = xAxis;
                        option.series[1].data = data;

                        chart.clear();
                        chart.setOption(option);
                    }
                });
                $chart_pressure.find('.mask').remove();
            }
        }
    })();
    /**
     * 初始化预报
     */
    let chart_forcast = (() => {
        var $chart_pressure = $('.chart_forcast');
        var chart = echarts.init($chart_pressure.get(0));
        chart_arr.push(chart);

        option = {
            grid: {
                left: 0,
                right: 20,
                bottom: 20,
                top: 20,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                position: 'top',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日'],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#aaafc2'
                    }
                },
                splitLine: { 
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            yAxis: {
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
                axisLine: {
                    show: false
                }
            },
            series: [
                {
                    name:'低温',
                    type:'line',
                    data:[120, 132, 101, 134, 90, 230, 210],
                    itemStyle: {
                        normal: {
                            color: '#0950d9'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    }
                },
                {
                    name:'高温',
                    type:'line',
                    data:[220, 182, 191, 234, 290, 330, 310],
                    itemStyle: {
                        normal: {
                            color: '#d10d12'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            ]
        };

        return {
            changeData: (arr_x, arr_day, arr_night) => {
                chart.hideLoading();
                option.xAxis.data = arr_x;
                option.series[1].data = arr_day;
                option.series[0].data = arr_night;
                option.yAxis.min = Math.min(...arr_night);
                option.yAxis.max = Math.max(...arr_day) + 3;

                chart.setOption(option);
            }
        }
    })();
    /**
     * 初始化地图
     */
    let _map = (v => {
        let chart = echarts.init($('.chart_map').get(0));
        window.chart = chart;
        chart_arr.push(chart);
        let option = {
            visualMap: {
                min: -20,
                max: 100,
                left: 'left',
                top: 'bottom',
                text: ['高','低', '高','低'],           // 文本，默认为数值文本
                color: ['red', 'blue', 'yellow']
            },
            geo: {
                map: 'china',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#eee'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: '#eee'
                        }
                    }
                },
                scaleLimit: {
                    min: 0.6,
                    max: 13
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#182f6c',
                        borderColor: '#00baf7'
                    },
                    emphasis: {
                        areaColor: '#0b54cf'
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: (val) => {
                    let _v = val.value;
                    return val.seriesName+': '+(_v? _v[2] || 0: 0)
                }
            },
            series: []
        };
        
        var data_china = require('../data/map/china');
        echarts.registerMap('china', data_china);
        // echarts.registerMap('hebei', require('../data/map/hebei'));
        // echarts.registerMap('beijing', require('../data/map/beijing'));
        
        const POINT_SERIE = {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            z: 100,
            
            itemStyle: {
                normal: {
                    color: 'red'
                }
            },
            markPoint: {
                shadowBlur: 5,
                shadowColor: '#fff',
                silent: true,
                label: {
                    normal: {
                        show: false
                    }
                }   
            }
        };
        // 温度（橘） #f26522      降水（蓝）#0183ed     风力风向（绿）#38b349    能见度（黄）#fbf267     气压（紫）#ba0771
        const CONF_RACTOR = {
            'balltempmax': {
                name: '最高气温',
                color: '#f26522',
            },
            'balltempmin': {
                name: '最低气温',
                color: '#f26522'
            },
            'rainfallmax': {
                name: '最大降水量',
                color: '#0183ed'
            },
            'windspeedmax': {
                name: '最大风速',
                color: '#38b349'
            },
            'visibilitymax': {
                name: '最大能见度',
                color: '#fbf267'
            },
            'airpressuremax': {
                name: '最高气压',
                color: '#ba0771'
            },
            'airpressuremin': {
                name: '最小气压',
                color: '#ba0771'
            },
            'humiditymax': {
                name: '最大湿度',
                color: '#7446f2'
            }
        };
        return {
            init: v => {
                chart.setOption(option);
            },
            initData: data => {
                chart.hideLoading();
                console.log(data);
                // data = [data[0]]
                // data = data.slice(1, 2)
                option.series = data.map(v => {
                    // v.type = 'effectScatter';
                    v.symbole = 'rect';
                    v.type = 'scatter';
                    v.rippleEffect = {
                        brushType: 'stroke'
                    }
                    v.coordinateSystem = 'geo';
                    // v.symbolSize = (val) => {
                    //     if (val) {
                    //         return val[2] / 10
                    //     } else {
                    //         return 20;
                    //     }
                    // };
                    // v.symbolSize = () => {
                    //     let size = Math.random() * 30;
                    //     return Math.max(size, 10);
                    // }
                    v.symbolSize = 40;
                    let name = v.name;
                    let conf = CONF_RACTOR[name];
                    if (conf) {
                        let color = conf.color;
                        let m = /#(\w\w)(\w\w)(\w\w)/.exec(color);
                        let color_start = 'rgba(100, 100, 100, 0.5)';
                        if (m) {
                            color_start = 'rgba('+m.slice(1).map(v=>parseInt(v, 16)).join(',')+', 0)';
                        }
                        v.label = {
                            normal: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                },
                                formatter: (val) => {
                                    let _v = val.value;
                                    return (_v? _v[2] || 0: 0)
                                }
                            }
                        }
                        v.itemStyle = {
                            normal: {
                                shadowColor: '#1ab5ff',
                                shadowBlur: 3,
                                // color: conf.color
                                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [{
                                    offset: 0,
                                    color: color_start
                                }, {
                                    offset: 1,
                                    color: conf.color
                                }], false)
                            }
                        }
                        v.name = conf.name;
                    }
                    
                    return v;
                });
                option.series.push(POINT_SERIE);
                chart.setOption(option);
            },
            point: (lon, lat) => {
                chart.hideLoading();
                let series = option.series;
                if (series.length == 0) {
                    series.push(POINT_SERIE);
                }
                series[series.length - 1].markPoint.data = [{
                        coord: [lon, lat]
                }]
                chart.setOption(option);
            }
        }
    })();
    // init_temperate();
    // init_rain();
    // init_visibility();
    // init_wind();
    // init_humidity();
    // init_pressure();

    // chart_forcast();
    _map.init();
    // _map.point(113, 44);

    // 图表显示正在加载
    function _loading_charts() {
        chart_arr.forEach(v => {
            v.showLoading({
                maskColor: 'rgba(0, 0, 0, 0.2)'
            });
        });
    }

    _loading_charts();
    let Parse = (v => {
        /*得到天气图标*/
        function _weatherIcon(time,weather_code){
            var m = /(\d{2}):\d{2}/.exec(time);
            if(m){
                Hours = m[1];
            }else{
                Hours = new Date().getHours();
            }
            return './img/index/weather/'+(Hours >= 18 || Hours <= 6?'night/':'')+weather_code+'.png';
        }
        function _weatherText(index){
            var phenomenon = {};
            phenomenon["00"] = "晴";
            phenomenon["01"] = "多云";
            phenomenon["02"] = "阴";
            phenomenon["03"] = "阵雨";
            phenomenon["04"] = "雷阵雨";
            phenomenon["05"] = "雷阵雨伴有冰雹";
            phenomenon["06"] = "雨夹雪";
            phenomenon["07"] = "小雨";
            phenomenon["08"] = "中雨";
            phenomenon["09"] = "大雨";
            phenomenon["10"] = "暴雨";
            phenomenon["11"] = "大暴雨";
            phenomenon["12"] = "特大暴雨";
            phenomenon["13"] = "阵雪";
            phenomenon["14"] = "小雪";
            phenomenon["15"] = "中雪";
            phenomenon["16"] = "大雪";
            phenomenon["17"] = "暴雪";
            phenomenon["18"] = "雾";
            phenomenon["19"] = "冻雨";
            phenomenon["20"] = "沙尘暴";
            phenomenon["21"] = "小到中雨";
            phenomenon["22"] = "中到大雨";
            phenomenon["23"] = "大到暴雨";
            phenomenon["24"] = "暴雨到大暴雨";
            phenomenon["25"] = "大暴雨到特大暴雨";
            phenomenon["26"] = "小到中雪";
            phenomenon["27"] = "中到大雪";
            phenomenon["28"] = "大到暴雪";
            phenomenon["29"] = "浮尘";
            phenomenon["30"] = "扬沙";
            phenomenon["31"] = "强沙尘暴";
            phenomenon["53"] = "霾";
            phenomenon["99"] = "无";
            return phenomenon[index] || '无';
        }
        function _forcastWeatherText(day_code, night_code){
            let day_text = _weatherText(day_code);
            let night_text = _weatherText(night_code);
            let show_text = day_text;
            if(day_text != night_text){
                show_text += '转'+night_text;
            }
            return show_text.replace(/^无?转|转无?$/,'');
        }

        return {
            icon: _weatherIcon,
            text: _weatherText,
            textForcast: _forcastWeatherText
        }
    })();
    
    /**
     * 切换站点
     */
    let $info = $('info');
    let $tip_map = $('.tip_map');
    let $desc = $('.info desc');
    let $icon_weather = $('icon img');
    function change_station(stationid = '53505') {
        _loading_charts();
        let info = sites.getBySId(stationid);
        $tip_map.text(info.address);
        _map.point(info.lon, info.lat);
        console.log('更改站点：', stationid, info.address);
        let url = encryURL('http://61.4.184.171:8080/weather/rgwst/OneDayStatistics?stationids='+stationid);
        req(url, (err, data) => {
            if (err) {
                return;
            }
            data = data[0];
            let present = data.present;
            let observe24 = data['24H']

            // 温度暂时从过去24小时数据中取
            $info.text(present.atballtemp+'°C');

            let xAxis = [];
            let data_chart = {
                // 能见度
                'visibility': [],
                // 气压
                'airpressure': [],
                // 温度
                'balltemp': [],
                // 湿度
                'humidity': [],
                // 过去1小时降水量
                'precipitation1h': [],
                // 能见度
                'visibility': [],
                // 风速
                'windspeed': [],
                // 风向
                'winddir': []
            };
            observe24.forEach(v => {
                let datatime = v.datatime;
                // let time = new Date(datatime.substr(0, 4)+'/'+datatime.substr(4, 2)+'/'+datatime.substr(6, 2)+' '+datatime.substr(8, 2)+':00');
                let hour = datatime.substr(8, 2);
                xAxis.push(hour+'时');

                for (var i in data_chart) {
                    let val = v[i];
                    if (val === '') {
                        // 用其它数据填充
                        val = present['at'+i];
                        console.log(i, val);
                    }
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = '-';
                    }
                    data_chart[i].push(val);
                }
            });

            let winddir = data_chart['winddir'];

            chart_temperate.changeData(xAxis, data_chart['balltemp']);
            chart_rain.changeData(xAxis, data_chart['precipitation1h']);
            chart_visibility.changeData(xAxis, data_chart['visibility']);
            chart_pressure.changeData(xAxis, data_chart['airpressure']);
            chart_humidity.changeData(xAxis, data_chart['humidity']);
            chart_wind.changeData(xAxis, data_chart['windspeed'].map((v, i) => {
                let dir = winddir[i];
                let conf = {
                    value: v
                }
                if (dir !== '' && dir !== undefined) {
                    conf.symbolRotate = dir % 360;
                } else {
                    conf.symbol = 'circle';
                }

                return conf;
            }));
        });
        
        let url_forcast = encryURL2('http://hfapi.tianqi.cn/data/?areaid='+info.cityid+'&type=forecast15d');
        req(url_forcast, (err, data) => {
            if (!err && data) {
                let data_forcast = data.f;
                let datatime = data_forcast.f0;
                let time = new Date(datatime.substr(0, 4)+'/'+datatime.substr(4, 2)+'/'+datatime.substr(6, 2)+' '+datatime.substr(8, 2)+':00');
                
                let arr_x = [];
                let arr_day = [], arr_night = [];

                data_forcast.f1.forEach((v, i) => {
                    arr_day.push(parseFloat(v.fc));
                    arr_night.push(parseFloat(v.fd));
                    if (i > 0) {
                        time.setDate(time.getDate() + 1);
                    }
                    let day = time.getDate();
                    arr_x.push(day + '日');
                });

                chart_forcast.changeData(arr_x, arr_day, arr_night);

                let data_today = data_forcast.f1[0];
                let fa = data_today.fa,
                    fb = data_today.fb;
                $desc.text(Parse.textForcast(fa, fb));
                let img = fa ? Parse.icon('12:00', fa): Parse.icon('23:00', fb);
                $icon_weather.attr('src', img);
            }
        });
    }
    // 先加载默认站点
    change_station()

    let stop_auto = false;
    /**
     * 得到排行数据
     */
    let _get_rank = (v => {
        const NAME_CACHE = 'rank';
        const TIME_VALID = 1000 * 60 * 60;//有效期一个小时
        let tt_run;
        let ids = [];
        let id_index_current = 0;
        function _run() {
            clearTimeout(tt_run);
            if (stop_auto) {
                return;
            }
            if (id_index_current > ids.length - 1) {
                id_index_current = 0;
            }
            change_station(ids[id_index_current++]);
            tt_run = setTimeout(_run, DELAY_CHANGE_STATION);
        }
        function _deal(data) {
            let data_new = [];
            ids = [];
            data.forEach(v => {
                for (name in v) {
                    let item = v[name];
                    let key = name.replace(/(max|min)$/, '');
                    data_new.push({
                        name: name,
                        data: item.map(info => {
                            var sid = info.stationid;
                            let d = sites.getBySId(sid);
                            if (d) {
                                let val = parseFloat(info[key]);
                                ids.push(sid);
                                return [d.lon, d.lat, val, d]
                            } else {
                                // console.log(d, info);
                            }
                        })
                    });
                }
            });
            _map.initData(data_new);

            ids.sort(v => {
                return 0.5 - Math.random();
            });
            id_index_current = 0;
            // _run();
        }

        return v => {
            let val_cache = Store.get(NAME_CACHE);
            if (val_cache && val_cache.time > new Date().getTime()) {
                console.log('使用排行缓存数据');
                _deal(val_cache.data);
            } else {
                let date = new Date().format('yyyyMMddhh');
                req('http://61.4.184.171:8080/weather/rgwst/NearStation?starttime='+date+'&endtime='+date+'&map=all&num=10', {
                    time: 1000*10
                }, (err, data) => {
                    if (!err && data) {
                        Store.set(NAME_CACHE, {
                            time: new Date().getTime() + TIME_VALID,
                            data: data
                        });
                        _deal(data);
                    } else {
                        _alert(err);
                    }
                });
            }
        }
    })();
    _get_rank();

    function _create(data) {
        console.log(data);
        tool.createCode($('.qrcode'), data);
    }
    Core.once('server.ready', (e, data) => {
        _create(data);
    });
    if (typeof _PARAM_ != 'undefined') {
        _create(_PARAM_);
    }

    $('.btn_qrcode').click(() => {
        $('.qrcode_wrap').toggle();
    });
    $('.btn_close').click(() => {
        window.close()
    });
    {
        const DELAY = 10000;
        let $logo_qrcode = $('.logo_qrcode');
        function _run() {
            $logo_qrcode.toggleClass('show_qrcode');
            setTimeout(_run, DELAY);
        }
        setTimeout(_run, DELAY);
    }

    $(window).on('resize', (() => {
        function _reload() {
            chart_arr.forEach(chart => {
                chart.resize();
            });
        }
        let tt;
        return () => {
            clearTimeout(tt);
            tt = setTimeout(_reload, 300);
        }
    })());
    require('lib/star')($('.star_wrap'));
});