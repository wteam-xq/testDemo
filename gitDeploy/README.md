### git 自动化部署测试工程

* 实现自动化部署时，主要改动该目录下文件进行测试；

* 该目录对应的 服务端（nodejs）脚本以及执行shell , 在[测试git工程](https://github.com/wteam-xq/testGit)中;


### 该工程的简单部署
* 本工程实现 gulp 自动化部署，实现sass开发以及前端上线前去缓存：[gulp-sass：不依赖ruby环境使用sass](https://www.npmjs.com/package/gulp-sass) ，[gulp-rev-collector：前端上线前去缓存](https://www.npmjs.com/package/gulp-rev-collector)；

* 在本项目的顶级目录[testDemo](https://github.com/wteam-xq/testDemo)打开'gulp/'；(本工程的部署代码写在`gulp/gulpfile.js`中)
* 在上述路径下执行**gulp**指令：
```
gulp gitDeploy
``` 