/**
 * Created by viruser on 2017/11/1.
 */
define(['search', 'login'], function (Search, lg) {
    /**
     * sso登录
     */
    document.domain = '10jqka.com.cn';
    window.sso = lg.sso;
    window.modifyUserInfo = lg.modifyUserInfo;
    window.onSsoLogin = lg.onSsoLogin;
    /**
     * sso登录
     */

    $.boxShow = function (options) {
        var defaults = {
            key: 'data-lang', //目标弹框
            cls: '',  // on class
            action: 'mouseenter',  //动作
            ifout: 'true',
            showCallback: null,
            hideCallback: null,
            showbeforeCallback: null
        }, opt, ts = this;

        this.init = function () {
            opt = $.extend({}, defaults, options);
            $(ts).off().on(
                opt.action, itsShow
            );
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
                opt.showbeforeCallback(idx);
            }
            if (opt.cls != '') {
                $(ts).addClass(opt.cls);
            }
            $(tskey).show();
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
    };

    //显示隐藏
    $.fn.boxShow = function (options) {
        return this.each(function () {
            $.boxShow.call(this, options);
        })
    };

    //顶部和导航
    $('#newsTop .nt_left li, #newsTop .nt_right li,#nnav li').boxShow();
    $('#nt_navbox, #nt_login, #nt_deal, #nt_guide').boxShow({key: ''});

    // 添加收藏
    function _addFavorite() {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("360se") > -1) {
            alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
        }
        else if (ua.indexOf("msie 8") > -1) {
            window.external.AddToFavoritesBar(url, title); //IE8
        }
        else if (document.all) {//IE类浏览器
            try {
                window.external.addFavorite(url, title);
            } catch (e) {
                alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
            }
        }
        else if (window.sidebar) {//firfox等浏览器；
            window.sidebar.addPanel(title, url, "");
        }
        else {
            alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
        }
    }

    //收藏本站
    $('#ntl_collect').on('click', function () {
        _addFavorite();
    });

    $.format = function (source, params) {
        if (arguments.length == 1) return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };

    new Search({
        type: 'ijjfund,ijjfifund,company',
        searchId: '#topSearch',
        searchBtnFont: '',
        successCallback: '',
        focusCallback: focusCallback,
        blurCallback: blurCallback
    });

    function focusCallback() {
        $('#searchBox').addClass('shfocus');
    }
    function blurCallback() {
        $('#searchBox').removeClass('shfocus');
    }
});