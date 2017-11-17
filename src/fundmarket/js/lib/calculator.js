/**
 * Created by viruser on 2017/8/4.
 */
(function (root, factor) {
    if (typeof define === 'function' && define.amd) {
        define(factor);
    } else if (typeof exports === 'object') {
        module.exports = factor();
    } else {
        root.calcuOper = factor();
    }
})(this, function () {
    function calcuOper(options) {
        this.defaults = {
            fundname: '',
            fundcode: '',
            fundbsy: '0.0035',
            closeCallback: ''
        };

        this._data = {
            'generId': 'useCalculator',
            'infoId': 'fundInfo',
            'moneyId': 'fundMoney',
            'resultId': 'setResult',
            'searchId': 'seachResult',
            'fundmsy': '',
            'fundbsy': ''
        };

        this.init(options);
    }

    calcuOper.prototype = {
        init: function (options) {
            var self = this;

            this.opts = $.extend({}, this.defaults, options);

            this._data.fundname = this.opts.fundname;
            this._data.fundcode = this.opts.fundcode;
            this._data.fundbsy = this.opts.fundbsy;
            this._data.day = [365, 180, 90, 30];
            this._data.fundPlace = '请输入基金代码、简称或拼音';
            this._data.moneyPlace = '请输入申请金额';
            this._data.tsIndex = -1;

            var htmldata = self._data;
            //添加HTML
            this.addHTML(htmldata);

            //代码搜索框功能
            $('#' + this._data.infoId + ' input').on({
                'focus': function () {
                    self.tools.placeGetholderFocus.call(this, self._data.fundPlace);
                },
                'click': function () {
                    if ($(this).val() !== '') {
                        $('#' + self._data.searchId).show();
                    }
                },
                'blur': function () {
                    self.tools.placeGetholderBlur.call(this, self._data.fundPlace);
                },
                'keyup': function (e) {
                    $('#' + self._data.searchId).show();
                    self._data.tsIndex = -1;

                    self.setKeydown.call(self, e);

                    self.fundSearch.call(self, this);
                }
            });

            //金额输入框功能
            $('#' + this._data.moneyId + ' input').on({
                'keyup': function () {
                    var vl = $(this).val();
                    $(this).val(vl.replace(/[^(0-9)]/g, ''));

                    self.setCalculate.call(self, this);
                },
                'focus': function () {
                    self.tools.placeGetholderFocus.call(this, self._data.moneyPlace);
                },
                'blur': function () {
                    self.tools.placeGetholderBlur.call(this, self._data.moneyPlace);
                }
            });

            //搜索结果事件
            $('#' + this._data.searchId).on({
                'mouseenter': function () {
                    var idx = $('#' + self._data.searchId + ' p').index($(this));

                    self._data.tsIndex = idx;

                    self.choiceDD.call(self, self._data.tsIndex);
                },
                'click': function () {
                    self.clickEnter.call(self, self._data.tsIndex);
                }
            }, 'p');

            //关闭
            $('#calClose').on({
                'click': function () {
                    $('#' + self._data.generId).hide();
                    $('#' + self._data.searchId).hide();

                    if (typeof self.opts.closeCallback === 'function') {
                        self.opts.closeCallback();
                    }
                }
            });

            $(document).click(function (e) {
                if (!$('#' + self._data.infoId + ' input').is(e.target) && $('#' + self._data.searchId).has(e.target).length === 0) {
                    $('#' + self._data.searchId).hide();
                }
            });
        },
        addHTML: function (ts) {
            var self = this;

            var str = '<div class="usecalculator" id="' + ts.generId + '" style="display: none;">'
                + '<p class="u-title">'
                + '<span class="name">收益计算器</span>'
                + '<i class="close" id="calClose"></i>'
                + '</p>'
                + '<div class="u-fundinfo">'
                + '<div class="fundinput" style="z-index: 99;" id="' + ts.infoId + '">'
                + '<span class="title">基金名称</span>'
                + '<input type="text" value="' + ts.fundPlace + '" style="display: none;color: #999;">'
                + '<p class="fund" style="display: none;"><span>' + self.opts.fundname + '</span> (' + self.opts.fundcode + ')</p>'
                + '<div class="seachResult" id="' + ts.searchId + '" style="display: none">'
                + '</div>'
                + '<div class="clear"></div>'
                + '</div>'
                + '<div class="fundinput" id="' + ts.moneyId + '">'
                + '<span class="title">申购金额</span>'
                + '<input type="text" value="' + ts.moneyPlace + '" style="color: #999;" maxlength="9">'
                + '<span class="unit">元</span>'
                + '<div class="clear"></div>'
                + '</div>'
                + '<p class="tip">收益根据您的申购金额和基金过往业绩进行测算</p>'
                + '</div>'
                + '<div class="u-result" id="' + ts.resultId + '">'
                + '<div class="line">'
                + '<div class="sy">'
                + '<p class="key">近1年预计收益</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '<div class="sy">'
                + '<p class="key">银行活期</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '</div>'
                + '<div class="line">'
                + '<div class="sy">'
                + '<p class="key">近6月预计收益</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '<div class="sy">'
                + '<p class="key">银行活期</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '</div>'
                + '<div class="line">'
                + '<div class="sy">'
                + '<p class="key">近3月预计收益</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '<div class="sy">'
                + '<p class="key">银行活期</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '</div>'
                + '<div class="line">'
                + '<div class="sy">'
                + '<p class="key">近1月预计收益</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '<div class="sy">'
                + '<p class="key">银行活期</p>'
                + '<p class="value f-up">--</p>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<p class="u-expoint">收益测算仅供参考，过往业绩不预示未来表现。</p>'
                + '</div>'
                + '<div class="shadow" id="shadow" style="display: none;"></div>';

            $('body').append(str);
        },
        dataClear: function (blm) {
            var self = this;

            $('#' + self._data.infoId + ' input').val(self._data.fundPlace).css({'color': '#999'});
            $('#' + self._data.resultId + ' .value').html('--').addClass('f-up').removeClass('f-down');
            $('#' + self._data.moneyId + ' input').val(self._data.moneyPlace).css({'color': '#999'});

            if (blm) {
                self._data.fundmsy = '';
                // self._data.fundbsy = '';
            }
        },
        setCalculate: function (ts) {
            var self = this;
            var vl = $(ts).val();

            // $(ts).val($(ts).val().replace(/[^(0-9)]/g, ''));

            if (isNaN(vl)) {
                return false;
            }

            $('#' + self._data.resultId + ' .value').html('--').addClass('f-up').removeClass('f-down');

            if (self._data.fundmsy === '') {
                return false;
            }

            self.goCal.call(self, vl);
        },
        setKeydown: function (e) {
            var self = this;

            if ($('#' + self._data.searchId).is(':hidden'))
                return;

            var keycode = e.which;

            switch (keycode) {
                case 40:
                    // down
                    self._data.tsIndex++;
                    if (self._data.tsIndex > $('#' + self._data.searchId + ' p').length - 1) {
                        self._data.tsIndex = 0;
                    }
                    self.choiceDD.call(self, self._data.tsIndex);
                    break;
                case 38:
                    //up
                    self._data.tsIndex--;

                    if (self._data.tsIndex < -1 || self._data.tsIndex === -1) {
                        self._data.tsIndex = $('#' + self._data.searchId + ' p').length - 1;
                    }
                    self.choiceDD.call(self, self._data.tsIndex);
                    break;
                case 13:
                    select = self._data.tsIndex === -1 ? 0 : self._data.tsIndex;

                    self.clickEnter.call(self, select);
                    break;
            }
        },
        choiceDD: function (idx) {
            var self = this;

            $('#' + self._data.searchId + ' p').removeClass('on').eq(idx).addClass('on');
        },
        clickEnter: function (idx) {
            var self = this;

            var sel = $('#' + self._data.searchId + ' p').eq(idx).html().split(' ');

            $('#' + self._data.searchId).hide();
            $('#' + self._data.infoId + ' input').val(sel[1] + '(' + sel[0] + ')');

            var code = sel[0];
            // 根据code获取收益率
            self.getSydata.call(self, code);
        },
        getSydata: function (code) {
            var self = this;

            var url = '/interface/net/index/0_' + code;
            $.get(url, function (data) {
                var dd = eval('(' + data + ')').data;

                var ysy = dd.year / 100, hsy = dd.hyear / 100, tsy = dd.tmonth / 100, msy = dd.month / 100;
                var fundmsy = ysy + '|' + hsy + '|' + tsy + '|' + msy;
                self._data.fundmsy = fundmsy;
                // 计算收益结果
                self.setCalculate.call(self, $('#' + self._data.moneyId + ' input'));
            });
        },
        fundSearch: function (ts) {
            var self = this;
            var vl = $(ts).val();

            if (vl === '') {
                $('#' + self._data.searchId).hide();
                return;
            }

            var url = 'http://news.10jqka.com.cn/public/index_keyboard_' + vl + '_ijjfund_5_1_jsonp.html';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: 'jsonp',
                jsonp: false,
                cache: true,
                success: function (data) {
                    self.addShresult.call(self, data);
                }
            });
        },
        addShresult: function (data) {
            var self = this;

            var dar = data;
            var str = '';

            $.each(dar, function (i, v) {
                str += '<p class="s-info">' + v.code + ' ' + v.name + '</p>';
            });

            $('#' + self._data.searchId).html(str);
        },
        goCal: function (money, allsy, bsy) {
            var self = this;
            self._data.fundmsy = allsy ? allsy : self._data.fundmsy;
            self._data.fundbsy = bsy ? bsy : self._data.fundbsy;

            var fundmsy = self._data.fundmsy.split('|');
            var fundbsy = self._data.fundbsy;
            var day = self._data.day;

            $('#' + self._data.moneyId + ' input').val(money).css({'color': '#333'});

            $('#' + self._data.resultId + ' .line').each(function (i, v) {
                var mrl = fundmsy[i] * money;
                var brl = fundbsy * money * day[i] / 365;

                $(this).find('.value').eq(0).addClass(mrl < 0 ? 'f-down' : 'f-up').html('￥' + mrl.toFixed(2));
                $(this).find('.value').eq(1).addClass(brl < 0 ? 'f-down' : 'f-up').html('￥' + brl.toFixed(2));
            });
        },
        tools: {
            'placeGetholderFocus': function (plchder) {
                var placeGetholder = plchder;
                var vl = $(this).val();
                if (vl === placeGetholder) {
                    $(this).val('').css({'color': '#333'});
                }
            },
            'placeGetholderBlur': function (plchder) {
                var vl = $(this).val();
                if (vl === '') {
                    $(this).val(plchder).css({'color': '#999'});
                }
            },
            'priceChange': function (pce) {
                var price = pce;
                if (price.indexOf('.') !== -1) {
                    price = price.split('.');
                    price = price[0] + '.' + price[1];
                }

                if (isNaN(price)) {
                    price = 0;
                } else {
                    price = parseFloat(price).toFixed(2);
                }

                return price;
            }
        }
    };

    return calcuOper;
});