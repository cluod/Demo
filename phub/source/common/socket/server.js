/**
 * 负责内网查找服务，及控制连接服务
 */
{
    const PORT_SEARCH = [4100, 4199]; // 用于内网搜索设备
    const PORT_WEBSOCKET = [4200, 4299]; //用于对外提供的 websocket 服务
    const PORT_SERVER = 4300; // 服务端 websocket 端口
    const dgram = require("dgram");
    const WebSocket = require('./lib/ws');
    const sites = require('../sites');
    const utils = require('../utils');
    const URL = require('url');

    const NUM_WEBSOCKET_CLIENT = 1; // 控制客户端数量
    const COMMAND_INDEX_SEARCH = '1001001'; // 首页搜索
    const COMMAND_CLIENT_QUIT = '2000000'; // 强制客户端退出
    const COMMAND_CLIENT_CONNECT = '2001000'; // 客户端请求连接
    const COMMAND_CLIENT_DEFAULT = '2002000'; // 客户端默认命令

    let UUID = null;
    let port_search_used;
    let port_service_used;
    
    let clients_websocket = []; // 客户端
    /**
     * 创建设备查找服务
     */
    function _createServerSearch() {
        let port_current = PORT_SEARCH[0],
            port_end = PORT_SEARCH[1];
        function _try() {
            let server_search = dgram.createSocket('udp4');
            server_search.on('listening', (msg, rinfo) => {
                let address = server_search.address();
                console.log("search server listening " + address.address + ":" + address.port);
                port_search_used = address.port;
            });
            server_search.on('message', (port, rinfo) => {
                let socket = dgram.createSocket("udp4");
                let msg_send = new Buffer(''+port_service_used);
                socket.send(msg_send, 0, msg_send.length, port, rinfo.address);
            });
            server_search.on('error', (err) => {
                if ('EADDRINUSE' === err.code) {
                    server_search.close();
                    if (port_current < port_end) {
                        _try();
                    }
                }
            });
            server_search.bind(port_current++);
        }
        _try();
    }

    /**
     * 创建 websocket 服务
     */
    function _createService() {
        let port_current = PORT_WEBSOCKET[0],
            port_end = PORT_WEBSOCKET[1];

        function _try() {
            let wss = new WebSocket.Server({
                port: port_current++
            })
            wss.on('connection', client => {
                let url = client.upgradeReq.url;
                let url_obj = URL.parse(url, true);
                let pathname = url_obj.pathname;
                let query = url_obj.query;
                let uuid = query.uuid || '__default';
                if (pathname === '/control/') {
                    client._uuid = uuid;
                }
                client.on('message', msg => {
                    console.log('msg: ', msg, typeof msg);
                    client.send('from server:'+msg);
                    try {
                        msg = JSON.parse(msg);
                    } catch(e){}
                    if (typeof msg == 'object') {
                        _parseCommand(client, msg);
                    }
                });
                wss.clients.forEach(c => {
                    // 强制其它客户端退出
                    if (c !== client) {
                        _send(c, COMMAND_CLIENT_QUIT, null, {
                            time: new Date().getTime()
                        });
                    }
                });
            });
            wss.on('error', (err) => {
                if ('EADDRINUSE' == err.code) {
                    wss.close();
                    _try();
                }
            });
            wss.on('listening', (...args) => {
                port_service_used = wss.options.port;
                _notify({
                    command: 'server.ready',
                    param: {
                        ips: utils.getIps(),
                        port: port_service_used+'',
                        uuid: UUID
                    }
                });
                console.log('service listening '+ wss.options.host+':' + port_service_used);
            });
        }
        _try();
    }

    /**
     * 处理 websocket 传入命令
     */
    function _parseCommand(client, data) {
        let command = data.command;
        let param = data.param;
        let cb = data.cb;
        let uuid = client._uuid;
        if (uuid && uuid === UUID) {
            _parseCommandInner(command, param);
        } else {
            if (COMMAND_CLIENT_CONNECT === command) {
                client._uuid = param;
            }
        }
    }
    function _parseCommandInner(command, param) {
        command += '';
        switch (command) {
            case COMMAND_INDEX_SEARCH:
                let result = sites.getByTxt(param);
                _notify({
                    command: COMMAND_INDEX_SEARCH,
                    param: {
                        keyword: param,
                        result: result
                    }
                });
                
                break;
        }
    }
    function _send(client, command, param, otherParma) {
        let data = {
            command: command || COMMAND_CLIENT_DEFAULT
        };
        if (param) {
            data.param = param;
        }
        data = Object.assign(data, otherParma);

        client.send(JSON.stringify(data));
    }
    function _notify(data) {
        console.log('notify', data.command);
        process.send && process.send(data);
    }

    // setInterval(() => {
    //     _notify({
    //         msg: 'hello from child',
    //         time: new Date().getTime()
    //     });
    // }, 1000);
    /**
     * 和服务端进行 websocket 连接
     */
    function _createWeb(uuid) {
        let url = 'wss://example.tianqi.cn/device/?uuid='+uuid;
        const ws = new WebSocket(url);
        ws.on('message', msg => {
            console.log('web: ', msg);
            try {
                msg = JSON.parse(msg);
            } catch(e){
                console.log(e);
            }
            if (typeof msg == 'object') {
                _parseCommandInner(msg.command, msg.param);
            }
        });
        ws.on('close', () => {
            clearInterval(tt);
            _createWeb(uuid);
        });
        let tt = setInterval(() => {
            console.log('ping', new Date());
            ws.ping();
        }, 1000*20)
    }

    utils.getUuid((err, uuid) => {
        if (!err && uuid) {
            UUID = uuid;
            console.log('UUID = ', UUID);
        }
        
        _createServerSearch();
        _createService();
        _createWeb(uuid);
    });

    exports.createServerSearch = _createServerSearch;
}