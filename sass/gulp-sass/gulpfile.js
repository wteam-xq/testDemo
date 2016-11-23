'use strict';

// 获取 gulp
var gulp = require('gulp'),
    // 模块化管理插件
    $ = require('gulp-load-plugins')(),
    // 雪碧图生成工具
    spritesmith = require('gulp.spritesmith'),
    // 将文件转化成 stream(流)插件
    buffer = require('vinyl-buffer'),
    // 合并流插件
    merge = require('merge-stream'),
    // 获取执行 gulp 后续的参数
    args = require('get-gulp-args')(),
    // if 判断插件
    gulpif = require('gulp-if'),
    // sass 插件
    sass = require('gulp-sass');

// 输入的第一个参数
var WATCH_SRC = args[0];

/*
* 监听（执行）scss文件，使其转化成css文件
* example: gulp sass --scss
* example: gulp sass:watch --scss
*/
gulp.task('sass', function(){
    return gulp.src(`${WATCH_SRC}/**/*.scss`)
        .pipe(sass({
            sourceComments: 'map',
            outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(gulp.dest('css'));
});

gulp.task('sass:watch', function(){
    gulp.watch(`${WATCH_SRC}/**/*.scss`, ['sass']);
    console.dir('=== watch src with ' + `${WATCH_SRC}/**/*.scss`, { colors: true });
});

/*
* 压缩CSS样式
* example: gulp css:min --scss
*/
gulp.task('css:min', function(){
    return gulp.src(`${WATCH_SRC}/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe($.cssmin())
        .pipe(gulp.dest('css'));
});

/*
* 雪碧图合并task( 输出到 scss文件)
* 参数1：执行目录；
* 参数2：生成的sass和图片的文件名；
* 参数3：输出目录（非必填），不填的话输出目录为执行目录
* example：gulp sprite --scss --mySprite
*/
gulp.task('sprite', function(){
    var DEST_SRC = args[2] !== undefined ? args[2] : args[0];
    var DEST_NAME = args[1];
    var spriteData = gulp.src(`${WATCH_SRC}/**/*.png`).pipe(spritesmith({
        imgName: DEST_NAME + '.png',
        imgPath: '../images/' + DEST_NAME + '.png',
        cssName: '_' + DEST_NAME + '.scss'
    }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe($.imagemin())
        .pipe(gulp.dest('images'));

    var cssStream = spriteData.css
        .pipe(gulp.dest(`${DEST_SRC}`));

    return merge(imgStream, cssStream);
});

/*
* 雪碧图合并task( 输出到 css文件 )
* 参数1：执行目录；
* 参数2：生成的sass和图片的文件名；
* example：gulp sprite-css --scss --mySprite_2
*/
gulp.task('sprite-css', function(){
  var DEST_NAME = args[1];
  return  gulp.src(`${WATCH_SRC}/**/*.png`)
              .pipe(spritesmith({
                  imgName: DEST_NAME + '.png',
                  cssName: DEST_NAME + '.css',
                  imgPath: '../images/' + DEST_NAME + '.png'
              }))
              .pipe(gulpif('*.png', gulp.dest('images/')))
              .pipe(gulpif('*.css', gulp.dest('css/')));
});


// 压缩图片(jpg, gif格式)
gulp.task('copy:images', function() {
    return gulp.src(`${WATCH_SRC}/**/*.{jpg,gif}`)
        .pipe($.imagemin())
        .pipe(gulp.dest(`images`));
});
