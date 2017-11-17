/**
 * Created by viruser on 2017/11/1.
 */
require(['menu', 'mktheader'], function (mn, mheader) {
    function hotfund() {
        this._data = {
            url: '/web/Hotsale/getHotSale/0_0_{type}_0_1_{amount}_{key}_{sort}',
            ownfundUrl: '/myfund.php?userid={userid}&do={action}&codes={code}',
            ownfundList: [],
            boldIndex: 0,
            userid: ''
        };
        this.btmliststr = [
            '{{#list}}',
            '<ul>',
            '{{#rankFormat}}{{listindex}}{{/rankFormat}}',
            '<li class="w135 mr15 tal">',
            '<p class="name"><a href="/{{code}}" target="_blank">{{name}}</a></p>',
            '<p class="code">{{code}}</p>',
            '</li>',
            '<li class="w65 tal">',
            '<p class="type">{{type}}</p>',
            '<p class="risk">{{levelOfRisk}}</p>',
            '</li>',
            '<li class="w79 tar {{#boldFormat}}month{{/boldFormat}} {{#updownFormat}}{{month}}{{/updownFormat}}">{{month}}%</li>',
            '<li class="w60 tar ml20 {{#boldFormat}}tmonth{{/boldFormat}} {{#updownFormat}}{{tmonth}}{{/updownFormat}}">{{tmonth}}%</li>',
            '<li class="w60 tar ml20 {{#boldFormat}}hyear{{/boldFormat}} {{#updownFormat}}{{hyear}}{{/updownFormat}}">{{hyear}}%</li>',
            '<li class="w60 tar ml20 {{#boldFormat}}year{{/boldFormat}} {{#updownFormat}}{{year}}{{/updownFormat}}">{{year}}%</li>',
            '<li class="w57 tar ml10 {{#boldFormat}}sgfl{{/boldFormat}}">{{tradeInfo.sgfl}}%</li>',
            '<li class="w84 tar ml10 {{#boldFormat}}zdsg{{/boldFormat}}">{{#zdsgFormat}}{{zdsg}}{{/zdsgFormat}}元</li>',
            '<li class="w30 ml10 star" data-code="{{code}}"></li>',
            '<li class="w100 button">',
            '<a href="https://trade.5ifund.com/pc/buy/buy.html?fundCode={{code}}&frm=market_hot" target="_blank" class="buy">购买</a>',
            '<a href="https://trade.5ifund.com/pc/plan/new.html?fundCode={{code}}&frm=market_hot" target="_blank" class="dt">定投</a>',
            '</li>',
            '</ul>',
            '{{/list}}'].join('');

        this.init();
    }

    hotfund.prototype = {
        init: function () {
            var self = this;

            // 获取自选基金
            this.getOwnfund('', '', function () {
                // 获取基金列表
                self.initListData();
            });

        },
        getOwnfund: function (action, code, callback) {
            var self = this;
            // 判断登录情况
            self._data.userid = $.cookie('userid');
            if (!self._data.userid) {
                callback();
                return;
            }
            self._data.ownfundUrl = self._data.ownfundUrl.replace('{userid}', self._data.userid);

            var action = action ? action : 'get';
            var code = code ? code : '';
            var url = self._data.ownfundUrl.replace('{action}', action).replace('{code}', code);

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                cache: true,
                success: function (data) {
                    callback();
                    if (data.data == '999') {
                        return;
                    }
                    if (data.data == '1') {
                        return;
                    }
                    self._data.ownfundList = data.data;
                }
            });
        },
        initListData: function () {
            var self = this;
            // 取各类型年涨幅最高
            $('.flist').each(function () {
                var key = $(this).attr('data-key');

                if (key == 'month') {
                    self.getData.call(self, function (data) {
                        self.dealData.call(self, data, key);
                    }, 'allall', '', '', '10');
                    return true;
                }

                self.getData.call(self, function (data) {
                    self.dealData.call(self, data, key);
                }, key);
            });

            // 添加筛选功能
            $('.flist').find('.sort').on('click', function () {
                var key = $(this).parents('.flist').attr('data-key');
                var st = 'desc';

                self._data.boldIndex = $(this).index();
                if ($(this).hasClass('s-down')) {
                    $(this).removeClass('s-down').addClass('s-up');
                    st = 'asc';
                } else if ($(this).hasClass('s-up')) {
                    $(this).removeClass('s-up').addClass('s-down');
                    st = 'desc';
                } else {
                    $(this).parents('.flist').find('.sort').removeClass('s-down').removeClass('s-up');
                    $(this).addClass('s-down');
                }

                var sortkey = $(this).attr('data-key');

                if (key == 'month') {
                    self.getData.call(self, function (data) {
                        self.dealData.call(self, data, key);
                    }, 'allall', sortkey, st, '10');
                    return true;
                }

                self.getData.call(self, function (data) {
                    self.dealData.call(self, data, key);
                }, key, sortkey, st);

            });
        },
        // 下方列表
        dealData: function (data, ts) {
            var self = this;
            var dt = eval('(' + data + ')').data;
            var str = '';
            var type = ts;
            $.each(dt, function (i, v) {
                var year = v.year;
                if (type == 'hbx') {
                    v.month = v.nhsy;
                    year = v.nhsy;
                }

                if (i == 0 && type != 'month') {
                    $('#' + ts + ' .content .name').html(v.name).attr('title', v.name).attr('href', '/' + v.code);
                    $('#' + ts + ' .content .percent').html('<span>' + year + '</span>%');
                    $('#' + ts + ' .content .button a').attr('href', 'https://trade.5ifund.com/pc/buy/buy.html?fundCode=' + v.code + '&frm=market_hot');
                }

                str += self.conStr.call(self, v, i);
            });

            $('#' + ts + 'List .fund').html(str);

            // 添加自选
            $('#' + ts + 'List .fund ul .star').on('click', function () {
                self.addOrDel.call(this, self);
            });

            // 无自选基金情况
            if (self._data.ownfundList == '')
                return;

            $('#' + ts + 'List .fund ul').each(function () {
                var code = $(this).find('.star').attr('data-code');

                self.setOwnStar.call(self, $(this).find('.star'), code);
            });
        },
        addOrDel: function (sf) {
            var self = sf;
            if (!self._data.userid) {
                alert('请先登录');
                location.href = 'http://upass.10jqka.com.cn/login?redir=HTTP_REFERER';
                return;
            }

            var code = $(this).attr('data-code');
            var action = '';
            var tip = '';
            if ($(this).hasClass('staron')) {
                $(this).removeClass('staron');
                action = 'del';
                tip = '删除自选基金成功';
            } else {
                $(this).addClass('staron');
                action = 'add';
                tip = '添加自选基金成功';
            }

            self.getOwnfund(action, code, function () {
                alert(tip);
                // 更新自选条件list
                if (action == 'add') {
                    var str = '{code: "' + code + '"}';
                    self._data.ownfundList['kfs'].push(eval('(' + str + ')'));
                } else {
                    var ifout = false;
                    $.each(self._data.ownfundList, function (i, v) {
                        if (!v) {
                            return true;
                        }
                        $.each(v, function (m, n) {
                            if (!n) {
                                return true;
                            }
                            if (n.code == code) {
                                ifout = true;
                                n.code = null;
                                return false;
                            }
                        });

                        if (ifout) return false;
                    });

                    return;
                }
            })
        },
        setOwnStar: function (ts, code) {
            var self = this;
            var ifout = false;
            $.each(self._data.ownfundList, function (i, v) {
                if (!v) {
                    return true;
                }
                $.each(v, function (m, n) {
                    if (!n) {
                        return true;
                    }
                    if (n.code == code) {
                        ifout = true;
                        $(ts).addClass('staron');
                        return false;
                    }
                });

                if (ifout) return false;
            })
        },
        conStr: function (v, i) {
            var self = this;
            v.listindex = i;

            var dt = {
                list: v,
                boldFormat: function () {
                    return function (text, render) {
                        console.log(self._data.boldIndex);
                        var bidx = self._data.boldIndex;
                        var key = render(text);
                        var cls = '';

                        switch(bidx){
                            case 3:
                                if(key == 'month')
                                    cls = 'bold';
                                break;
                            case 4:
                                if(key == 'tmonth')
                                    cls = 'bold';
                                break;
                            case 5:
                                if(key == 'hyear')
                                    cls = 'bold';
                                break;
                            case 6:
                                if(key == 'year')
                                    cls = 'bold';
                                break;
                            case 7:
                                if(key == 'sgfl')
                                    cls = 'bold';
                                break;
                            case 8:
                                if(key == 'zdsg')
                                    cls = 'bold';
                                break;
                        }

                        return cls;
                    }
                },
                zdsgFormat: function () {
                    return function (text, render) {
                        return parseInt(render(text)).toFixed(2);
                    }
                },
                updownFormat: function () {
                    return function (text, render) {
                        if (parseFloat(render(text)) < 0)
                            return 'f-down';
                        else {
                            return 'f-up';
                        }
                    }
                },
                rankFormat: function () {
                    return function (text, render) {
                        var str = '';
                        switch (render(text)) {
                            case '0':
                                str = '<li class="w65 mr20 rank first"></li>';
                                break;
                            case '1':
                                str = '<li class="w65 mr20 rank second"></li>';
                                break;
                            case '2':
                                str = '<li class="w65 mr20 rank third"></li>';
                                break;
                            default:
                                str = '<li class="w65 mr20 rank">' + (parseInt(render(text)) + 1) + '</li>';
                                break;
                        }

                        return str;
                    }
                }
            };
            var html = Mustache.render(self.btmliststr, dt);

            return html;
        },
        getData: function (callback, type, key, sort, amount) {
            var self = this;
            var url = self._data.url.replace('{type}', type ? type : 'all').replace('{key}', key ? key : '0').replace('{sort}', sort ? sort : '0').replace('{amount}', amount ? amount : '5');

            $.get(url, function (data) {
                if (callback)
                    callback.call(self, data);
            });
        }
    };

    new hotfund();
});