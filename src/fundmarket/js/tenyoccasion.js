/**
 * Created by viruser on 2017/11/2.
 */
require(['menu', 'mktheader', 'switch'], function (mn, mheader, swh) {
    new swh.pageSwitch($('#pageturn'), {
        ifInput: true,
        pageTotal: 22,
        prevCallback: null,
        nextCallback: null,
        clickCallback: null
    });
});