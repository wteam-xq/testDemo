/*************************************************************
 *               gitDeploy项目部署      
 ************************************************************/
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
    minifyHTML = require('gulp-minify-html'),
    // 方便跨文件删除
    vinylPaths = require('vinyl-paths');

// 项目路径
var gitDeployUrl = '';

// 清除文件任务
gulp.task('gitDeploy_clean', function(cb){
    del([gitDeployUrl + 'dist/*', gitDeployUrl + 'rev/*'], {force: true});
    cb();
});

gulp.task('gitDeploy_sass', function(){
    return gulp.src(gitDeployUrl + '*.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(gulp.dest(gitDeployUrl));
});
gulp.task('gitDeploy_sass:watch', function(){
    gulp.watch(gitDeployUrl + '*.scss', ['gitDeploy_sass']);
});
// JS压缩
gulp.task('gitDeploy_js', ['gitDeploy_clean'], function(){
    return gulp.src(gitDeployUrl + '*.js')
        .pipe(uglify())
        .pipe(gulp.dest(gitDeployUrl + 'dist/mini/'));
});
// CSS压缩
gulp.task('gitDeploy_css', ['gitDeploy_js'], function(){
    return gulp.src(gitDeployUrl + '*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(gitDeployUrl + 'dist/mini/'));
});
// css js改名
gulp.task('gitDeploy_rev', ['gitDeploy_css'], function(){
    return gulp.src(gitDeployUrl + 'dist/mini/*')
        .pipe(rev())
        .pipe(gulp.dest(gitDeployUrl + 'dist/'))
        .pipe(rev.manifest('manifest.json'))
        .pipe(gulp.dest(gitDeployUrl + 'rev/'));
});
// 删除原压缩文件
gulp.task('gitDeploy_delMini', ['gitDeploy_rev'], function(cb){
    del([gitDeployUrl + 'dist/mini'], {force: true});
    cb();
});
// 根据上述资源文件，更改调用资源名，压缩html
gulp.task('gitDeploy_final', ['gitDeploy_delMini'], function () {
    return gulp.src([gitDeployUrl + 'rev/manifest.json', gitDeployUrl + 'index.html'])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe( minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe( gulp.dest(gitDeployUrl + 'dist/') );
});

// 组合任务(关系依赖顺序执行， 另也可以 升级gulp或使用插件实现顺序执行)
gulp.task('gitDeploy', function(){
    gulp.start( 'gitDeploy_final' );
});