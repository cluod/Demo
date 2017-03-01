/**
 * 定义常量
 */
! function() {
	'use strict'

    var SOFTTYPE = 'PHUB';
	var path = require('path');

	function format(url) {
		url = url.replace(/\\/g, '/');
		url = url.replace(/^(\w+)(?=:)/, function(a, b) {
			if (b) {
				return b.toUpperCase();
			}
		});
		return url;
	}
	var path_base = format(path.join(__dirname, '..'));
	var path_ui_conf = format(path.join(path_base, 'conf/ui'));
	var path_ui = format(path.join(path_base, 'ui'));
	var path_workbench = format(path.join(path_base, 'workbench'));
	var path_common = format(path.join(path_base, 'common'));
	var path_conf = format(path.join(path_base, 'conf'));
	var path_plugin = format(path.join(path_base, 'plugin'));// 插件路径

	var path_user = path.join(require('os').homedir(), 'BPA', SOFTTYPE);
	var path_cache = format(path.join(path_user, 'cache'));
	var path_log = format(path.join(path_user, 'logs'));

	var conf = {
		DEBUG: true,
		PATH: {
			BASE: path_base,
			CONF: path_conf,
			UI: path_ui,
			UI_CONF: path_ui_conf,
			WORKBENCH: path_workbench,
			COMMON: path_common,
			CACHE: path_cache,
			USER: path_user,
			PLUGIN: path_plugin
		},
		LOG: {
			PATH: path_log,
			DELAY: 10, // 异步写日志间隔(s)
			DAYS: 3 // 日志保留天数
		},
		CACHE: {
			NUM: 40
		},
	};

    var conf_const = {};
	try {
		conf_const = require('../conf/const');
	} catch (e) {}

	for (var i in conf_const) {
		conf[i] = conf_const[i];
	}

	conf.SOFTTYPE = SOFTTYPE;
	// conf.UPGRADE_URL = 'http://download.tianqi.cn/BPA/GT/package.json';
	module.exports = conf;
}();