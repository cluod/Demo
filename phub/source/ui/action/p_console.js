{
    const electron = require('electron');
    const ipc = electron.ipcRenderer;
    const $ = Core.$;
    const _req = Core.require;
    const Dialog = _req('./dialog');
    const _alert = Dialog.alert;
    const verification = _req('./tool').Verification;

    let $tab = $('tab item').on('click', function() {
        let $this = $(this);
        $('#'+$this.data('for')).css({
            display: 'block'
        }).siblings().hide();
        $this.addClass('on').siblings().removeClass('on');
    });
    $tab.filter('.on').first().click();

    function _consoleSave(isClose) {
        ipc.send('console.save');
        if (isClose) {
            window.close();
        }
    }
    let $text_listence = $('#text_listence');

    if (typeof _PARAM_ !== 'undefined') {
        let tabName = _PARAM_.tab;
        if (tabName) {
            $tab.filter('.tab_'+tabName).click();
        }
        var _alertInfo = _PARAM_.alert;
        if (_alertInfo) {
            setTimeout(function() {
                _alert(_alertInfo);
            }, 0);
        }
    }

    $('#btnLicence').on('click', () => {
        let val = $text_listence.val().trim();
        if (val) {
            let licence = verification.parse(val);
            if (licence) {
                if (licence.f) {
                    let time_end = licence.e;
                    if (time_end && time_end.format) {
                        verification.set(val);
                        _consoleSave(true);
                        _alert('您可以正常使用，有效期到 "'+time_end.format('yyyy年MM月dd日')+', 请重启！');
                        return;
                    }
                }
            }

            _alert('序列号无效！');
        } else {
            $text_listence.val('');
            _alert('序列号不能为空！')
        }
    });
}