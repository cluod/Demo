/**
 * exec after webContents trigger 'did-finish-load'
 */
! function(window_global) {
	'use strict'

	var _req = require;
	var path = _req('path');
	var fs = _req('fs');
	var electron = _req('electron');
	var ipc = electron.ipcRenderer;
	var _remote = electron.remote;

	var dialog = _req('./dialog');
	var _alert = dialog.alert;
	var win_instance = _remote.getCurrentWindow();
	var CONST = win_instance.CONST || _req('../../common/const');
	var CONST_PATH = CONST.PATH;
	var CONST_PATH_UI = CONST_PATH.UI;
	var CONST_PATH_UI_ACTION = path.join(CONST_PATH_UI, 'action');
	var CONST_PATH_UI_STYLE = path.join(CONST_PATH_UI, 'style');
	var CONST_PATH_WORKBENCH = CONST_PATH.WORKBENCH;
	var CONST_PATH_COMMON = CONST_PATH.COMMON;
	var CONST_SOFTTYPE = CONST.SOFTTYPE;
	// var CONST_PATH_PLUGIN = CONST_PATH.PLUGIN;

	var Logger = _req(path.join(CONST_PATH_COMMON, 'logger'));
	var logger = new Logger();

	// 添加require引用模块路径
	var paths_require = [CONST_PATH_COMMON, CONST_PATH_UI_ACTION, CONST_PATH_UI_ACTION + '/lib'];
	var globalPaths = require('module').globalPaths;
	paths_require.forEach(function(v) {
		globalPaths.push(v);
	});

	// 方便各子模块部通信
	function Model() {}
	_req('util').inherits(Model, _req("events").EventEmitter);

	var model = new Model();
	model.setMaxListeners(20);

	model.on('log', function(msg) {
		logger.info(msg);
	});

	function _error(err) {
		if (CONST.DEBUG) {
			console.error(err);
			// throw err;
		}
		var info = err.msg || err.message || err;
		logger.error(info);
	}
	if (!CONST.DEBUG) {
		process.on('uncaughtException', function(err) {
			model.emit('error', err);
		});
		//统一处理其它库里的错误信息
		model.on('error', _error);
	} else {
		model.on('error', function(err) {
			console.error(err);
		});
	}

	function require_safe(req, url, showError) {
		try {
			return req(url);
		} catch(e) {
				e.stack = '[module error]' + url + '\n' + e.stack;
				_error(e);
		}
	}
	/**
	 * load jascript in core/ui/action/
	 */
	function load(url, subpath) {
		var _p = path.resolve(CONST_PATH_UI_ACTION, subpath || '', url);
		return require_safe(_req, _p);
	}

	/**
	 * load module in workbench
	 */
	function _loadRemote(url) {
		var _p = path.resolve(CONST_PATH_WORKBENCH, url);
		return require_safe(_remote.require, _p);
	}

	function _require(name) {
		try {
			return _req(name);
		} catch(e) {
			e.stack = '[module error]' + name + '\n' + e.stack;
			_error(e);
		}
	}

	/**
	 * catch error
	 * 可选订阅事件
	 */
	function safe(fn_subscibe, cb) {
		if (cb === undefined) {
			cb = fn_subscibe;
		} else {
			fn_subscibe();
		}
		try {
			cb(model);
		} catch (e) {
			model.emit('error', e.stack);
		}
	}

	var event_list = {};
	/**
	 * 订阅事件
	 */
	function subscibe(name, callback) {
		ipc.send('subscibe', name);
		if (!event_list[name]) {
			event_list[name] = [];
			ipc.on(name, function(e, data) {
				var list = event_list[name];
				if (list && list.length > 0) {
					list.forEach(function(cb) {
						cb(data);
					});
				}
			});
		}
		event_list[name].push(callback);
	}
	function subscibeOnce(name, callback) {
		ipc.send('subscibe', name);
		ipc.once(name, callback);
	}
	/**
	 * 触发事件
	 */
	function emit(name, data) {
		if ('ready' === name) {
			return win_instance.show();
		}
		ipc.send('emit', {
			'type': name,
			'msg': data
		});
	}

	// 添加css
	function addLink(v, cb) {
		$head.append($('<link rel="stylesheet" href="' + path.resolve(CONST_PATH_UI_STYLE, v + EXT_CSS) +
			'" type="text/css"/>').on('load', cb).on('error', cb));
	}

	// 处理main进程发过来的事件
	subscibe('ui', function(data) {
		model.emit(data.type, data.msg);
	});

	function _close() {
		window.close();
	}
	var Win = {
		open: function(name, option) {
			option || (option = {});
			var is_subwin = option.is_sub;

			var win_remote = _loadRemote('window');
			var win = win_remote.open(name, option.param);
			if (is_subwin) {
				win_remote.setSub(win_instance.id, win.id);
			}
			return win;
		},
		openSub: function(name, option) {
			return this.open(name, $.extend({
				is_sub: true
			}, option));
		},
		openModal: function(name, option) {
			var win_remote = _loadRemote('window');
			var modal = win_remote.getInstance(name, {
				parent: win_instance,
				modal: true
			});
			return win_remote.load(modal, name, option.param);
		},
		openTray: function() {
			var service_remote = _loadRemote('service');
			service_remote.getTray() || service_remote.init();
		},
		isOpenedUi: function(name) {
			var win_remote = _loadRemote('window');
			return win_remote.isOpenedUi(name);
		},
		close: function(confirm, cb_before_close) {
			if (confirm) {
				dialog.confirm('确实要退出吗？', function() {
					cb_before_close && cb_before_close();
					_close();
				});
			} else {
				_close();
			}
		},
		WIN: win_instance
	}
	var $ = load('lib/j');
	_require('prop');

	// 暂时可以考虑在需要的时候再加载相应的插件,后续可考虑在每个页面加载完后直接加载所有插件
	// var _plugin = (function() {
	// 	function _load(name) {
	// 		var plugin = _require(path.join(CONST_PATH_PLUGIN, name));
	// 		if (plugin) {
	// 			logger.info('[plugin] '+ (plugin.id || plugin.name || name)+' loaded');
	// 			var fninit = plugin.init;
	// 			if (fninit) {
	// 				fninit(model);
	// 			}
	// 		}
	// 		return plugin;
	// 	}
	// 	return function(name) {
	// 		if (name) {
	// 			return _load(name);
	// 		} else {
	// 			// 加载所有插件
	// 			fs.readdir(CONST_PATH_PLUGIN, function(err, files) {
	// 				if (!err && files && files.length > 0) {
	// 					files.forEach(function(file) {
	// 						_load(file);
	// 					});
	// 				}
	// 			});
	// 		}
	// 	}
	// })();
	var EXT_CSS = '.css';
	var $head = $('head');
	var $body = $('body');
	var Core = {
		CONST: CONST,
		$: $,
		model: model,
		on: subscibe,
		once: subscibeOnce,
		send: ipc.send,
		emit: emit,
		require: _require,
		init: safe,
		Win: Win,
		addLink: addLink,
		Logger: Logger
	};
	window_global.Core = Core;

	{
		// var util = _require('util');
		var tool = _require('tool');
		function _getListence() {
			return tool.Verification.get();		}
		let is_page_console = /console.html/.test(location.href);
		function _openConsoleLicence() {
			if (!is_page_console) {
				Win.open('console', {
					param: {
						tab: 'listence'
					}
				});
				_close();
			}
		}
		if (!CONST.DEBUG && !is_page_console) {
			var Store = tool.Store;
			var cache_name = '_l_n';
			var delay = 1000*60;// 1分钟
			var flag_notice = false;
			function _check() {
				var listence = _getListence();
				let _isHaveLicence = true;
				if (listence) {
					var time_schedule = Store.get(cache_name);
					if(time_schedule){
						time_schedule = new Date(parseInt(time_schedule));
					}
					var flag = listence.f && (!time_schedule || time_schedule > listence.s && time_schedule < listence.e);
					if (!flag && flag_notice) {
						_isHaveLicence = false;
						_alert('您的软件已经过期，请联系管理员!');
					} else if (!listence.id || listence.type != CONST_SOFTTYPE) {
						_isHaveLicence = false;
						_alert('您的序列号已经过期或无效，请联系管理员！');							
					}
					flag_notice = true;
					if (!time_schedule || time_schedule < listence.s) {
						time_schedule = listence.s;
					}
					Store.set(cache_name, time_schedule.getTime()+delay);

				} else {
					_isHaveLicence = false;
					_alert('没有正确的序列号，请联系管理员！');
					// _close();
				}
				if (!_isHaveLicence) {
					_openConsoleLicence();
				}
				setTimeout(_check, delay);
			}
			setTimeout(_check, 1000*60*5);
		}
	}
	safe(function() {
		var str_css = $body.attr('css');

		var len_css = 0;
		// 保证css优先加载
		function fn_css() {
			if (--len_css <= 0) {
				fn_js();
			}
		}

		function fn_js() {
			// show content
			// http://www.w3schools.com/tags/att_global_hidden.asp
			$('tmpl').removeAttr('hidden');

			var reg = RegExp("(file:///)?" + (encodeURI(CONST_PATH_UI).replace(/\(/g, '\\(').replace(/\)/g, '\\)')) +
				"/?([^.]+).(.+)$");
			var m = reg.exec(location.href);
			if (m) {
				// load default javascript for page base on page name

				// eg: 	"login.html" => "p_login"
				// 		"user/login.html" => "p_user_login"
				// load('p_'+m[2].replace(/\//, '_'));
				var pageName = m[2].replace(/\//, '_');
				load('p_' + pageName);
				model.PAGE = pageName;
			}

			if ($body.attr('waiting') === undefined) {
				emit('ready');
			}
		}
		if (str_css) {
			var css_arr = str_css.split(/\s+/);
			len_css = css_arr.length;
			css_arr.forEach(function(v) {
				addLink(v, fn_css);
			});
		} else {
			fn_js();
		}
	});

	// 引入上报模块
	_req('reporter');
}(window)
