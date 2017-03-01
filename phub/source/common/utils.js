!function(){
	'use strict'

	var fs = require('fs'),
		path = require('path'),
		crypto = require('crypto'),
		http = require('http'),
		URL = require('url'),
		querystring = require('querystring');

	require('./prop');
	var file_verification = 'verification';
	var CONST = require('./const');
	var CONST_PATH_CONF = CONST.PATH.CONF;

	var Util = {};

	/**
	 * 文件工具类
	 */
	function rmfileSync(p, is_not_rmmyself_if_directory) {
	    //如果文件路径不存在或文件路径不是文件夹则直接返回
	    try{
	    	if(exists(p)){
		    	var stat = fs.statSync(p);
		    	if(stat.isDirectory()){
		    		var files = fs.readdirSync(p);
		    		files.forEach(function(file) {
			            var fullName = path.join(p, file);
			            if (fs.statSync(fullName).isDirectory()) {
			                rmfileSync(fullName);
			            } else {
			                fs.unlinkSync(fullName);
			            }
			        });
				    !is_not_rmmyself_if_directory && fs.rmdirSync(p);
		    	}else{
		    		fs.unlinkSync(p);
		    	}
		    }
	    	return true;
	    }catch(e){}
	}
	function read(_p, is_return_json){
		if(exists(_p)){
			var content = fs.readFileSync(_p, 'utf-8');
			if(is_return_json){
				try{
					return JSON.parse(content.trim());
				}catch(e){}
			}else{
				return content;
			}
		}
		return null;
	}
	function readJson(_p) {
		return read(_p, true);
	}
	function write(_p, content){
		if (typeof content === 'object' && !(content instanceof Buffer)) {
			content = JSON.stringify(content);
		}
		mkdirSync(path.dirname(_p));
		fs.writeFileSync(_p, content);
	}
	// 检测路径是否有效
	function exists(_p){
		try {
			fs.accessSync(_p);
			return true;
		} catch (e) {
			return false;
		}
	}
	function rename(oldPath, newPath) {
		if (exists(oldPath)) {
			try {
				return fs.renameSync(oldPath, newPath);
			}catch(e) {
				return false;
			}
		}
		return false;
	}
	// 同步新建目录
	function mkdirSync(mkPath) {
		try{
			var parentPath = path.dirname(mkPath);
			if(!exists(parentPath)){
				mkdirSync(parentPath);
			}
			if(!exists(mkPath)){
				fs.mkdirSync(mkPath);
			}
			return true;
		}catch(e){}
	}
	function saveBase64(save_file_name, img_data){
		img_data = img_data.substring(img_data.indexOf('base64,') + 7);
		img_data = new Buffer(img_data, 'base64');
		write(save_file_name, img_data);
	}
	// 遍历目录
	function readdir(dir, attr) {
		attr || (attr = {});
		var is_not_recursive = attr.is_not_recursive;
		if(fs.existsSync(dir)) {
			var stat = fs.statSync(dir);
			if(stat.isDirectory()) {
				var return_val = [];
				var files = fs.readdirSync(dir);
				var is_mtime = attr.mtime;
				files.sort().forEach(function(file) {
					var fullName = path.join(dir, file);
					var stat_file = fs.statSync(fullName);
					var isDir = stat_file.isDirectory();
					var obj = {name: fullName};
					if(is_mtime){
						obj.mtime = stat_file.mtime;
					}
					if (isDir) {
						obj.sub = is_not_recursive? []: readdir(fullName);
					}
					return_val.push(obj);
				});
				return return_val;
			}
		}
	}
	// 检测是不是有效目录
	function checkdir(directory) {
		try {
			var stat = fs.statSync(directory);
			return stat.isDirectory();
		} catch (e) {
			return false;
		}
	}
	var file = {
		read: read,
		readJson: readJson,
		write: write,
		stat: fs.statSync,
		exists: exists,
		rename: rename,
		rm: rmfileSync,
		mkdir: mkdirSync,
		Image: {
			save: saveBase64
		},
		checkdir: checkdir,
		readdir: readdir
	}

	/**
	 * path 工具类
	 */
	var path_util = {
		join: function(){
			var result = path.join.apply(path, arguments);
			return result.replace(/\\/g, '/');
		}
	}
	/**
	 * 加密与解密
	 */
	var DEFAULT_PRIVATE_KEY = '20150529';
	var METHOD_ALGORITHM = 'aes-256-cbc';
	/**
	 * 对字符串进行不可逆加密
	 */
	var encrypt = function(str, key){
		if(str && str.toString || str === ''){
			return crypto.createHash('sha1').update(str.toString() + (key||DEFAULT_PRIVATE_KEY)).digest('hex');
		}
		return '';
	}

	var DEFAULT_KEY = CONST.SOFTTYPE;
	/**
	 * 对字符串进行可逆加密
	 */
	encrypt.encode = function(str, key){
		var cip = crypto.createCipher(METHOD_ALGORITHM, key || DEFAULT_KEY);
		return cip.update(str, 'binary', 'hex') + cip.final('hex');
	}
	/**
	 * 解密字符串
	 */
	encrypt.decode = function(str, key, isOld){
		var decipher = crypto.createDecipher(METHOD_ALGORITHM, key || DEFAULT_KEY);
		try{
			return decipher.update(str, 'hex', 'binary') + decipher.final('binary');
		}catch(e){
		}
	}

	/**
	 * 根据路径求文件md5
	 */
	encrypt.md5sum = function (filepath, callback) {
		var _md5sum = crypto.createHash('md5');
		var stream = fs.createReadStream(filepath);
		stream.on('data', function (chunk) {
			_md5sum.update(chunk);
		});
		stream.on('end', function () {
			var str = _md5sum.digest('hex').toUpperCase();
			callback(str);
		});
	};
	/**
	 * 数学格式化
	 */
	var Digit = {
		toFixed: function(num, places){
			if(!isNaN(num)){
                num = num.toFixed(places||4)
            }
            return num;
		}
	};

	/**
	 * 点是否在多边形内
	 * 参考：https://github.com/substack/point-in-polygon/blob/master/index.js
	 */
	function _isPointInPolygon(vs, x, y, opt){
		opt = Object.assign({
			key_x: 'x',
			key_y: 'y',
			isUseAllIn: false // 是否使用精确判断，完全在多边形内（不包括顶点和线上）
		}, opt);
		var key_x = opt.key_x,
			key_y = opt.key_y;
		var isUseAllIn = opt.isUseAllIn;
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        /*
         *    false 不在面内
         *    true 在面内，但不是多边形的端点
         * 	  1 在面内，又是多边形的端点
         */
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][key_x], yi = vs[i][key_y];
            var xj = vs[j][key_x], yj = vs[j][key_y];
            if(x == xi && y == yi || x == xj && y == yj){
                return isUseAllIn? false: 1;
            }
            // 在线段上或顶点上
            if (x == xi && x == xj && (y - yi) * (y - yj) <= 0 || (y == yj && y==yi && (x-xi)*(x-xj) <= 0)) {
            	return isUseAllIn? false: true;
            }
            if (isUseAllIn) {
            	var x_min = Math.min(xi, xj),
            		x_max = Math.max(xi, xj),
            		y_min = Math.min(yi, yj),
            		y_max = Math.max(yi, yj);

            	// 斜率存在且在线段上	
            	if (x > x_min && x < x_max && y > y_min && y < y_max && (yj - yi)/(xj - xi) == (yj - y)/(xj - x)) {
            		return false;
            	}	
            }
            var intersect = ((yi > y) != (yj > y))
                && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }
        return inside;
	}
	/**
	 * 多边形是否在另一个多边形内
	 */
	function _isPolygonInPolygon(polygon_items, sub_polygon_items, is_return_num, opt){
		opt = Object.assign({
			key_x: 'x',
			key_y: 'y',
			isUseAllIn: false // 是否使用精确判断，完全在多边形内（不包括顶点和线上）
		}, opt);
		var debug = opt.debug;
		var key_x = opt.key_x,
			key_y = opt.key_y;
        var inside_num = 0;
        sub_polygon_items.forEach(function(v){
        	// 对分割得到的新点进行特殊处理
        	if (v.t) {
        		inside_num++;
        		return;
        	}
            var flag = _isPointInPolygon(polygon_items, v[key_x], v[key_y], opt);
            if(flag){
                inside_num++;
            } else if (debug) {
            	console.log(v);
            }
        });
        if(is_return_num){
            return inside_num;
        }
        /*线切割面时由于计算得到的两交点可能稍有误差,所以判断是否在多边形中时去除两交点的检测*/
        // if(inside_num >= sub_polygon_items.length-2){
		if(inside_num >= sub_polygon_items.length){
            return true;
        }
        return false;
	}
	/**
	 * 线是否在另一个多边形内
	 */
	function _isLineIn(polygon_items,line_items,is_through){
        var inside_num = 0;
        var len = line_items.length;
        line_items.forEach(function(v_line_item){
            var flag = _isPointInPolygon(polygon_items,v_line_item.x,v_line_item.y);

            if(flag){
                inside_num++;
            }
        });
        if(is_through){
            return inside_num > 2;
        }
        if(inside_num/len > 0.5){
            return true;
        }
        return false;
    }
	/**
	 * 面积为正可以判断多边型正面，面积为负表示多边形背面
	 */
	function _getArea(points) {
		var len = points.length;
		if (len > 0) {
			var S = 0;
			for (var i = 0, j = len - 1; i < j; i++) {
				var p_a = points[i],
					p_b = points[i + 1];
				S += p_a.x * p_b.y - p_b.x * p_a.y;
			}
			var p_a = points[j],
				p_b = points[0];
			S += p_a.x * p_b.y - p_b.x * p_a.y;
			return S / 2;
		}
		return 0;
	}
	/**
	 * 获取多边形的矩形框
	 */
	function _getBound(items) {
		var first = items[0];
		var x_min = first.x,
			y_min = first.y;
		var x_max = x_min,
			y_max = y_min;

		for (var i = 1, j = items.length; i < j; i++) {
			var val = items[i];
			var x = val.x,
				y = val.y;
			if (x > x_max) {
				x_max = x;
			}
			if (x < x_min) {
				x_min = x;
			}
			if (y > y_max) {
				y_max = y;
			}
			if (y < y_min) {
				y_min = y;
			}
		}
		return {
			x_min: x_min,
			y_min: y_min,
			x_max: x_max,
			y_max: y_max
		};
	}
	/**
	 * 多边形相关操作
	 */
	var Polygon = {
		getArea: _getArea,
		getBound: _getBound,
		isPointIn: _isPointInPolygon,
		isPolygonIn: _isPolygonInPolygon,
		isLineIn: _isLineIn
	};

	/**
	 * 对象序列化，得到一个字符串
	 *
	 * (把键和值都放入数据，最后数据合并得到一个字符串)
	 */
	var _fn_serialize = function(obj){
		if(null == obj){
			return '_';
		}

		function _sort(a, b) {
			return a.localeCompare(b);
		}
		switch (obj.constructor) {
			case String:
				return obj;
			case Number:
				return ''+obj;
			case Array:
				var arr = [];
				for(var i = 0, j = obj.length; i<j; i++){
					arr.push(_fn_serialize(obj[i]));
				}
				arr.sort(_sort);
				return arr.join('_');
			case Object:
				var arr = [];
				for(var i in obj){
					arr.push(i);
					arr.push(_fn_serialize(obj[i]));
				}
				arr.sort(_sort);
				return arr.join('_');
			default:
				return ''+obj;
		}
	}

	/**
	 * 对象序列化并得到一个md5字符串
	 */
	_fn_serialize.md5 = function(obj) {
		return encrypt(_fn_serialize(obj));
	}
	var class2type = {};
	"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(v) {
		class2type['[object '+v+']'] = v.toLowerCase();
	});
	var _type = function(obj) {
		if (obj == null) {
			return obj + '';
		}

		var _typeof = typeof obj;
		return _typeof === 'object' || _typeof === 'function' ? class2type[({}).toString.call(obj)] || 'object': _typeof;
	}

	function _isFunction(obj) {
		return _type(obj) === 'function';
	}
	function _isPlainObject(obj) {
		if (_type(obj) != 'object') {
			return false;
		}
		if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
			return false;
		}
		return true;
	}
	var _isArray = Array.isArray;

	function _extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
			// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && _isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( _isPlainObject(copy) || (copyIsArray = _isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && _isArray(src) ? src : [];

						} else {
							clone = src && _isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = _extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}

	/**
	替换字符串中的变量
	var data = {
		t: new Date(),
		t1: new Date('2014/12/15 12:00'),
		t2: new Date('2015/10/11 03:00'),
		w: 100,
		h: 200
	}
	{{T}} {{T0}} {{}} data.t 当前时间
	{{T1}} data.t1	时间一
	{{T2}} data.t2	时间二
	{{T3}} data.t2	时间三(发布时间)
	{{W}} data.w 	宽度
	{{H}} data.h	高度
	{{P}} data.p 	产品名
	_variate(data)('{{}}');
	*/
	var _variate = function(data) {
		var reg = /{{(T3|T2|T1|T0|T|P|W|H)?([^{}]*)}}/gi;
		data = data || {};
		var data_new = {};
		if (data) {
			for (var i in data) {
				var key = i.toLowerCase();
				data_new[key] = data[i];
			}
		}
		return function(str) {
			return str.replace(reg, function(m0, m1, m2, m3) {
				// console.log(m0, m1, m2);
				if (m1) {
					m1 = m1.toLowerCase();
				}
				var val = data_new[m1];
				if (val == undefined) {
					 val = data_new['t'] || new Date();
				}
				if (val) {
					if (val instanceof Date) {
						return (val).format(m2)
					} else {
						return val+m2;
					}
				} else {
					return m0;
				}
			});
		}
	};

	// 原生请求
	var req = (function() {
		function _get(option) {
			var url = option.url;
			var data = option.data;
			var cb = option.onfinish;
			var onresponse = option.onresponse;

			data = querystring.stringify(data);
			if (data) {
				url += (url.indexOf('?') > -1? '&':'?')+data;
			}
			http.get(url, function(res) {
				onresponse && onresponse(res);
				var result = '';
				res.on('data', function(chunk) {
					result += chunk;
				}).on('end', function() {
					cb(null, result.trim());
				});
			}).on('error', cb);
		}
		function _post(option) {
			var url = option.url;
			var data = option.data;
			var cb = option.onfinish;
			var onresponse = option.onresponse;
			
			var opt = URL.parse(url);
			var options = {
				host: opt.host,
				path: opt.path,
				port: opt.port || 80,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			};

			var req = http.request(options, function(res) {
				onresponse && onresponse(res);
				res.setEncoding('utf8');
				var content = '';
				res.on('data', function(chunk) {
					content += chunk;
				}).on('end', function() {
					try {
						var obj = JSON.parse(content);
						content = obj;
					} catch(e) {}

					cb && cb(null, content);
				}).on('error', cb);
			}).on('error', cb);

			var post_data = querystring.stringify(data);
			req.end(post_data);
		}
		return {
			get: _get,
			post: _post
		}
	})();

	/**
	 * 得到当前设备的唯一码
	 */
	let _getUuid = (() => {
		const exec = require('child_process').exec;
		const URL_BPA = 'http://bpa.tianqi.cn';
		const URL_UUID = URL_BPA+'/client/getuuid';
		const vals = ['Serial', 'UUID'];
		let cmd = '';
		let delimiter = ': ';
		switch (process.platform) {
			case 'win32':
				delimiter = '\r\n';
				vals[0] = 'IdentifyingNumber';
				cmd = 'wmic csproduct get ';
				break;
			case 'darwin':
				cmd = 'system_profiler SPHardwareDataType | grep ';
				break;
			case 'linux':
			case 'freebsd':
				cmd = 'dmidecode -t system | grep ';
				break;
		}
		vals.reverse();

		var parseResult = function(input) {
			return input.slice(input.indexOf(delimiter) + 2).trim();
		};

		function getFromNet(cb) {
			cb(encrypt(new Date().getTime()+''+Math.random()+Math.random()));
		}

		// 修复windows203上，执行外部命令时一直等待
		var delay = 4000;
		const PATH_UUID_DIR = path.join(require('os').homedir(), 'BPA');
		const PATH_UUID = path.join(require('os').homedir(), 'BPA/.uuid');
		return function(fn) {
			let cb = function(err, result, from_command) {
				fn && fn(err, result);
				if (!err && result && from_command) {
					file.write(PATH_UUID, result);
				}
				fn = null;
			}
			let val_cache = file.read(PATH_UUID);
			if (val_cache) {
				val_cache = val_cache.trim();
				if (val_cache) {
					return cb(null, val_cache);
				}
			}
			var tt, child_exec;
			function _end() {
				clearTimeout(tt);
				child_exec && child_exec.kill(); //退出子进程
			}
			function timeout(isEnd) {
				_end();
				if (!isEnd) {
					tt = setTimeout(function() {
						getFromNet(cb);
					}, delay);
				} else {
					getFromNet(cb);
				}
			}
			timeout();
			child_exec = exec(cmd + vals[0], function(err, stdout) {
				if (!err) {
					var result = parseResult(stdout);
					if (result.length > 1) {
						_end();
						return cb(null, result, true);
					}
				}
				timeout();
				child_exec = exec(cmd + vals[1], function(err, stdout) {
					if (!err) {
						var result = parseResult(stdout);
						if (result.length > 1) {
							_end();
							return cb(null, result, true);
						}
					}
					timeout(true);
				});
			});
		}
	})();
	
	/**
	 * 得到本机IP
	 */
	function _getIPs() {
		var interfaces = require('os').networkInterfaces();  
		var arr = [];
		for(var devName in interfaces){  
			var iface = interfaces[devName];  
			for(var i=0;i<iface.length;i++){  
				var alias = iface[i];  
				if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
						arr.push(alias.address);  
				}  
			}  
		}  
		return arr;
	}
	
	/*对外提供API*/
	// Util.verification = verification;
	Util.file = file;
	Util.path = path_util;
	Util.encrypt = encrypt;
	Util.Digit = Digit;
	Util.Polygon = Polygon;
	Util.serialize = _fn_serialize;

	Util.isArray = _isArray;
	Util.isPlainObject = _isPlainObject;
	Util.isFunction = _isFunction;
	Util.extend = _extend;

	Util.variate = _variate;

	Util.req = req;
	Util.getUuid = _getUuid;
	Util.getIps = _getIPs;

	module.exports = Util;
}();
