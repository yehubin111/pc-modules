/**
 * Created by viruser on 2017/11/1.
 */

define([], function () {
    window.sso = new htsso();
    window.modifyUserInfo = function (name) {
        if (name) {
            if ($('#logined').length > 0) {
                $('#logined .username').html(name);
            } else {
                var str = '<div class="logined" id="logined" style="display: none;">'
                    + '<span class="username">' + name + '</span>'
                    + '<span class="quit" onclick="location.href=\'//upass.10jqka.com.cn/logout?redir=\' + encodeURIComponent(\'//\' + \'upass.\' + window.location.host.split(\'.\').slice(1).join(\'.\').split(\':\').shift() + \'/logout?redir=\' + encodeURIComponent(window.location.href))">退出</span>'
                    + '</div>';
                $('#login').after(str);
            }

            setTimeout(function () {
                $('#logined').show();
            }, 500);

            $('#login').hide();
        } else {
            $('#login').show();

            $('#logined').remove();
        }
    };
    window.onSsoLogin = function () {
        var escapename = sso.getCookie("escapename");
        var userid = sso.getCookie('userid');
        var uname;
        if (escapename === null) {
            uname = "";
        } else {
            uname = unescape(escapename);
            try {
                ThsLogin.hideLoginBox();
            } catch (e) {
            }
        }
        modifyUserInfo(uname);
    };

    $(function () {
        sso.login(('https:' == document.location.protocol ? 'https://' : 'http://') + window.location.host + '/public/class/sso/reload.html');
        // 首页显示登录
        onSsoLogin();
        $("#login").on('click', function () {
            ThsLogin.showLoginBox(('https:' == document.location.protocol ? 'https://' : 'http://') + window.location.host + '/public/class/sso/login.html');
        });
    });

    return {
        sso: sso,
        modifyUserInfo: modifyUserInfo,
        onSsoLogin: onSsoLogin
    };
});


