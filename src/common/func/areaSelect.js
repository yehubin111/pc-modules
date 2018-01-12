/**
 * Created by viruser on 2017/12/1.
 */
define([], function () {
    function areaSelect(ts, options) {
        this.defaults = {
            step: '3',  // 选项等级 1 只到省 2 到市 3 到区
            provCallback: null,
            cityCallback: null,
            areaCallback: null
        };
        this._data = {
            contain: ts,
            boxDOM: '_selectBox',
            navDOM: 'c_Nav',
            resultDOM: 'c_result',
            provDOM: 'c_Province',
            cityDOM: 'c_City',
            areaDOM: 'c_Area',
            data: AREALIST,
            cityDefault: '\u8bf7\u5148\u9009\u62e9\u7701\u4efd',
            areaDefault: '\u8bf7\u5148\u9009\u62e9\u57ce\u5e02',
            prov: '',
            city: '',
            area: ''
        };
        this.opt = null;

        this.init(options);
    }

    areaSelect.prototype = {
        init: function (options) {
            this.opt = $.extend({}, this.defaults, options);

            // 初始化dom
            this.addHTML();
            // 注入省份
            this.addProvince();
            // tab
            this.setTab();
            // 选择省份 获取城市列表
            this.selectProvince();
            // 选择城市 获取地区列表
            this.selectCity();
            // 选择地区
            this.selectArea();
        },
        setTab: function () {
            var self = this;
            $('#' + self._data.navDOM + ' li').click(function () {
                var lg = $(this).attr('data-lang');
                $('#' + self._data.navDOM + ' li').removeClass('on');
                $(this).addClass('on');

                $('#' + self._data.resultDOM + '>div').hide();
                $(lg).show();
            });
        },
        selectArea: function () {
            var self = this;
            $('#' + self._data.areaDOM).on('click', 'li', function () {
                var key = $(this).attr('data-code');
                var name = $(this).text();

                $('#' + self._data.areaDOM + ' li').removeClass('on');
                $(this).addClass('on');

                self._data.area = name;

                if (self.opt.areaCallback)
                    self.opt.areaCallback(key, self._data.prov + ' ' + self._data.city + ' ' + name);

                if (self.opt.step == '3')
                    $(self._data.contain).hide();
            });
        },
        selectCity: function () {
            var self = this;
            $('#' + self._data.cityDOM).on('click', 'li', function () {
                var key = $(this).attr('data-code');
                var name = $(this).text();

                $('#' + self._data.cityDOM + ' li').removeClass('on');
                $(this).addClass('on');
                $('#' + self._data.navDOM + ' li').eq(2).click();

                self._data.city = name;

                if (self.opt.cityCallback)
                    self.opt.cityCallback(key, self._data.prov + ' ' + name);

                if (self.opt.step == '2') {
                    $(self._data.contain).hide();
                    return;
                }

                var str = '<ul>';
                var dt = self._data.data[key];
                if (dt) {
                    $.each(dt, function (i, v) {
                        str += '<li data-code="' + i + '">' + v + '</li>';
                    });
                    str += '</ul>';
                } else {
                    str = '<p class="default">\u65e0\u76f8\u5173\u5730\u533a</p>';
                }

                $('#' + self._data.areaDOM).html(str);
            });
        },
        selectProvince: function () {
            var self = this;
            $('#' + self._data.provDOM).on('click', 'li', function () {
                var key = $(this).attr('data-code');
                var name = $(this).text();

                $('#' + self._data.provDOM + ' li').removeClass('on');
                $(this).addClass('on');
                $('#' + self._data.navDOM + ' li').eq(1).click();

                self._data.prov = name;

                if (self.opt.provCallback)
                    self.opt.provCallback(key, name);

                if (self.opt.step == '1') {
                    $(self._data.contain).hide();
                    return;
                }

                var str = '<ul>';
                var dt = self._data.data[key];

                if (dt) {
                    $.each(dt, function (i, v) {
                        str += '<li data-code="' + i + '">' + v + '</li>';
                    });
                    str += '</ul>';
                } else {
                    str = '<p class="default">\u65e0\u76f8\u5173\u57ce\u5e02</p>';
                }

                $('#' + self._data.cityDOM).html(str);
            });
        },
        addProvince: function () {
            var self = this;
            var dt = self._data.data['86'];
            var str = '';
            $.each(dt, function (i, v) {
                str += '<div class="_line">'
                    + '<span class="l_letter">' + i + '</span>'
                    + '<ul class="l_prov">';

                $.each(v, function (m, n) {
                    str += '<li data-code="' + n.code + '">' + n.address + '</li>';
                });

                str += '</ul>'
                    + '</div>';
            });

            $('#' + self._data.provDOM).html(str);
        },
        addHTML: function () {
            var self = this;
            var str = '<div class="selectAreabox" id="' + this._data.boxDOM + '"><ul class="c_Nav" id="' + self._data.navDOM + '">';
            switch (this.opt.step) {
                case '1':
                    str += '<li class="on" data-lang="#' + self._data.provDOM + '">\u7701\u4efd</li>'
                        + '</ul>'
                        + '<div class="c_Box" id="' + self._data.resultDOM + '">'
                        + '<div class="sProvince" id="' + self._data.provDOM + '"></div>'
                        + '</div>';
                    break;
                case '2':
                    str += '<li class="on" data-lang="#' + self._data.provDOM + '">\u7701\u4efd</li>'
                        + '<li data-lang="#' + self._data.cityDOM + '">\u57ce\u5e02</li>'
                        + '</ul>'
                        + '<div class="c_Box" id="' + self._data.resultDOM + '">'
                        + '<div class="sProvince" id="' + self._data.provDOM + '"></div>'
                        + '<div class="sCity" id="' + self._data.cityDOM + '" style="display: none;"><p class="default">' + self._data.cityDefault + '</p></div>'
                        + '</div>';
                    break;
                case '3':
                    str += '<li class="on" data-lang="#' + self._data.provDOM + '">\u7701\u4efd</li>'
                        + '<li data-lang="#' + self._data.cityDOM + '">\u57ce\u5e02</li>'
                        + '<li data-lang="#' + self._data.areaDOM + '">\u5730\u533a</li>'
                        + '</ul>'
                        + '<div class="c_Box" id="' + self._data.resultDOM + '">'
                        + '<div class="sProvince" id="' + self._data.provDOM + '"></div>'
                        + '<div class="sCity" id="' + self._data.cityDOM + '" style="display: none;"><p class="default">' + self._data.cityDefault + '</p></div>'
                        + '<div class="sArea" id="' + self._data.areaDOM + '" style="display: none;"><p class="default">' + self._data.areaDefault + '</p></div>'
                        + '</div>';
                    break;
            }
            str += '</div>';

            $(self._data.contain).html(str);
        }
    };

    return areaSelect;
});