/**
 * Created by viruser on 2017/11/8.
 */
require(['menu', 'mktheader', 'loading', 'fdurl'], function (mn, mheader, ld, fd) {
    function setFocus() {
        this._data = {
            piclength: $('#topFocus .pic li').length,
            runFunc: null,
            disOn: 0
        };

        this.init();
    }

    setFocus.prototype = {
        init: function () {
            if (this._data.piclength < 2)
                return;

            $('#topFocus .pic li').not('.on').css({
                'opacity': '0',
                'filter': 'alpha(opacity=0)',
            });
            $('#topFocus .pic .on').addClass('next');

            // 设置定时任务
            this.focusRun();
            // 设置控制按钮
            this.setControl();
        },
        focusRun: function () {
            var self = this;
            $('#topFocus .pic').on({
                'mouseenter': function () {
                    clearInterval(self.runFunc);
                },
                'mouseleave': function () {
                    self.runFunc = setInterval(function () {
                        self.runFc.call(self);
                    }, 5300);
                }
            }).trigger('mouseleave');
        },
        runFc: function () {
            this._data.disOn++;
            if (this._data.disOn == this._data.piclength)
                this._data.disOn = 0;
            this.indexToChange.call(this);
        },
        setControl: function () {
            var str = '';
            var self = this;
            for (var i = 0; i < self._data.piclength; i++) {
                if (i == 0)
                    str += '<span class="on"></span>';
                else
                    str += '<span></span>';
            }
            $('#topFocus .turn').show().find('.t-box').html(str);

            $('#topFocus .turn span').click(function () {
                if ($(this).hasClass('on'))
                    return;

                self._data.disOn = $(this).index();
                self.indexToChange.call(self);
                // 点击之后重置定时器任务
                clearInterval(self.runFunc);
                self.runFunc = setInterval(function () {
                    self.runFc.call(self);
                }, 5300);
            });
        },
        indexToChange: function () {
            var self = this;
            $('#topFocus .pic .on').removeClass('on');
            $('#topFocus .pic li').eq(self._data.disOn).addClass('on');

            setTimeout(function(){
                $('#topFocus .pic li').eq(self._data.disOn).css({
                    'opacity': '100',
                    'filter': 'alpha(opacity=100)'
                });
            }, 100);

            setTimeout(function () {
                $('#topFocus .pic .next').removeClass('next').css({
                    'opacity': '0',
                    'filter': 'alpha(opacity=0)',
                });

                $('#topFocus .pic .on').addClass('next');
            }, 400);

            $('#topFocus .turn span').removeClass('on').eq(self._data.disOn).addClass('on');
        }
    };
    // 轮播图
    new setFocus();

    // 喜欢and关注
    function likeAttention() {
        this._data = {
            userid: $.cookie('userid'),
            gusloading: null,
            likeUrl: fd.fromsy,
            loginLikeurl: fd.likedata,
            likeArr: '',
            syArr: ''
        };

        this.init();
    }

    likeAttention.prototype = {
        init: function () {
            var self = this;
            var tsrun;
            if (!this._data.userid) {
                $('#tOwnfund .title li').eq(1).attr('data-lang', '#loginBox');
            } else {
                $('#tOwnfund .title li').eq(1).attr('data-lang', '#ownFund');
            }

            // tab
            this.moduleTab();

            // 猜你喜欢
            this.getGuesslike();
            // 刷新
            $('#tOwnfund .title .update').click(function () {
                var ts = $(this);
                if (!self._data.userid) {
                    self.getSydata(true);
                } else {
                    self.useridTodata(true);
                }

                clearTimeout(tsrun);

                ts.addClass('on');
                tsrun = setTimeout(function () {
                    ts.removeClass('on');
                }, 300);
            });
        },
        moduleTab: function () {
            $('#tOwnfund .title li').click(function () {
                var lang = $(this).attr('data-lang');
                if (!$(lang).is(':hidden'))
                    return;

                $('#tOwnfund .title li').removeClass('on');
                $(this).addClass('on');
                $('.o-module').hide();
                $(lang).show();
            });
        },
        getGuesslike: function () {
            this.gusloading = new ld({boxId: '#guessLike'});

            if (!this._data.userid) {
                this.getSydata.call(this);
            } else {
                this.useridTodata.call(this);
            }
        },
        useridTodata: function (ifrandom) {
            var self = this;
            var flike = localStorage.getItem('fundlike');
            var info = '';

            if (flike) {
                if (ifrandom) {
                    self.randomData.call(self, flike, 20);
                } else {
                    self.topSydata.call(self, flike);
                }
            } else {
                var url = this._data.loginLikeurl.replace('{userid}', this._data.userid);
                this.fromAjax(url, function (data) {
                    var dd = data.data;
                    dd = dd.sort(self.tools.likeSort);
                    var ofund = [];

                    $.each(dd, function (i, v) {
                        var str = v.name + '_' + v.code + '_';

                        //如果是货币型，则获取七日年化收益
                        if (v.type == 'hbx') {
                            str += v.nhsy + '_';
                        } else {
                            str += v.year + '_';
                        }

                        str += v.type;

                        ofund.push(str);
                    });
                    self._data.likeArr = ofund;
                    info = ofund.join('|');

                    localStorage.setItem('fundlike', info);

                    if (ifrandom) {
                        self.randomData.call(self, info, 20);
                    } else {
                        self.topSydata.call(self, info);
                    }
                });
            }
        },
        getSydata: function (ifrandom) {
            var self = this;
            var str = '';
            var url = this._data.likeUrl;

            // 第一次进来按收益 点击刷新随机取数据
            if (ifrandom) {
                self.randomData.call(self, self._data.syArr.join('|'), 60);
            } else {
                this.fromAjax(url, function (data) {
                    var dd = data;
                    var ar = [];
                    var disar = [];

                    $.each(dd, function (i, v) {
                        var vr = v.name + '_' + v.code + '_';

                        //如果是货币型，则获取七日年化收益
                        if (v.type == 'hbx') {
                            vr += v.totalnet + '_';
                        } else {
                            vr += v.year + '_';
                        }

                        vr += v.type;

                        ar.push(vr);
                        // 获取收益最高前五个
                        if (disar.length < 4){
                            disar.push(vr);
                            str += self.tools.lineStr(vr.split('_'));
                        }
                    });

                    // 全部数据
                    self._data.syArr = ar;
                    $('#guessLike').html(str);
                });
            }
        },
        randomData: function (data, length) { // length：数据条数
            var self = this;
            var dar = data.split('|');
            var str = '';
            var rdar = [];

            while (rdar.length < 4) {
                var rdm = Math.random();
                var num = parseInt(rdm * length);
                if (!self.tools.arrIndexOf(rdar, num)) {
                    rdar.push(num);
                }
            }

            $.each(rdar, function (i, v) {
                var vr = dar[v].split('_');

                str += self.tools.lineStr(vr);
            });

            $('#guessLike').html(str);
        },
        topSydata: function (data) {
            var self = this;
            var dar = data.split('|');
            var str = '';
            var idx = 0;

            $.each(dar, function (i, v) {
                var vr = v.split('_');

                str += self.tools.lineStr(vr);

                idx++;
                if (idx == 4) {
                    return false;
                }
            });

            $('#guessLike').html(str);
        },
        fromAjax: function (url, callback) {
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    callback(data);
                }
            });
        },
        tools: {
            // 数组indexof
            arrIndexOf: function (arr, str) {
                var ifhas = false;
                $.each(arr, function (i, v) {
                    if (v == str) {
                        ifhas = true;
                        return false;
                    }
                });

                return ifhas;
            },
            likeSort: function (a, b) {
                return b.year - a.year;
            },
            lineStr: function (data) {
                var vr = data;
                var kword = '近一年收益率';
                var val = parseFloat(vr[2]).toFixed(2);
                // 如果是货币型基金，则显示七日年化收益
                if (vr[3] == 'hbx') {
                    kword = '七日年化收益';
                    val = parseFloat(vr[2]).toFixed(4);
                }

                var str = '';
                str += '<div class="f-fund">'
                    + '<div class="left">'
                    + '<a href="/' + vr[1] + '/" target="_blank" class="name f-link" data-code="' + vr[1] + '">' + vr[0] + '</a>'
                    + '<p class="code">' + vr[1] + '</p>'
                    + '</div>'
                    + '<div class="right">'
                    + '<b class="percent f-red">' + val + '%</b>'
                    + '<p class="unit">' + kword + '</p>'
                    + '</div>'
                    + '</div>';

                return str;
            }
        }
    };
    new likeAttention();
});