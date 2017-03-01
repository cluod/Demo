var os = require('os');
var URL = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var http = require('http');
var exec = require('child_process').exec;
var utils = require('../../../common/utils');
var req = utils.req;
var _getUuid = utils.getUuid;
var fn_err = function() {
    console.log.apply(console, arguments);
}

var URL_BPA = 'http://bpa.tianqi.cn';
var URL_REGISTER = URL_BPA+'/client/register';
var URL_HEARTBEAT = URL_BPA+'/client/heartbeat';
var package_data = require('../../../package');
var CONST = require('../../../common/const');
var CONST_SOFTTYPE = CONST.SOFTTYPE;
// 对设备进行注册
var DELAY = 1000*60*60*4;

// var user = localStorage.getItem('user');
var userId = -1;
// if (user) {
//     user = JSON.parse(user);
//     userId = user.id;
// }
// 运行在单独的UI线程上


// 注册机器
function _register(register_id, cb) {
    _getUuid(function (err, uuid) {
        console.log(err, uuid);
        if (err) {
            fn_err('report: '+err);
            cb(err);
        } else {
            req.post({
                url: URL_REGISTER,
                data: {
                    id: register_id,
                    uuid: uuid,
                    user_id: userId,
                    type: CONST_SOFTTYPE,
                    platform: os.platform(),
                    arch: os.arch()
                },
                onfinish: function(err, result) {
                    console.log(err, result);
                    if (err) {
                        fn_err('report: '+err);
                        return cb && cb(err);
                    }
                    if (result && result.code == 200) {
                        cb && cb(null, {
                            id_old: register_id,
                            id_new: result.id
                        });
                    } else {
                        cb && cb(result);
                    }
                }
            });
        }
    });
}
// 心跳检测
function _heartbeat(register_id, cb) {
    req.post({
        url: URL_HEARTBEAT,
        data: {
            id_reg: register_id,
            id_user: userId,
            id_l: licence_id,
            v: package_data.version
        },
        onfinish: cb
    });	
}

var reg_id = -1;
var licence_id = 'bfd44a5f28ff14053ac0d3742e4eef8b'

function run() {
    var licence = require('../tool').Verification.get();
    if (licence) {
        licence_id = licence.id;
    }
    _register(reg_id, function(err, data) {
        if (!err && data) {
            reg_id = data.id_new;

            _heartbeat(reg_id, function(err) {
                console.log(err);
                if (err) {
                    fn_err('report: '+err);
                }

                setTimeout(run, DELAY);
            });
        } else {
            fn_err('report: '+err);
            setTimeout(run, DELAY);
        }
    });
}

if (!CONST.DEBUG) {
    run();
}
