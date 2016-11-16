### 学习日志

[十分钟入门 sass-w3cplus](http://www.w3cplus.com/sassguide/)
[sass中文教程-kancloud](http://www.kancloud.cn/kancloud/sass-tutorial/48498)

* 使用 sass需要配置ruby环境， 另总是会创建 .sass-cache, xxx.css.map。 
* 使用 [gulp-sass](https://www.npmjs.com/package/gulp-sass) 可不用配置ruby环境， 有nodejs环境即可。
* 配置 gitignore ，提交时忽略 .sass-cache, xxx.css.map 文件；
* .sass-cache 路径可配置[资料](http://sass.bootcss.com/docs/sass-reference/#cache_location-option)


### 常用指令
[参考资料](http://www.w3cplus.com/sassguide/compile.html)
* 单文件转换命令：
```
sass demo.scss demo.css
```

* 单文件监听
```
sass --watch demo.scss:demo.css
```

* 文件夹转换
```
sass demoScssFolder:democssFolder
```

* 文件夹监听
```
sass --watch demoScssFolder:democssFolder
```

* 本人喜欢 `compact`样式， 所以一般使用：
```
sass --watch demoScssFolder/demo.scss:demoCssFolder/demo.css --style compact
``` 



