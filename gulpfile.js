/**
 * Created by 2016101901 on 2017/4/7.
 */
//导入工具包 require('node_modules里对应模块')
const _ = {
    'gulp': require('gulp'), //本地安装gulp所用到的地方
    'argv': require('yargs').argv,
    'path': require('path'),
    'del': require('del'),
    'fs': require('fs'),
    'express': require('express'),
    'browserSync': require('browser-sync'),
    'requireConfig': require('./require.config.js')
};
const $ = require('gulp-load-plugins')();

var env = '';

const ROOT_PATH = _.path.join(__dirname),
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

const Task = {},
    fc = {};

Task.del = () => {
    _.del([DIST_PATH]).then(() => {
        process.stdout.write('clean complete');
    });
};

Task.js = () => {
    if (_.argv.j) {
        var v = _.argv.j;
        rjspack(v)
    } else {
        _.fs.readdir(SRC_PATH, function (err, files) {
            files.forEach(function (v, i, ar) {
                rjspack(v);
            });
        });
    }

    _.gulp.src(`${SRC_PATH}*/${FILE_PATH.js2}`)
        .pipe(_.gulp.dest(DIST_PATH));
};

rjspack = (v) => {
    if (env == 'development') {
        _.gulp.src(`${SRC_PATH}${v}/${FILE_PATH.js}`)
            .pipe($.plumber({
                errorHandler: fc.errHandler
            }))
            .pipe($.sourcemaps.init())
            .pipe($.requirejsOptimize(_.requireConfig[v]))
            .pipe($.sourcemaps.write())
            .pipe(_.gulp.dest(`${DIST_PATH}${v}/js`));
    } else {
        _.gulp.src(`${SRC_PATH}${v}/${FILE_PATH.js}`)
            .pipe($.plumber({
                errorHandler: fc.errHandler
            }))
            .pipe($.requirejsOptimize(_.requireConfig[v]))
            .pipe(_.gulp.dest(`${DIST_PATH}${v}/js`));
    }
};

Task.image = () => {
    _.gulp.src(`${SRC_PATH}*/${FILE_PATH.image}`)
        .pipe($.imagemin())
        .pipe(_.gulp.dest(DIST_PATH));
};

Task.html = () => {
    var spth = _.argv.j ? _.argv.j : '*';
    var dspth = _.argv.j ? _.argv.j : '';

    _.gulp.src(`${SRC_PATH}${spth}/${FILE_PATH.html}`)
        .pipe($.debug({title: '编译'}))
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(_.gulp.dest(`${DIST_PATH}${dspth}`));
};

Task.less = () => {
    var spth = _.argv.j ? _.argv.j : '*';
    var dspth = _.argv.j ? _.argv.j : '';

    _.gulp.src(`${SRC_PATH}${spth}/${FILE_PATH.less}`)
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
        .pipe($.cleanCss({
            compatibility: 'ie7',
            keepBreaks: true, //保留换行
            keepSpecialComments: '*' //保留私有前缀
        }))
        // .pipe($.sourcemaps.write())
        .pipe(_.gulp.dest(`${DIST_PATH}${dspth}`));

    _.gulp.src(`${SRC_PATH}*/${FILE_PATH.css2}`)
        .pipe(_.gulp.dest(DIST_PATH));
};

Task.port = () => {
    const app = _.express();
    const appData = require('./src/try/try.json');
    const dt = appData.data;
    const apiRouter = _.express.Router();
    apiRouter.get('/fund', (req, res) => {
        res.json({
            data: dt
        })
    });
    app.use('/api', apiRouter);

    const server = app.listen(3030, function () {
        let host = server.address().address;
        let port = server.address().port;

        console.log('====>>listening at locahost:', port);
    });
};

Task.css = () => {
    _.gulp.src(`${SRC_PATH}*/${FILE_PATH.css}`)
        .pipe(_.gulp.dest(DIST_PATH));
};

Task.build = () => {
    _.del([DIST_PATH]).then(() => {
        process.stdout.write('clean complete');

        _.gulp.start('html');
        _.gulp.start('less');
        _.gulp.start('js');
        _.gulp.start('image');
    });
};

Task.newFile = (file) => {
    if (file) {
        _.argv.p = file;
    }
    let path = _.argv.p ? `${SRC_PATH}${$.argv.p}` : SRC_PATH;
    let fileAr = ['css', 'js', 'images', 'templates'];

    fileAr.forEach(function (v, i, ar) {
        let url = `${path}${v}/`;

        if (_.fs.existsSync(url)) {
            process.stdout.write(`${v} already`);
        } else {
            _.fs.mkdir(url, (err) => {
                process.stdout.write(err ? err : `${v} complete`);
            });
        }
    });
};

Task.bsync = () => {
    var path = _.argv.b ? _.argv.b + '/**' : '**';
    _.browserSync.init({
        files: ['./dist/' + path],
        server: {
            baseDir: './dist', // 服务器根目录
            index: '' // 默认打开的页面
        },
        port: 3030
    });
};

Task.createFile = () => {
    Task.newFile();
};

fc.errHandler = (e) => {
    // 输出错误信息
    $.util.log(e);
};


Task.help = () => {
    process.stdout.write(`
    $ gulp build  创建项目，不包括image
    $ gulp **** [-b {folder} server实时更新目录][-j {folder} 编译目标目录]
    $ gulp server  本地server 端口3030
    $ gulp html  编译html
    $ gulp js  编译js
    $ gulp less  编译less 转css
    $ gulp image  
    $ gulp del  删除dist 文件夹
    `);
};

_.gulp.task('js', Task.js);
_.gulp.task('image', Task.image);
_.gulp.task('html', Task.html);
_.gulp.task('less', Task.less);
_.gulp.task('css', Task.css);

_.gulp.task('port', Task.port);
_.gulp.task('del', Task.del);
_.gulp.task('build', Task.build);
_.gulp.task('server', ['watch'], Task.bsync);

_.gulp.task('file', Task.createFile);

_.gulp.task('help', Task.help);


_.gulp.task('watch', () => {
    // $.reload.listen();
    // $.fs.watch(`${ROOT_PATH}/src/`, {recursive: false, encoding: 'buffer'}, (eventType, filename) => {
    //     if ($.fs.existsSync(`${SRC_PATH}${filename}/`) && eventType == 'rename') {
    //         console.log(100);
    //         Task.newFile(`${filename}/`);
    //     } else {
    //         console.log(`${filename}--${eventType}`);
    //     }
    // });
    env = 'development';

    _.gulp.watch('src/*/**/*.less', ['less']);
    _.gulp.watch('src/*/**/*.js', ['js']);
    _.gulp.watch('src/*/*.html', ['html']);
});