(v => {
    /**
     * sites 数据操作相关
     */
    let data = require('../ui/data/sites');
    let ids = require('../ui/data/ids');

    exports.getBySId = (sid) => {
        let val = data[sid];
        if (val) {
            return {
                lon: val[0],
                lat: val[1],
                sid: val[2],
                pro: val[3],
                city: val[4],
                dist: val[5],
                vill: val[6],
                address: val[7],
                cityid: ids[sid]
            }
        }
    };
    exports.getByTxt = (txt) => {
        if (txt) {
            txt = txt.replace(/[县市省]/, '');
            var result = [];
            for (let i in data) {
                let item = data[i];
                let word = item[3] + item[4] + item[5];
                if (word.indexOf(txt) > -1) {
                    // result.push(word+', '+item[7]);
                    result.push(item);
                }
            }
            if (result.length > 0) {
                return result;
            }
            let arr = txt.split('');
            let len = arr.length;
            for (let i in data) {
                let item = data[i];
                let work = item[3] + item[4] + item[5];
                let flag = true;
                for (let j = 0; j<len; j++) {
                    let _i = work.indexOf(arr[j]);
                    if (_i == -1) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    result.push(item);
                    // return item;
                    // console.log(item);
                }
            }
            return result;
        }
    }
})()