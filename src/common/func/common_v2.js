/**
 * Created by 2016101901 on 2017/6/6.
 */
define([], function () {
    var cm = (function () {
        return {
            //时间格式化 yyyy-MM-dd HH:mm:ss(标准格式，区分大小写)
            timeFormat: function(time, type){
                var newdate = new Date();
                newdate.setTime(time);
                var nyear = newdate.getFullYear();
                var ftime = type;
                var dateitems = {
                    'M': newdate.getMonth() + 1,
                    'd': newdate.getDate(),
                    'H': newdate.getHours(),
                    'm': newdate.getMinutes(),
                    's': newdate.getSeconds()
                };
                //替换年份
                if (/(y+)/.test(ftime)) {
                    ftime = ftime.replace(RegExp.$1, nyear);
                }
                //替换月份以及其他的
                for (var i in dateitems) {
                    if (new RegExp('(' + i + '+)').test(ftime)) {
                        ftime = ftime.replace(RegExp.$1, RegExp.$1.length === 1 ? dateitems[i] : ('00' + dateitems[i]).substring(('' + dateitems[i]).length));
                    }
                }
                return ftime;
            },
            //手机号码验证
            phoTest: function (pho) {
                var phoformat = /^1[3|4|5|7|8]\d{9}$/;
                if (!phoformat.test(pho)) {
                    return false;
                } else {
                    return true;
                }
            },
            //a标签跳转
            attributeLink: function (url, target) {
                var a = document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('target', target);
                $('body').append(a);
                a.click();
                setTimeout(function () {
                    a.remove();
                }, 0);
            },
            //弹出框
            boxShow: function (options) {
                var defaults = {
                    key: 'data-lang', //目标弹框
                    cls: '',  // on class
                    action: 'mouseenter',  //动作
                    ifout: true,
                    iftoggle: false,
                    showCallback: null,
                    hideCallback: null,
                    showbeforeCallback: null
                }, opt, ts = this;

                this.init = function () {
                    opt = $.extend({}, defaults, options);
                    $(ts).on(
                        opt.action, itsShow
                    );
                    if (opt.iftoggle) {
                        $($(ts).attr(opt.key)).on({
                            click: function (e) {
                                e.stopPropagation();
                            }
                        })
                    }
                    if (opt.ifout) {
                        $(ts).on(
                            'mouseleave', itsHide
                        );
                    }
                };

                function itsShow() {
                    var tskey = ts;
                    var idx = $(ts).index();
                    if (opt.key != '') {
                        tskey = $(this).attr(opt.key);
                    }
                    if ($.type(opt.showbeforeCallback) == 'function') {
                        if (opt.showbeforeCallback.call(tskey, idx) == false) {
                            return false;
                        }
                    }
                    if (opt.cls != '') {
                        $(ts).addClass(opt.cls);
                    }

                    if (opt.iftoggle) {
                        $(tskey).toggle();
                    } else {
                        $(tskey).show();
                    }

                    if ($.type(opt.showCallback) == 'function') {
                        opt.showCallback(idx);
                    }
                }

                function itsHide() {
                    var tskey = $(ts);
                    var idx = $(ts).index();
                    if (opt.key != '') {
                        tskey = $(this).attr(opt.key);
                    }
                    if (opt.cls != '') {
                        $(ts).removeClass(opt.cls);
                    }
                    $(tskey).hide();
                    if ($.type(opt.hideCallback) == 'function') {
                        opt.hideCallback(idx);
                    }
                }

                this.init();
            },
            ajaxJSON: function (url, suess, type, cache, data) {
                var self = this;
                $.ajax({
                    url: url,
                    type: type || 'GET',
                    dataType: 'json',
                    cache: cache || true,
                    data: data || '',
                    success: function (data) {
                        suess.call(self, data);
                    },
                    error: function (xml, st) {
                        console.log(url);
                        console.log(st);
                    }
                });
            },
            ajaxJSONP: function (url, suess, jsonp, jback, type, cache, data) {
                $.ajax({
                    url: url,
                    type: type || 'GET',
                    dataType: 'jsonp',
                    jsonp: jsonp,
                    jsonpCallback: jback,
                    cache: cache || true,
                    data: data || '',
                    success: function (data) {
                        suess(data);
                    },
                    error: function (xml, st) {
                        console.log(url);
                        console.log(st);
                    }
                });
            }
        }
    })();

    return cm;
});