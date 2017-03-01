const sites = require('../../source/common/sites');


function _search(txt) {
    console.log('==========');
    var t_start = new Date().getTime();
    console.log(txt, ':', sites.getByTxt(txt));
    console.log('==========', new Date().getTime() - t_start);
}
// _search('北京');
// _search('巴里坤');
// _search('和硕');
// _search('喀什');
// _search('南昌');
// _search('北京海淀');
_search('北京朝阳');