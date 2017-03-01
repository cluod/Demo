const PORT_SEARCH = [4100, 4199];
const PORT = '52314';
const dgram = require("dgram");
const WebSocket = require('../../source/common/socket/lib/ws');

let getIPAdress = (v => {
    let ips = [];
    return () => {
        if (ips.length == 0) {
            let interfaces = require('os').networkInterfaces();
            for (let devName in interfaces) {
                let iface = interfaces[devName];
                for (let i = 0; i < iface.length; i++) {
                    let alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        ips.push(alias.address);
                    }
                }
            }
            // ips.push('255.255.255.255');
        }
        return ips;
    }
})();

function _websocket(host, port) {
    let src = 'ws://'+host+':'+port;
    console.log(src);
    let ws = new WebSocket(src);
    ws.on('message', (data) => {
        console.log('client got msg: ', data);
        ws.close();
    });
    ws.on('open', () => {
        ws.send(JSON.stringify({
            command: 'changecity',
            param: '北京',
            time: new Date().getTime(),
            cb: new Date().getTime()
        }));
    });
}
function _listence(port, cb) {
    let server = dgram.createSocket("udp4");
    server.on("error", function (err) {
        console.log("server error:\n" + err.stack);
        server.close();
    });
    server.on("message", function (msg, rinfo) {
        console.log("server got: " + msg + " from " +
            rinfo.address + ":" + rinfo.port);

        server.close();
        get_device = true;

        _websocket(rinfo.address, msg);
    });
    server.on("listening", function () {
        let address = server.address();
        console.log("server listening " +
            address.address + ":" + address.port);
        cb && cb();
    });
    server.bind(port);
}


let port_search = PORT_SEARCH[0];
let get_device = false;
function _search() {
    if (port_search > PORT_SEARCH[1]) {
        return console.log('no device!');
    }
    if (get_device) {
        return;
    }
    let message = new Buffer(PORT);
    let ips = getIPAdress();
    ips.forEach(ip => {
        let arr = ip.split('.');
        arr[3] = 255;
        let ip_broadcast = arr.join('.');
        let socket = dgram.createSocket("udp4");
        socket.bind(() => {
            // !!! 此项必须设置
            socket.setBroadcast(true);
        });
        console.log('search:', ip_broadcast, port_search, message.toString());
        socket.send(message, 0, message.length, port_search, ip_broadcast, function (err, bytes) {
            socket.close();
        });
    });
    port_search++;

    setTimeout(_search, 1000);
}

_listence(PORT, _search);