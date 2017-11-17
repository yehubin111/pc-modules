/**
 * Created by viruser on 2017/11/6.
 */
require(['menu', 'mktheader', 'switch'], function (mn, mheader, swh) {
    new swh.pageSwitch($('#pageturn'), {
        ifInput: true,
        pageTotal: 120,
        prevCallback: null,
        nextCallback: null,
        clickCallback: null
    });

    function newFund() {
        this._data = {
            companyUrl: '/mInterface/jjgs.txt',  // 基金公司list
            companyList: null
        };

        this.init();
    }

    newFund.prototype = {
        init: function () {
            var self = this;
            // 获取公司列表
            this.tools.getCompany.call(self);
            // 基金公司
            this.setCompanySelect();
        },
        setCompanySelect: function () {
            var idx = -1;
            var self = this;

            $('#companySelect').on({
                'mouseenter': function () {
                    $(this).addClass('hon');
                    // $('#companyList').show();

                    idx = $(this).index();
                    var lter = $(this).text();

                    self.tools.letterToCompany.call(self, lter);
                },
                'mouseleave': function () {
                    $(this).removeClass('hon');
                    // $('#companyList').hide();
                }
            }, '.letter');

            // // 不限
            // $('#companySelect .limit').off().click(function () {
            //     if ($(this).hasClass('on')) return;
            //
            //     $('#companySelect li').removeClass('on');
            //     $(this).addClass('on');
            //
            //     self.conditionAdmin.call(self, 'clear', 'company');
            // });

            $('#companyList').hover(function () {
                $('#companySelect li').eq(idx).addClass('hon');
                // $('#companyList').show();
            }, function () {
                $('#companySelect li').eq(idx).removeClass('hon');
                // $('#companyList').hide();
            });

            // $('#companyList').on('click', 'span', function () {
            //     $('#companySelect .limit').removeClass('on');
            //     $('#companySelect li').eq(idx).addClass('on');
            //
            //     var str = $(this).text();
            //     var orgid = $(this).attr('data-orgid');
            //     var key = orgid;
            //
            //     self.conditionAdmin.call(self, 'add', 'company', key, idx, str);
            // });
        },
        tools: {
            getCompany: function () {
                var self = this;
                $.get(self._data.companyUrl, function (data) {
                    var ar = eval('(' + data + ')');

                    self._data.companyList = ar;
                    var lt = [];
                    var str = '';
                    $.each(ar, function (i, v) {
                        var slt = lt.join(',');
                        if (slt.indexOf(v.namesign) == -1)
                            lt.push(v.namesign);
                    });
                    $.each(lt, function (i, v) {
                        str += '<li class="letter">' + v + '</li>';
                    });
                    $('#companySelect').find('.letter').remove();
                    $('#companySelect').append(str);

                    self.tools.letterToCompany.call(self, 'A');
                });
            },
            letterToCompany: function (letter) {
                var self = this;
                var str = '';
                $.each(self._data.companyList, function (i, v) {
                    if (v.namesign == letter) {
                        str += '<span data-orgid="' + v.orgid + '">' + v.shortname + '</span>';
                    }
                });

                $('#companyList').html(str);
            }
        }
    };

    new newFund();
});