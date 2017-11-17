/**
 * Created by 2016101901 on 2017/4/7.
 */
//导入工具包 require('node_modules里对应模块')
const $ = {
    'gulp': require('gulp'), //本地安装gulp所用到的地方
    'argv': require('yargs').argv,
    'path': require('path'),
    'del': require('del'),
    'fs': require('fs'),

    'concat': require('gulp-concat'), //合并文件
    'reload': require('gulp-livereload'), //实时刷新
    'rev': require('gulp-rev-append'), //添加版本号
    'cssclean': require('gulp-clean-css'), //CSS压缩
    'cssrev': require('gulp-make-css-url-version'), //css里的URL添加版本号
    'less': require('gulp-less'), //less编译
    'base64': require('gulp-base64'), //图片转换成base64
    'cssimport': require('gulp-cssimport'), //css import
    'imagemin': require('gulp-imagemin'), //图片压缩
    'autoprefixer': require('gulp-autoprefixer'), //自动补全私有前缀
    'fileinclude': require('gulp-file-include'), //html模块化
    'requirejsOptimize': require('gulp-requirejs-optimize'), //requirejs
    'requireConfig': require('./require.config.js'),
    'debug': require('gulp-debug'),
    'sourcemaps': require('gulp-sourcemaps'),
    'plumber': require('gulp-plumber'), // 错误处理不影响进程
    'util': require('gulp-util')
};

const ROOT_PATH = $.path.join(__dirname),
    SRC_PATH = `${ROOT_PATH}/src/`,
    DIST_PATH = `${ROOT_PATH}/dist/`,
    FILE_PATH = {
        'html': '*.html',
        'less': '{less,css}/*.less',
        'css': '{less,css}/*.css',
        'css2': '*.css',
        'js': 'js/*.js',
        'js2': '*.js',
        'image': 'images/*.{jpg,jpeg,gif,png,ico}'
    };

//定义一个testLess任务（自定义任务名称）
$.gulp.task('reloadcss', function() {
    $.gulp.src('dist/ftxt/**/*.css')
        .pipe($.reload());
});
$.gulp.task('reloadjs', function() {
    $.gulp.src('dist/ftxt/**/*.js')
        .pipe($.reload());
});


const Task = {},
    fc = {};

Task.del = () => {
    $.del([DIST_PATH]).then(() => {
        process.stdout.write('clean complete');
    });
};

Task.js = () => {
    if ($.argv.j) {
        var v = $.argv.j;
        rjspack(v)
    } else {
        $.fs.readdir(SRC_PATH, function(err, files) {
            files.forEach(function(v, i, ar) {
                rjspack(v);
            });
        });
    }

    $.gulp.src(`${SRC_PATH}*/${FILE_PATH.js2}`)
        .pipe($.gulp.dest(DIST_PATH));

    if ($.argv.f) {
        setTimeout(() => {
            $.gulp.src(`${DIST_PATH}${$.argv.f}/${FILE_PATH.js}`)
                .pipe($.reload());
        }, 5000);
    }
};

rjspack = (v) => {
    $.gulp.src(`${SRC_PATH}${v}/${FILE_PATH.js}`)
        .pipe($.plumber({
            errorHandler: fc.errHandler
        }))
        .pipe($.requirejsOptimize($.requireConfig[v]))
        .pipe($.gulp.dest(`${DIST_PATH}${v}/js`));
}

Task.image = () => {
    $.gulp.src(`${SRC_PATH}*/${FILE_PATH.image}`)
        .pipe($.imagemin())
        .pipe($.gulp.dest(DIST_PATH));
};

