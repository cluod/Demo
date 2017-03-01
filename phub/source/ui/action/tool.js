(function(){
	'use strict'
	
	let $ = Core.$;
	let fs = require('fs');
	let path = require('path');
	let crypto = require('crypto');
	let util = Core.require('utils');
	const file_util = util.file;
	const QRCode = require('./lib/qrcode');
	// let util_verification = util.verification;
	let store = localStorage;

	const CONST = Core.CONST;
	const CONST_PATH = CONST.PATH;
	const CONST_PATH_PLUGIN = CONST_PATH.PLUGIN;
	const CONST_PATH_USER = CONST_PATH.USER;
	
	let prefix = 'bpa.'+CONST.SOFTTYPE+'.';
	function _getName(name){
		return prefix+name;
	}
	function _set(name, val){
		if(val === undefined || val === null){
			return _rm(name);
		}
		try{
			val = JSON.stringify(val);
			store.setItem(_getName(name), val);
		}catch(e){}
	}
	function _get(name, val_default){
		var val = store.getItem(_getName(name));
		if(val !== undefined && val !== null){
			try{
				return JSON.parse(val);
			}catch(e){}
		}
		return val_default;
	}
	function _rm(name){
		name = _getName(name);
		if(name){
			store.removeItem(name);
		}else{
			_rmAll();
		}
	}
	function _rmAll(){
		for(var i in store){
			if(i.indexOf(prefix) === 0){
				store.removeItem(i);
			}
		}
	}
	var Store = {
		get: _get,
		set: _set,
		rm: _rm,
		rmAll: _rmAll
	}

	let verification = (function() {
		var CACHE_NAME = 'licence';
		var FILENAME = 'sys.conf';
		var file_licence = path.join(CONST_PATH_USER, FILENAME);
		function _parseLicence(licence) {
			licence = util.encrypt.decode(licence.reverse())
			if (licence) {
				var arr = licence.split('|');
				var time_start = new Date(parseInt(arr[0])),
					time_end = new Date(parseInt(arr[1])),
					time_now = new Date();

				return {
					id: arr[3],
					type: arr[2],
					s: time_start,
					e: time_end,
					n: time_now,
					f: time_end > time_start && time_now > time_start && time_now < time_end
				}	
			}
		}
		function _get() {
			var val = localStorage.getItem(CACHE_NAME);
			if (!val) {
				val = file_util.read(file_licence);
			}
			if (val) {
				return _parseLicence(val);
			}
		}
		function _set(licence) {
			localStorage.setItem(CACHE_NAME, licence);
			file_util.write(file_licence, licence);
		}
		return {
			get: _get,
			set: _set,
			parse: _parseLicence
		}
	})();
	let encryURL = (v => {
		const PRIVATE_KEY = 'zk_chupi_date';
		const APPID = '17f520fb9a6a4bfj';
		function _encryURL(url, private_key = PRIVATE_KEY, appid = APPID) {
			var myDate = new Date();
			var date = myDate.format('yyyyMMddhhmm');
			url += (~url.indexOf('?')?'&':'?') + 'date='+date+'&appid='+appid;
			var hmac = crypto.createHmac('sha1', private_key);
			hmac.write(url);
			hmac.end();
			var key = hmac.read().toString('base64');
			key = encodeURIComponent(key);

			return url.replace(/appid=.*/,'appid='+appid.substr(0,6)) + '&key=' + key;
		}
		return _encryURL
	})();
	let encryURL2 = url => {
		return encryURL(url, 'newbee_data', '3bd668a1b59e3371');
	}
	/**
	 * 请求相关
	 */
    let req = (() => {
        var cache = {};
        function _getJson(url, option, cb) {
            if (typeof option == 'function') {
                cb = option;
                option = null;
            }

            option = $.extend(true, {
                method: 'get',
                cache: true,
                param: null,
                timeout: 1000 * 10,
                refresh: false, // true时强制刷新数据
                dealError: true//默认处理没有登录错误
            }, option);

            var isUseCache = option.cache;
            var param = option.param;
            var cacheKey = url+'_'+JSON.stringify(param);
            if (isUseCache && !option.refresh) {
                var val = cache[cacheKey];
                if (val) {
                    return cb && cb(null, val);
                }
            }
            var tt;
            var _req = $[option.method](url, param, function(data) {
                clearTimeout(tt);
                try {
                    data = JSON.parse(data);
                } catch(e){ 
					console.error(e);
				}
                if (data && option.cache && data.code == 200) {
					cache[cacheKey] = data;
				}
				cb && cb(null, data);
            });
            if (_req && _req.error) {
                _req.error(function(e) {
                    clearTimeout(tt);
                    cb && cb(e);
                })
            }
            if (_req && _req.fail) {
                _req.fail(function(e) {
                    clearTimeout(tt);
                    cb && cb(e);
                });
            }
            var timeout = option.timeout;
            tt = setTimeout(function() {
                cb && cb(new Error('timeout'));
            }, timeout);
        }

        _getJson.clearCache = function() {
            cache = {};
        }
        return _getJson;
    })();

	/**
	 * 生成二维码
	 */
	function _createCode(dom, data) {
		let $dom = $(dom);
		let width = $dom.outerWidth();
		let height = $dom.outerHeight();
		data = JSON.stringify(data);
		let text = new Buffer(data).toString('base64');
		new QRCode($dom.get(0), {
			text: text,
			width: width || 256,
			height: height || 256,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.Q
		});
	}
	module.exports = {
		Store: Store,
		Verification: verification,
		encryURL: encryURL,
		encryURL2: encryURL2,
		req: req,
		createCode: _createCode
	};
})()