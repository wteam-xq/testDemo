### 学习日志
#### 2016-11-30
  * [webpack实现雪碧图功能](http://www.tuicool.com/articles/YZfeeu7)
  * [webpack中文指南](http://webpackdoc.com/)
  * 完成 webpack 生成雪碧图demo

#### 2016-12-01
  * 完成webpack调用scss;(webpack中的sass-loader也得依赖sass环境-意味着也依赖ruby， 真醉！)
  * [sass-loader官网](http://webpackdoc.com/)
  * [webpack调用sass教程](http://www.tuicool.com/articles/2qiE7jN)

#### 2018-04-10
	* 项目需要再次学习 express + webpack 3.x:
	* [Express + Webpack 全栈自动刷新](https://segmentfault.com/a/1190000004505747);
	* [多页架构的前后端分离方案](https://segmentfault.com/a/1190000008644787#articleHeader10);
	* [Webpack 3.x 入门](https://segmentfault.com/a/1190000010871559#articleHeader18);



#### 理想工作流程
1.模块化， 能调用其他js文件，最好CommonJs形式；（webpack）
2.上线前能针对功能模块 代码进行压缩；（gulp）
3.能清除线上的缓存文件;(时间戳 gulp-rev配合gulp-rev-collector 引入文件添加版本号)
4.线上能调试， 在地址栏加入对应的参数可以查看到没压缩前的代码；（研究中）
5.很方便上线（github中转, 本地代码提交到github, 服务器对应工程git pull）: git自动化部署；