Task.html = () => {
    var spth = $.argv.j? $.argv.j : '*';
    var dspth = $.argv.j? $.argv.j : '';

    $.gulp.src(`${SRC_PATH}${spth}/${FILE_PATH.html}`)
        .pipe($.debug({ title: '编译' }))
        .pipe($.fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe($.gulp.dest(`${DIST_PATH}${dspth}`));

    if ($.argv.f) {
        setTimeout(() => {
            $.gulp.src(`${DIST_PATH}${$.argv.f}/${FILE_PATH.html}`)
                .pipe($.reload());
        }, 500);
    }
};

Task.less = () => {
    var spth = $.argv.j? $.argv.j : '*';
    var dspth = $.argv.j? $.argv.j : '';

    $.gulp.src(`${SRC_PATH}${spth}/${FILE_PATH.less}`)
        .pipe($.plumber({
            errorHandler: fc.errHandler
        }))
        // .pipe($.sourcemaps.init())
        .pipe($.cssimport({
            matchPattern: '*.{css,less,sass}'
        }))
        .pipe($.less())
        .pipe($.base64({
            exclude: [], //排除 'http://i.thsi.cn/images/'
            maxImageSize: 32 * 1024, // bytes
            debug: true
        }))
        .pipe($.cssclean({
            compatibility: 'ie7',
            keepBreaks: true, //保留换行
            keepSpecialComments: '*' //保留私有前缀
        }))
        // .pipe($.sourcemaps.write())
        .pipe($.gulp.dest(`${DIST_PATH}${dspth}`));

    $.gulp.src(`${SRC_PATH}*/${FILE_PATH.css2}`)
        .pipe($.gulp.dest(DIST_PATH));

    if ($.argv.f) {
        setTimeout(() => {
            $.gulp.src(`${DIST_PATH}${$.argv.f}/${FILE_PATH.css}`)
                .pipe($.reload());
        }, 1000);
    }
};

Task.css = () => {
    $.gulp.src(`${SRC_PATH}*/${FILE_PATH.css}`)
        .pipe($.gulp.dest(DIST_PATH));
};

Task.build = () => {
    $.del([DIST_PATH]).then(() => {
        process.stdout.write('clean complete');

        $.gulp.start('html');
        $.gulp.start('less');
        $.gulp.start('js');
        $.gulp.start('image');
    });
};

Task.newFile = (file) => {
    if (file) {
        $.argv.p = file;
    }
    let path = $.argv.p ? `${SRC_PATH}${$.argv.p}` : SRC_PATH;
    let fileAr = ['css', 'js', 'images', 'templates'];

    fileAr.forEach(function(v, i, ar) {
        let url = `${path}${v}/`;

        if ($.fs.existsSync(url)) {
            process.stdout.write(`${v} already`);
        } else {
            $.fs.mkdir(url, (err) => {
                process.stdout.write(err ? err : `${v} complete`);
            });
        }
    });
};

Task.createFile = () => {
    Task.newFile();
};

fc.errHandler = (e) => {
    // 发出声音提示
    $.util.beep();
    // 输出错误信息
    $.util.log(e);
};


Task.help = () => {
    process.stdout.write(`
    $ gulp build：创建项目;
    $ gulp webpack --folder 目录名称：打包;
    $ gulp minifycss --folder 目录名称：处理css文件;
    $ gulp minimages --folder 目录名称：压缩图片（暂时无效）;
    $ gulp minifyjs --folder 目录名称：处理js文件;
    $ gulp htmlmin --folder 目录名称：处理html文件;
    $ gulp --folder 目录名称：进行所有功能并监听文件;
    $ gulp nohtmlmin --folder 目录名称：进行除压缩html外所有功能并监听文件;
    $ gulp delete --folder 目录名称：删除目标目录dist文件夹;
    `);
};

$.gulp.task('js', Task.js);
$.gulp.task('image', Task.image);
$.gulp.task('html', Task.html);
$.gulp.task('less', Task.less);
$.gulp.task('css', Task.css);

$.gulp.task('del', Task.del);
$.gulp.task('build', Task.build);

$.gulp.task('file', Task.createFile);

$.gulp.task('help', Task.help);


$.gulp.task('watch', () => {
    $.reload.listen();
    // $.fs.watch(`${ROOT_PATH}/src/`, {recursive: false, encoding: 'buffer'}, (eventType, filename) => {
    //     if ($.fs.existsSync(`${SRC_PATH}${filename}/`) && eventType == 'rename') {
    //         console.log(100);
    //         Task.newFile(`${filename}/`);
    //     } else {
    //         console.log(`${filename}--${eventType}`);
    //     }
    // });

    $.gulp.watch('src/*/**/*.less', ['less']);
    $.gulp.watch('src/*/**/*.js', ['js']);
    $.gulp.watch('src/*/*.html', ['html']);
});