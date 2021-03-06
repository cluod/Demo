!function(){
	'use strict'
	
	var electron = require('electron');
	var remote = electron.remote;

	var dialog = remote.require('electron').dialog;
	var win_instance = remote.getCurrentWindow();
	var CONST = require('../../common/const');
	var CONST_FILTER_IMAGE = CONST.FILTER_IMAGE;

	/*
	confirm1({
		title: '标题',
		detail: '详细信息',
		msg: '消息',
		buttons: [{
			name: '打开消息',
			cb: function() {

			}
		}, {
			name: 'yes'
		}]
	})*/
	function _confirm(options) {
		var msg = options.msg,
			buttons = options.buttons || ['yes', 'no'],
			detail = options.detail,
			title = options.title || '系统提示';

		var button_names = [];
		for (var i = 0, j = buttons.length; i<j; i++) {
			button_names.push(buttons[i].name);
		}
		var conf = {
			type: 'info',
			cancelId: -1,
			buttons: button_names,
			title: title,
			message: msg,
			icon: null
		};
		if (detail) {
			conf.detail = detail;
		}
		return dialog.showMessageBox(win_instance, conf, function(index){
			var btn = buttons[index];
			var cb = btn && btn.cb;
			cb && cb();
		});
	}
	var Dialog = {
		alert: function(msg, cb){
			// 指定 cb 时为异步操作，会让后续行为异常，以下为官方说明:
			// If a callback is passed, the API call will be asynchronous and the result will be passed via callback(response).
			dialog.showMessageBox(win_instance, {
				type: 'info',
				buttons: ['yes'],
				title: '系统提示',
				message: msg,
				icon: null
			});
			cb && cb();
		},
		confirm1: _confirm,
		confirm: function(msg, cb_yes, cb_no) {
			return _confirm({
				msg: msg,
				buttons: [{
					name: 'yes',
					cb: cb_yes
				}, {
					name: 'no',
					cb: cb_no
				}]
			});
		},
		open: function(options, callback) {
			return dialog.showOpenDialog(win_instance, options, callback);
		},
		imageOpen: function(callback) {
			this.open({
				filters: CONST_FILTER_IMAGE
			}, function(file_paths) {
				callback && callback(file_paths[0]);
			});
		},
		imagesOpen: function(callback) {
			this.open({
				filters: CONST_FILTER_IMAGE,
				properties: ['multiSelections']
			}, callback);
		},
		save: function(options, callback) {
			return dialog.showSaveDialog(win_instance, options, function(file_path) {
				if (file_path) {
					callback && callback(file_path);
				}
			});
		}
	};
	module.exports = Dialog;
}()
