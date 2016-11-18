'use strict';

// 获取 gulp
var gulp = require('gulp'),
    // sass 插件
    sass = require('gulp-sass'),
    // js 压缩插件 （用于压缩 JS）
    uglify = require('gulp-uglify'),
    // 压缩css插件(cssnano将取代gulp-minify-css)
    minifyCSS = require('gulp-minify-css'),
    // 前端去缓存插件
    revCollector = require('gulp-rev-collector'),
    rev = require('gulp-rev'),
    // 清除文件
    del = require('del'),
    // 压缩html(gulp-htmlmin之外的另一插件)
    minifyHTML = require('gulp-minify-html');

// 配置目录
var config = {
    sass: {
        src: 'scss/',
        dest: 'style/'
    },
    img: {
        src: 'scss/',
        dest: 'style/'
    },
    js: {
        src: 'js/'
    }
};
// 输入的第一个参数
var WATCH_SRC = args[0];

// 清除文件任务
gulp.task('gitDeploy_clean', function(cb){
    del([gitDeployUrl + 'dist/*', gitDeployUrl + 'rev/*'], {force: true});
    cb();
});

/*
* 雪碧图合并task，
* 参数1：监听目录；
* 参数2：生成的sass和图片的文件名；
* 参数3：输出目录（非必填）。
* example：gulp sprite --v1 --mySprite
*/
gulp.task('sprite', ['copy:images'], () => {
    var timestamp = + new Date();
    var DEST_SRC = args[2] !== undefined ? args[2] : args[0];
    var DEST_NAME = args[1];
    var spriteData = gulp.src(config.img.src + `${WATCH_SRC}/**/*.png`).pipe(spritesmith({
        imgName: DEST_NAME + '-' + timestamp + '.png',
        imgPath: 'http://file3.qf.56.itc.cn/style/' + `${DEST_SRC}/img/` + DEST_NAME + '-' + timestamp + '.png',
        cssName: '_' + args[1] + '.scss'
    }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe($.imagemin())
        .pipe(gulp.dest(config.img.dest + `${DEST_SRC}/img`));

    var cssStream = spriteData.css
        .pipe(gulp.dest(config.sass.src + `${DEST_SRC}/css`));

    return merge(imgStream, cssStream);
});

