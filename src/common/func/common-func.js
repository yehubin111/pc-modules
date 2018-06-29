/**
 * Created by viruser on 2017/11/28.
 */
define(['fdurl'], function (fd) {
    var tools = {
        placeHolder: function (ts, fcallback, bcallback) {
            $(ts).css({ 'color': '#aaa', 'font-weight': 'normal' });
            var pholder = $(ts).val();
            $(ts).on({
                'focus': function () {
                    if ($(ts).val() == pholder) {
                        $(ts).val('').css({ 'color': '#333', 'font-weight': 'bold' });
                        if (fcallback)
                            fcallback.call(this);
                    }
                },
                'blur': function () {
                    if ($(ts).val() == '') {
                        $(ts).val(pholder).css({ 'color': '#aaa', 'font-weight': 'normal' });
                        if (bcallback)
                            bcallback.call(this);
                    }
                }
            });
        },
        infoCheck: function (str, type, otherstr) {
            var vl = str;

            switch (type) {
                case 'phonenum':
                    var reg = otherstr ? /^1[3|4|5|6|7|8|9]\d{1}[\*\d]{4}\d{4}$/ : /^1[3|4|5|6|7|8|9]\d{9}$/;
                    if (!reg.test(vl)) {
                        return [false, '请输入正确的手机号码'];
                    } else {
                        return [true];
                    }
                    break;
                case 'password':
                    var regL = /[a-zA-Z]/i;
                    var regN = /\d/;
                    var regF = /^([a-zA-Z\d]){6,12}$/i;
                    if (vl.length < 6) {
                        return [false, '密码不能少于6位'];
                    }
                    if (vl.match(regF) != null) {
                        if (vl.match(regL) == null) {
                            return [false, '密码不能全数字'];
                        } else if (vl.match(regN) == null) {
                            return [false, '密码不能全英文'];
                        } else {
                            return [true];
                        }
                    } else {
                        return [false, '6-12位数字+英文'];
                    }
                    break;
                case 'passwordagain':
                    if (str == otherstr) {
                        return [true];
                    } else {
                        return [false, '两次密码输入不一致'];
                    }
                    break;
                case 'name':
                    var reg = /^[\u4E00-\u9FA5]+(·?)[\u4E00-\u9FA5]+$/;
                    if (!reg.test(vl)) {
                        return [false, '必须由2-10个中文组成'];
                    }
                    if (vl.length < 2 || vl.length > 10) {
                        return [false, '必须由2-10个中文组成'];
                    }
                    return [true];
                    break;
                case 'idnum':
                    var regFt = /^[a-zA-Z\d]+$/;
                    var area = {
                        11: "北京",
                        12: "天津",
                        13: "河北",
                        14: "山西",
                        15: "内蒙古",
                        21: "辽宁",
                        22: "吉林",
                        23: "黑龙江",
                        31: "上海",
                        32: "江苏",
                        33: "浙江",
                        34: "安徽",
                        35: "福建",
                        36: "江西",
                        37: "山东",
                        41: "河南",
                        42: "湖北",
                        43: "湖南",
                        44: "广东",
                        45: "广西",
                        46: "海南",
                        50: "重庆",
                        51: "四川",
                        52: "贵州",
                        53: "云南",
                        54: "西藏",
                        61: "陕西",
                        62: "甘肃",
                        63: "青海",
                        64: "宁夏",
                        65: "新疆",
                        71: "台湾",
                        81: "香港",
                        82: "澳门",
                        91: "国外"
                    };
                    var vlar = vl.split('');
                    var Y, JYM, S, M;
                    // 位数判断
                    if (vl.length < 18)
                        return [false, '请输入18位身份证号'];
                    // 字符判断
                    if (!vl.match(regFt))
                        return [false, '身份证号码含有非法字符'];
                    // 地区判断
                    var arstr = vl.substring(0, 2);
                    if (!area[arstr])
                        return [false, '身份证地区非法'];
                    //18位身份号码检测
                    //出生日期的合法性检查
                    //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    var t = new Date();
                    var y = t.getFullYear() + '';
                    //获取当前月份(0-11,0代表1月)
                    var mo = t.getMonth() + 1 + '';
                    var d = t.getDate() + '';
                    if (mo.length < 2) {
                        mo = '0' + mo;
                    }
                    if (d.length < 2) {
                        d = '0' + d;
                    }
                    var checkFullGrownDate = y - 18 + mo + d;
                    var checkMaxDate = y - 75 + mo + d;
                    var birthdayValue;
                    var ereg;
                    if (parseInt(vl.substr(6, 4)) % 4 == 0 || (parseInt(vl.substr(6, 4)) % 100 == 0 && parseInt(vl.substr(6, 4)) % 4 == 0)) {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                    } else {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                    }

                    var result = [];
                    $.ajax({
                        url: fd.idcardcheck,
                        dataType: 'JSON',
                        async: false,
                        type: 'GET',
                        data: { "certificateType": 0, "certificateNo": vl },
                        success: function (data) {
                            if (data.code == '0000') {
                                if (data.singleData.pcOpenFlag == "0") {
                                    result = [false, '<b>此身份证号码已开户<br/><a class="f-link" href="/login/loginInit.action" target="_blank">立即登录</a></b>'];
                                } else if (data.singleData.pcOpenFlag == "2") {
                                    if (otherstr)
                                        result = [true];
                                    else
                                        result = [false, '<b>此身份证号码已开户<br/><a class="f-link" href="/login/loginInit.action" target="_blank">立即登录</a></b>'];
                                } else {
                                    result = [true];
                                }
                            } else {
                                result = [true];
                            }

                        }
                    });

                    if (result.length > 0)
                        return result;

                    if (ereg.test(vl)) { //测试出生日期的合法性
                        //计算校验位
                        S = (parseInt(vlar[0]) + parseInt(vlar[10])) * 7
                            + (parseInt(vlar[1]) + parseInt(vlar[11])) * 9
                            + (parseInt(vlar[2]) + parseInt(vlar[12])) * 10
                            + (parseInt(vlar[3]) + parseInt(vlar[13])) * 5
                            + (parseInt(vlar[4]) + parseInt(vlar[14])) * 8
                            + (parseInt(vlar[5]) + parseInt(vlar[15])) * 4
                            + (parseInt(vlar[6]) + parseInt(vlar[16])) * 2
                            + parseInt(vlar[7]) * 1
                            + parseInt(vlar[8]) * 6
                            + parseInt(vlar[9]) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10X98765432";
                        M = JYM.substr(Y, 1); //判断校验位
                        if (M == vlar[17]) {
                            birthdayValue = vl.substr(6, 8);
                            if (birthdayValue > checkFullGrownDate) {
                                return [false, '<b>未满18周岁</br>暂不支持在线开户</b>'];
                            } else if (birthdayValue < checkMaxDate) {
                                return [false, '<b>年满75周岁</br>暂不支持在线开户</b>'];
                            }
                        } else {
                            return [false, '身份证号码不正确'];
                        }
                    } else
                        return [false, '身份证号码不正确'];

                    break;
                case 'bankcard':
                    var reg = /^\d+$/;
                    if (vl.length < 16)
                        return [false, '请输入正确的银行卡'];
                    if (!vl.match(reg))
                        return [false, '请输入正确的银行卡'];
                    return [true];
                    break;
                case 'msgcode':
                    if (vl.length < 6)
                        return [false, '验证码输入错误'];
                    return [true];
                    break;
                case 'adetail':
                    return [true];
                    break;
            }
        },
        // hashchange
        lisHash: function (options) {
            this._data = {
                defaultback: null,
                key: 'pgt',
                part: []
            };

            this.init(options);
        }
    };

    tools.lisHash.prototype = {
        init: function (options) {
            this._data = $.extend({}, this._data, options);

            // IE7
            if (this.ifHashchange())
                this.setHashchange();
            else
                this.setRunhash();
        },
        setHashchange: function () {
            var self = this;
            $(window).on('hashchange', function () {
                self.hchangeFunc();
            });
        },
        setRunhash: function () {
            var self = this;
            setInterval(function () {
                self.hchangeFunc();
            }, 100);
        },
        hchangeFunc: function () {
            var self = this;
            var _hash = self.gethashObj();

            if (_hash[self._data.key] == '' && self._data.defaultback)
                self._data.defaultback();

            $.each(self._data.part, function (i, v) {
                if (_hash[self._data.key] == v.zhash)
                    v.callback();
            });
        },
        sethash: function (key, val) {
            var self = this;
            var zhash = location.hash.substring(1);
            var ar = zhash.split('&') == '' ? [self._data.key + '=""'] : zhash.split('&');

            $.each(ar, function (i, v) {
                var vo = v.split('=');
                if (vo[0] == key)
                    ar[i] = key + '=' + val;
            });

            location.hash = ar.join('&');
        },
        gethashObj: function () {
            var zhash = location.hash.substring(1);
            var ar = zhash.split('&');
            var objar = [];

            if (ar == '')
                return { pgt: '' };

            $.each(ar, function (i, v) {
                var vo = v.split('=');
                objar.push(vo[0] + ':"' + vo[1] + '"');
            });

            var obj = eval('(' + '{' + objar.join(',') + '}' + ')');
            return obj;
        },
        ifHashchange: function () {
            if (('onhashchange' in window) && (document.documentMode === void 0 || document.documentMode > 7)) {
                return true;
            } else {
                return false;
            }
        }
    };

    return tools
});
