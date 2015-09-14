/*
参考代码网址：
http://www.ido321.com/1622.html
http://colobu.com/2014/11/17/gulp-plugins-introduction/#gulp-rename
https://github.com/nimojs/gulp-book
 */
// 获取 gulp
var gulp = require('gulp'),
    // js 压缩插件 （用于压缩 JS）
    uglify = require('gulp-uglify'),
    // 压缩css插件
    minifyCSS = require('gulp-minify-css'),
    // 获取 gulp-imagemin 模块
    imagemin = require('gulp-imagemin'),
    // 重命名 插件
    rename = require('gulp-rename'),
    // 压缩html插件
    htmlmin = require('gulp-htmlmin'),
    // 合并文件
    concat = require("gulp-concat"),
    // html 文件对合并文件后的替换处理插件
    htmlReplace = require("gulp-html-replace"),
    // 复制文件（文件拷贝）
    copy = require('copy'),
    // 清除文件
    del = require('del');

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1. 找到文件
    gulp.src('js/*.js')
    // 2. 压缩文件
        .pipe(uglify())
    // new: 压缩前修改压缩后新文件名字
        .pipe(rename( function(path){
          path.basename += "_v.1.2"; 
        } ) )
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist/js'))
});

// 压缩 css 文件
// 在命令行使用 gulp css 启动此任务
gulp.task('css', function () {
    // 1. 找到文件
    gulp.src('css/*.css')
    // 2. 压缩文件
        .pipe(minifyCSS())
    // 3. 另存为压缩文件
        .pipe(gulp.dest('dist/css'))
});

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src('images/*.*')
    // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
    // 3. 另存图片
        .pipe(gulp.dest('dist/images'))
});

// 合并js 任务(合并压缩成功后的 js文件)
gulp.task('concat', function () {
    gulp.src('dist/js/*.js')  //要合并的文件
    .pipe( concat('all.js') )  // 合并匹配到的js文件并命名为 "all.js"
    .pipe( gulp.dest('dist/js') );
});

// 解决 gulp 合并文件后， html调用代码对应替换
gulp.task('htmlreplace', function(){
  gulp.src('canvas_test.html')
      .pipe( htmlReplace({'js': 'js/all.js'}) )
      .pipe( gulp.dest('dist/') );
});
// 压缩html 任务
gulp.task('htmlmin', function () {
    var options = {
        collapseWhitespace: true,//压缩HTML
        //省略布尔属性的值 <input checked="true"/> ==> <input />
        collapseBooleanAttributes: false,
        //删除所有空格作属性值 <input id="" /> ==> <input />
        removeEmptyAttributes: true,
        //删除<script>的type="text/javascript"
        removeScriptTypeAttributes: true,
        //删除<style>和<link>的type="text/css"
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});
// 组合任务： 先替换html再压缩
gulp.task('htmlcomp', function(){
  var options = {
    collapseWhitespace: true,//压缩HTML
    //省略布尔属性的值 <input checked="true"/> ==> <input />
    collapseBooleanAttributes: false,
    //删除所有空格作属性值 <input id="" /> ==> <input />
    removeEmptyAttributes: true,
    //删除<script>的type="text/javascript"
    removeScriptTypeAttributes: true,
    //删除<style>和<link>的type="text/css"
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  gulp.src('canvas_test.html')
      .pipe( htmlReplace({'js': 'js/all.js'}) )
      .pipe( htmlmin(options) )
      .pipe( gulp.dest('dist/') );
});

// 清除文件任务
gulp.task('clean', function(cb){
   del(['dist/*'], cb)
});

// 默认任务
gulp.task('default', ['clean'], function(){
 
});
