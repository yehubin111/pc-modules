/**
 * Created by viruser on 2017/11/7.
 */
require(['menu', 'mktheader', 'switch'], function (mn, mheader, swh) {
    function listSwitch() {
        var listlength = $('#planList .p-box ul li').length;

        if (listlength <= 4) {
            return;
        }

        var lastdom = $('#planList .p-box ul li').eq(listlength - 1).clone();
        var wd = 260;
        $('#planList .p-box ul').prepend(lastdom);

        var listlength = $('#planList .p-box ul li').length;
        $('#planList .p-box ul').css({
            'width': listlength * wd,
            'left': '-' + wd + 'px'
        });

        $('#pLeft').click(function () {
            $('#planList .p-box ul').stop(true, false).animate({
                'left': '0px'
            }, 300, function(){
                $('#planList .p-box ul li').eq($('#planList .p-box ul li').length - 1).remove();
                $('#planList .p-box ul').prepend($('#planList .p-box ul li').eq($('#planList .p-box ul li').length - 1).clone());
                $('#planList .p-box ul').css({
                    'left': '-' + wd + 'px'
                });
            });

        });

        $('#pRight').click(function () {
            $('#planList .p-box ul').stop(true, false).animate({
                'left': '-' + wd * 2 + 'px'
            }, 300, function () {
                $('#planList .p-box ul li').eq(0).remove();
                $('#planList .p-box ul').append($('#planList .p-box ul li').eq(0).clone());
                $('#planList .p-box ul').css({
                    'left': '-' + wd + 'px'
                });
            });
        });
    }

    listSwitch();

    new swh.pageSwitch($('#pageturn'), {
        ifInput: true,
        pageTotal: 120,
        prevCallback: null,
        nextCallback: null,
        clickCallback: null
    });

});