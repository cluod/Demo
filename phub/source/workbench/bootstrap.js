!function(){
	// "use strict";

	var electron = require('electron');
	var app = electron.app;
	var ipc = electron.ipcMain;
	var BrowserWindow = electron.BrowserWindow;
	var path = require('path');
	var _window = require('./window');
	var Logger = require('../common/logger');
	var logger = new Logger();
	var CONST = require('../common/const');
	var util = require('../common/utils');
	// var util_file_mkdir = util.file.mkdir;
	var fork = require('child_process').fork;

	// 启动处理缓存和日志文件的子进程
	// fork(path.join(__dirname, '../common/cache'));

	// 创建必要的目录
	// util_file_mkdir(CONST.PATH.CACHE);

	var win_current;
	var shouldQuit = app.makeSingleInstance(function (argv) {
		if (win_current) {
			if (win_current.isMinimized()) {
				win_current.restore();
			}
    		win_current.focus()
		}
	});
	if (shouldQuit) {
		app.quit();
		return;
	}
	
	let server_ready_param;

	{
		const COMMAND_INDEX_SEARCH = '1001001'; // 首页搜索
		const COMMAND_SERVER_READY = 'server.ready'; // websocket 准备好
		let child = fork(path.join(__dirname, '../common/socket/server'));
		child.on('message', data => {
			// console.log(data);
			if (data) {
				let command = data.command;
				switch (command) {
					case COMMAND_INDEX_SEARCH:
						_emit({
							type: 'index.search',
							msg: data.param
						});
						break;
					case COMMAND_SERVER_READY:
						console.log('data = ', data);
						server_ready_param = data.param;
						setInterval(() => {
							_emit({
								type: COMMAND_SERVER_READY,
								msg: data.param
							});
						}, 1000)
						break;	
				}
			}
		});
		console.log('fork socket server');
	}

	// 捕获系统级错误，方便调试
	process.on('uncaughtException', function(err){
		console.log(err);
		logger.error(err);
	});

	app.on('window-all-closed', function () {
		app.quit();
	});
	var subscibe_list = {};
	ipc.on('subscibe', function(e, type){
		var sender = e.sender;
		var id = BrowserWindow.fromWebContents(sender).id;

		var list = subscibe_list[type] || (subscibe_list[type] = []);
		if(list.indexOf(id) == -1){
			list.push(id);
		}
	});
	function _emit(data){
		var type = data.type;
		var msg = data.msg;
		var list = subscibe_list[type];
		if(list && list.length > 0){
			list.forEach(function(id){
				var win = BrowserWindow.fromId(id);
				if(win){
					win.webContents.send(type, msg);
				}
			});
		}
	}
	ipc.on('emit', function(e, data){
		_emit(data);
	});
	
	// 通过参数调整打开页面
	let page_show = process.argv[2] || 'weather';
	app.on('ready', function() {
        _window.shortcut();
		console.log('server_ready_param = ',server_ready_param);
		win_current = _window.open(page_show, server_ready_param);
	});
}();
