!function () {
	'use strict';

	var fs = require('fs');
	var path = require('path');
	var util = require('./utils');

	var CONST = require('./const');
	var CONST_LOG = CONST.LOG;
	var PATH_LOG = CONST_LOG.PATH;
	var LOG_DELAY = CONST_LOG.DELAY || 10;
	var LOG_DAYS = CONST_LOG.DAYS || 3; //日志保留天数

	var EOL = require('os').EOL;
	var EXT_LOGFILE = '.log';

	function format_date(date, format) {
		format || (format = 'yyyy-MM-dd hh:mm:ss');
		var o = {
			"M+": date.getMonth() + 1, //month
			"d+": date.getDate(),    //day
			"h+": date.getHours(),   //hour
			"m+": date.getMinutes(), //minute
			"s+": date.getSeconds(), //second
			"q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
			"S": date.getMilliseconds() //millisecond
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}

		return format;
	}


	var msg_stack = {};
	var dealTime = 0;

	var show = (function () {
		return CONST.DEBUG ? function (msg, cb) {
			console.log(msg);
			cb();
		} : function (msg, cb) {
			var outPath = path.join(this.logDir, this.prefix + format_date(new Date(), 'yyyy-MM-dd')) + EXT_LOGFILE;
			fs.appendFile(outPath, msg, cb);
		};
	})();

	function log(msg, type) {
		if (msg instanceof Error) {
			msg = msg.stack;
		}
		msg_stack[this.uni].push([new Date(), type, msg]);

		if (!dealTime) {
			dealTime = setTimeout(deal.bind(this), LOG_DELAY);
		}
	}

	function deal() {
		var msgs = msg_stack[this.uni].splice(0);

		if (msgs.length === 0) {
			dealTime = 0;
			return;
		}

		msgs = msgs.map(function (v) {
			return ['[' + v[1] + ']', format_date(v[0], '<yyyy-MM-dd hh:mm:ss>'), v[2]].join('\t');
		});

		show.call(this, msgs.join(EOL) + EOL, function () {
			dealTime = setTimeout(deal.bind(this), LOG_DELAY);
		}.bind(this));
	}

	var Logger = function (prefix, logDir) {
		this.prefix = prefix ? prefix + '_' : '';
		this.logDir = logDir ? logDir : PATH_LOG;
		util.file.mkdir(logDir);
		this.uni = path.join(this.logDir, this.prefix);
		msg_stack[this.uni] || (msg_stack[this.uni] = []);
	};

	['info', 'error', 'warn'].map(function (v) {
		Logger.prototype[v] = function (msg) {
			log.call(this, msg, v);
		};
	});

	module.exports = Logger;
} ();
