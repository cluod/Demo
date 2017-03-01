var gulp = require('gulp');
var electron = require('gulp-atom-electron');
var path = require('path');
var package = require(path.join(__dirname, '../../source/package'));
var pathIcon = path.join(__dirname, './resource/BPA.ico');
var utils = require('../../source/common/utils');
var version = package.version;
var through = require('through2');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var symdest = require('gulp-symdest');

var EXE_NAME = 'BPA.exe';
var tmpdir = path.join(__dirname, 'tmp');
var packagejs_file = path.join(tmpdir, 'package.js');
var packagejson_file = path.join(tmpdir, 'package.json');

var package_project = require('../../package');
var nameEn = package_project.name;
var nameZh = package_project['name-zh'];

function _electron(arch, pathDest, pathDestArch) {
    arch = arch || 'ia32';
    var opts = {
        "platform": 'win32', 
        "version": "1.3.4",
        "companyName": "北京华风创新网络技术有限公司",
        "copyright": "Copyright @ 2014 tianqi.cn All Right  reserved.",
        "arch": arch,
        "winIcon": pathIcon
    };
    var f = filter(package.name+'.exe', {restore: true});
    return gulp.src(pathDest+'/**/**')
        .pipe(electron(opts))
        .pipe(f)
        .pipe(rename(EXE_NAME))
        .pipe(f.restore)
        .pipe(symdest(pathDestArch))
}

//替换文件内容
function _replace(pathDest) {
    var url_download = 'https://download.tianqi.cn/BPA/GT/';
    return through.obj(function(file, encoding, cb) {
        var fs = require('fs'),
            path = require('path');

        var const_file = path.join(pathDest, 'common/const.js')
        var content = fs.readFileSync(const_file).toString();
        content = content.replace(/DEBUG:([^,;]+),/, '');
        fs.writeFileSync(const_file, content);

        // var listence = '991586292CBE2A4375BC9019FD5198617D183425F393279AD24D4066C1B82A105C240240C968DF72E30B5AD4963A3D9CEB19DFA77E72C4F1BE2823AD7482DC27';
        // var result = require('../listence/gen').verificationWithListence(listence);
        // fs.writeFileSync(path.join(pathDest, 'conf/verification.json'), result);

        // var result = JSON.stringify({
        //     version: version,
        //     packages: {
        //         win32: {
        //             url: url_download + _getExeName('ia32', '.exe')
        //         },
        //         win64: {
        //             url: url_download + _getExeName('x64', '.exe')
        //         }
        //     }
        // });

        // utils.file.mkdir(tmpdir);
        // fs.writeFileSync(packagejs_file, 'bpa_gt_package('+result+')');
        // fs.writeFileSync(packagejson_file, result);

        cb(null, file);
    });
}

function _setup(arch, pathSource) {
    return through.obj(function(file, encoding, cb) {
        var conf = {
            "MyAppId": "{{A57C3E9D-F716-4EAC-995D-97A2D6053BD0}",
            "MyAppName": nameZh,
            "MyAppVersion": version,
            "MyAppPublisher": "北京华风创新网络技术有限公司",
            "MyAppPublisherURL": "http://www.tianqi.com",
            "MyDefaultDirName": "BPA/"+nameEn,
            "MyOutputDir": path.join(__dirname, 'release'),
            "MyOutputBaseFilename": _getExeName(arch),
            "MySetupIconFile": path.join(__dirname, 'resource/BPA.ico'),
            "MyAppURL": "http://www.tianqi.com/",
            "MyAppExeName": EXE_NAME,
            "MyArch": arch,
            "MySource": pathSource
        }

        var issPath = path.join(__dirname, 'resource/BPA.iss');
        var args = [issPath];
        for (var i in conf) {
            args.push('/d'+i+'='+conf[i]);
        }

        var innoSetupPath = path.join(path.dirname(path.dirname(require.resolve('innosetup-compiler'))), 'bin', 'ISCC.exe');

        function _cb(err) {
            cb(err, file);
        }
        require('child_process').spawn(innoSetupPath, args, {
            stdio: 'inherit'
        }).on('error', _cb)
        .on('exit', _cb);
    })
}

function _rename() {
    return through.obj(function(file, encoding, cb) {
        var p = file.path;
    })
}

function _getExeName(arch, suffix) {
    return "BPA-"+nameEn+"-v"+(version.replace('^v', ''))+"-win32-"+ arch + (suffix || '');
}

var UploadConf = (function() {
    var pathDev = path.join(require('os').homedir(), 'BPA', nameEn, '.dev');
    var fileUpload = path.join(pathDev, 'upload.conf');

    // utils.file.mkdir(pathDev);

    return {
        set: function(username, pwd, port) {
            // 将用户名、密码及端口号加密写入文件
            utils.file.write(fileUpload, utils.encrypt.encode(JSON.stringify({
                username: username,
                pwd: pwd,
                port: port
            })));
        },
        get: function() {
            // 对相关信息进行解密
            var result = utils.encrypt.decode(utils.file.read(fileUpload));
            if (result) {
                try {
                    return JSON.parse(result);
                } catch(e) {}
            }
        }
    }
})();
/**
 * 对 download.tianqi.cn 上传进行配置
 */
function _confUserPwd() {
    return through.obj(function(file, encoding, cb) {
        var prompt = '用户名: ';
        process.stdin.setEncoding('utf-8');
        process.stdout.write(prompt);
        process.stdin.resume();
        var name, pwd, port;
        process.stdin.on('data', function(chunk) {
            chunk = chunk.trim();
            if (!chunk) {
                process.stdout.write(prompt);
            } else {
                if (!name) {
                    name = chunk;
                    prompt = '密码: ';
                    process.stdout.write(prompt);
                } else {
                    if (!pwd) {
                        pwd = chunk;
                        prompt = '端口: ';
                        process.stdout.write(prompt);
                    } else {
                        port = chunk;
                        UploadConf.set(name, pwd, port);
                        cb(null, file);

                        process.stdin.pause();
                    }
                }
            }
        })
    })
}
function _console() {
    var args = [].slice.call(arguments);
    return through.obj(function(file, encoding, cb) {
        console.log.apply(console, args);
        cb(null, file);
    })
}
exports.replace = _replace;
exports.electron = _electron;
exports.setup = _setup;
exports.getExeName = _getExeName;
exports.confUserPwd = _confUserPwd;
exports.UploadConf = UploadConf;
exports.console = _console;
exports.getPackageJs = function() {
    return [packagejs_file, packagejson_file];
}