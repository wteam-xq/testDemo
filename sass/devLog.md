### 学习日志

[学习资料1](http://www.w3cplus.com/sassguide/)
[学习资料2](http://www.kancloud.cn/kancloud/sass-tutorial/48498)

* 使用 sass总是会创建 .sass-cache, xxx.css.map 么？ 
* 配置 gitignore ，提交时忽略这类文件；

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
sass --watch demoScssFolder:demoCssFolder --style compact
``` 



