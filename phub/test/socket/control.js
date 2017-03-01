const WebSocket = require('../../source/common/socket/lib/ws');
const utils = require('../../source/common/utils');

utils.getUuid((err, uuid) => {
    let src = 'ws://10.14.85.116:4200/control/?uuid='+uuid;
    let ws = new WebSocket(src);
    ws.on('message', (data) => {
        console.log('client got msg: ', data);
        ws.close();
    });
    ws.on('open', () => {
        ws.send(JSON.stringify({
            command: 1001001,
            param: 'test',
            time: new Date().getTime(),
            cb: new Date().getTime()
        }));

        // ws.send(JSON.stringify({
        //     command: 1001001,
        //     param: '南昌',
        //     time: new Date().getTime(),
        //     cb: new Date().getTime()
        // }));
    });
})