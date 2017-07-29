### 学习日志
[mock.js官网](http://mockjs.com/)
[mock 服务器搭建教程](http://www.cnblogs.com/jacksundatashare/p/6276714.html)

* 2017-07-26 初步学习mock， 写一个小Demo看效果；
* mock官网使用方式有5种， Nodejs/Bower/RequireJs/Sea.js/Random_CLI;
* 其实就两大类： NPM端（Nodejs/Random_CLI,本地指令监听运行）、bower端（Bower/RequireJs/Sea.js浏览器异步加载）;
* 本demo配置简单的NPM端 mock服务， 然后使用postMan请求模拟；

* 2017-07-27 完成mock监听服务：
* 步骤：
* 1.安装mock模块：`npm install --save-dev mockjs`;
* 2.编写`./demo1.js`中mock代码；
* 3.package.json中配置脚本(`npm run mock1`):
```
"scripts": {
  "mock1":"node mock/demo1.js"
},
```
* 4.启动mock拦截监听服务；
* 5.postMan访问mock拦截的URL；

* 2017-07-28 以json-server作为 mock 服务器；
* 相关教程：[纯手工打造前端后端分离项目中的mock-server](http://www.jianshu.com/p/284590b5b717)
