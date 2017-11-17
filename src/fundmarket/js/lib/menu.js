/**
 * Created by viruser on 2017/8/1.
 */
define(['calculator'], function (cal) {
    $('#menu a').on({
        'mouseenter': function () {
            $(this).find('.icon').stop(true, false).animate({'top': '-40px'}, 200);
            $(this).find('.font').stop(true, false).animate({'top': '0px'}, 200);
        },
        'mouseleave': function () {
            $(this).find('.icon').stop(true, false).animate({'top': '0px'}, 200);
            $(this).find('.font').stop(true, false).animate({'top': '40px'}, 200);
        }
    });

    $(window).on('scroll', function () {
        listScroll('#menu', 466, 328, 50);
    }).trigger('scroll');

    // listScroll(DOM, 从absolute时为止)
    function listScroll(ts, topHt, btmHt, limit) {
        var sTop = $(document).scrollTop();
        var btm = btmHt;
        var domHeight = $(ts).height();
        var btmHeight = sTop + document.documentElement.clientHeight + btm - document.documentElement.scrollHeight;
        var topHeight = sTop + document.documentElement.clientHeight - domHeight - topHt;

        if (topHeight > limit) {
            $(ts).css({
                'position': 'fixed',
                'top': 'auto'
            });
            if (btmHeight > limit) {
                $(ts).css({
                    'bottom': btmHeight
                });
            } else {
                $(ts).css({
                    'bottom': limit
                });
            }
        }else{
            $(ts).css({
                'position': 'absolute',
                'top': topHt,
                'bottom': 'auto'
            });
        }
    };

    //计算器
    // 获取当前基金收益情况
    var calcu = new cal({
        'fundname': '',
        'fundcode': '',
        'closeCallback': closeCallback
    });

    function closeCallback() {
        $('#shadow').hide();
    }

    // $('#tRight').on('click', '#calculator', function () {
    //     $('#useCalculator').show();
    //     $('#shadow').show();
    //     $('#fundInfo .fund').show();
    //     $('#fundInfo input').hide();
    //
    //     var taid = $(this).attr('data-taid');
    //
    //     //默认10000
    //     calcu.getSydata.call(calcu, fundCode);
    //     calcu.goCal.call(calcu, 10000);
    //
    //     _sendKey('click', 'abstract', 1, 1, taid);
    // });

    $('#menu .menu1').click(function () {
        $('#useCalculator').show();
        $('#shadow').show();

        $('#fundInfo .fund').hide();
        $('#fundInfo input').show();

        // tif.calcu.dataClear(true);
        $('#fundMoney input').val(10000).css({'color': '#333'});
    });

    //回到顶部
    $('#menu .gototop').click(function (e) {
        clearInterval(gtop);

        var sTop = $('body').scrollTop();
        var speed = sTop / 20;
        var gtop = setInterval(function () {
            if (sTop == 0) {
                clearInterval(gtop);
            }
            sTop -= speed;
            if (sTop < 0) {
                sTop = 0;
            }
            window.scrollTo(0, sTop);
        }, 15);
    });

    /**
     * 埋点
     */
    $('#menu a').click(function () {
        var idx = $(this).index();
        var r = idx + 1;
        var taid = $(this).attr('data-taid');

        _sendKey('click', 'sidebar', r, 1, taid);
    });

    function _sendKey(action, kword, r, c, taid) {
        var id = 'yzyh-' + kword + '-r' + r + 'c' + c + '-' + action + '-sta-' + taid;
        TA.log({id: id, fid: 'info_gather,ch_fund,fund_files'});
    }
});