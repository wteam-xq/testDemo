/*
参考代码网址：
http://www.gruntjs.net/getting-started
 */
// 执行压缩、合并代码、优化图片 操作
module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //清除目录
    clean: {
      all: ['dist/*'],
      unImg: ["dist/*", "!dist/images"]
    },
    // 复制文件
    copy: {
      main: {
        files: [
          {expand: true, src: ['index.html', 'favicon.ico'], dest: 'dist'}
        ]
      }
    },
    //压缩图片
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7,
          pngquant: true
        },
        files: [{expand: true, 
            cwd: 'images/', 
            src: ['**/*.{png,jpg,jpeg,gif,webp,svg}'], 
            dest: 'dist/images'
        }]
      }
    }
  });
  // 加载任务的插件
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  // 压缩图片任务
  grunt.registerTask('images', ['clean', 'imagemin']);


};