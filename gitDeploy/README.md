### git 自动化部署测试工程

* 实现自动化部署时，主要改动该目录下文件进行测试；

* `git push` 前调用 gulp 目录的指令 编译部署该目录下脚本（js）、样式(css)、超文本协议(html), 主要用于前端 **时间戳** 去缓存；

* 该目录对应的 服务端（nodejs）脚本以及执行shell , 在[测试git工程](https://github.com/wteam-xq/testGit)中;

* [测试首页](https://github.com/wteam-xq/testDemo/blob/master/gitDeploy/index.html)


### 该工程的简单部署
* 在本项目的顶级目录[testDemo](https://github.com/wteam-xq/testDemo)打开'gulp/'；(本工程的部署代码写在`gulp/gulpfile.js`中)
* 在上述路径下执行**gulp**指令：
```
gulp gitDeploy
``` 