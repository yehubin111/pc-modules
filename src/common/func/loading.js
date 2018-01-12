/**
 * Created by viruser on 2017/11/9.
 */
define([], function () {
    function loading(options) {
        this._data = {
            picUrl: '//i.thsi.cn/images/ifund/home/ynew/fundmarket/common-loading.gif',
            picId: '_loadingOBJ',
            picWidth: 50,
            picHeight: 50,
            boxId: '',
            tplace: 'center'  // center left right top bottom
        };

        this.hash = parseInt(Math.random() * 10000000);

        this.init(options);

        this.length++;

        return this._data.picId;
    }

    loading.prototype = {
        init: function (options) {
            this.opts = $.extend({}, this._data, options);

            // 添加定位方式
            var dw = $(this.opts.boxId).css('position');
            if (dw !== 'relative' && dw !== 'absolute' && dw !== 'fixed') {
                $(this.opts.boxId).css('position', 'relative');
            }

            // 添加加载中
            this.setAction();
        },
        setAction: function () {
            var styles = 'position: absolute;';
            var pheight = $(this.opts.boxId).height();
            var pwidth = $(this.opts.boxId).width();
            var cw = (pwidth - this.opts.picWidth) / 2;
            var ch = (pheight - this.opts.picHeight) / 2;
            switch (this.opts.tplace) {
                case 'center':
                    styles += 'top: ' + ch + 'px;left:' + cw + 'px;';
                    break;
                case 'left':
                    styles += 'top: ' + ch + 'px;left:0px;';
                    break;
                case 'right':
                    styles += 'top: ' + ch + 'px;right:0px;';
                    break;
                case 'top':
                    styles += 'top: 0px;left:' + cw + 'px;';
                    break;
                case 'bottom':
                    styles += 'bottom: 0px;left:' + cw + 'px;';
                    break;
            }

            var str = '<img src="' + this.opts.picUrl + '" alt="" id="' + this.opts.picId + '_' + this.hash + '" style="' + styles + '" width="' + this.opts.picWidth + '"/>';

            $(this.opts.boxId).html(str);
        }
    };

    return loading;
});