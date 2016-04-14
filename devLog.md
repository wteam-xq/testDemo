### 开发计划
* 学习 ECMAScript 5 6；
* webpack 学习
* nginx 学习（windows 配置线上 Debug代码映射）
* 学习完nginx webpack开始准备tkd_v3（模块化、个人工程部署、全栈实现）开发
* utils库 更新（localStorage IE 主流浏览器兼容代码）

* 下月博文： 浅谈浏览器本地缓存，webStorage中 cookies暂不调用utils/cookieUtil.js库；utils新增 localStorage库（兼容IE版）；
* 博文简介： 目前浏览器支持的缓存5种，实际开发中经常使用3种；
* 本周计划：20160409-20160410: 单页面路由实现研究；
* others
  * nodejs 短信系统调试(超时处理, 后台如何不奔溃)
  * webpack 模块化学习， tkd_v3 开发;

### 开发日志
* 20150629 tr 设置了border无效
* 解决方案：table设置 border-collapse 为collapse, border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是象在标准的 HTML 中那样分开显示。
* 20150712 给canvas标签添加控制宽高的样式后，绘制出来的宽高会异常；
* 解决方案： 不用样式控制宽高，使用属性控制之。
* 20150714 canvas context.translate 改动后会将设置保存在内存中（下次获取 该元素的context位置还是translate后的）
* 解决方案： 使用完后将位置变回去， es： context(100, 100); afater used: context(-100, -100);
* 20150721 canvas ctx.getImageData方法： 读取图像文件需要tomcat服务器环境
* 20150724 canvas ctx.globalCompositeOperation 作用区间是整个canvas画布，演示所有参数得使用ctx.createPattern在画布上绘制画布。
* 解决方案： 新生成一个canvas节点， 然后在这个节点操作合成。
* 20150809 统一项目文件命名风格：文件夹使用蛇形命名法，如:syntax_highlighter, 文件使用驼峰命名法，如：angularRoute.html
* 20150831 编码风格， 文件使用驼峰命名法，如：angularRoute.html这样不妥， 当出现表示版本号的多个数字时会出问题；（还是得改回 文件夹驼峰、文件蛇形）
* 2015年9月25日 开始维护请假同事代码，研究其代码风格编写博文代码：vue/vue_vs_jquery.html中脚本实现。
* 2015-10-16 vue.js 如何实现新增表单操作（在不操作dom的情况下）， 思考如何VUE 完成 jq实现中
* 解决方案：从样式上解决，正常文档流布局display:inline-block; text-align:justify; 两端对齐
* 2015-11-9 滚动条代码优化,前端实现自动滚动（每隔5秒向上滚动）效果，只有滚动条数大于2时滚动；鼠标放置上面停止滚动，移开继续滚动；
* 优化方案：
* 1.在 操作dom时 隐藏， 操作完后出现；
* 2. dom 动画 脱离文档流，使用 position: absolute; fixed;等
* 3.尽量少 获取导致 回流（reflow）的全局样式值， 例如 offsetTop(left Height Width)  top left;  
* 2015-11-16 浏览器缓存方案总结: 2015，研究IE使用 userData模拟localStorage方案；

### 遗留bug:
1.项目中 IE8下，弹出层bug无法重现；（challenge_case/IE8_position）
2.IE7 中（模拟）使用json2.js 堆栈溢出报错；

### 设计本项目代码的笔试题：

* 2014面试题大全（141101 更新）：
  [2014年最新前端开发面试题](http://clisvoi.blog.163.com/blog/static/2014980502014327104119515/)  
  [腾讯面试](http://www.w3cfuns.com/article-5598237-1-1.html)  
  [跳槽必看](http://developer.51cto.com/art/201202/314618.htm)  
  [常见问题](http://www.csdn.net/article/2012-10-18/2810902-Front-end-Developer-Interview-Questions)  
* 150302(更新)  
  [简历模板](https://github.com/hacke2/ResumeSample)
* 我最近收藏的题库(150629更新)：  
  [魅族前端面试题](http://weibo.com/p/1001603857375168721423)  
  [人人面试题](http://www.w3cfuns.com/thread-5591957-1-1.html)  
  [阿里前端面试题](http://www.w3cfuns.com/thread-5598563-2-1.html)  
  [腾讯面试题](http://www.w3cfuns.com/article-5599657-1-1.html)   
  [年后跳槽那点事：乐视+金山+360面试之行](http://www.cnblogs.com/lvdabao/p/3660707.html)  
  [阿里前端面试题上线](http://fatesinger.com/2722.html)  
  [拉勾网js面试题](http://www.cnblogs.com/52cik/p/js-question-lg.html)  
  [前端面试](http://www.cnblogs.com/allenxing/p/3724382.html)  
  [Web开发笔试面试题 大全](http://mianshiti.diandian.com/)  
  [前端开发面试题](http://segmentfault.com/a/1190000000465431)  
  [2014最新面试题](http://www.html-js.com/article/1743)  
  [2014最新前端面试题](https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions)  
  [百度面试](https://github.com/fex-team/interview-questions)  
  [面试题](http://www.w3cfuns.com/forum.php?mod=forumdisplay&fid=51&filter=typeid&typeid=177)  
  [前端工作面试问题](https://github.com/darcyclarke/Front-end-Developer-Interview-Questions/tree/master/Chinese)  
  [前端开发面试题](http://segmentfault.com/a/1190000000465431)  
  [5个经典的前端面试问题](http://ourjs.com/detail/5%E4%B8%AA%E7%BB%8F%E5%85%B8%E7%9A%84%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95%E9%97%AE%E9%A2%98)  
  [最全前端面试问题及答案总结](http://segmentfault.com/a/1190000002562454)  
  [如何面试一名前端开发工程师？](http://www.html-js.com/article/Large-search-front-team-column%202961)  
  [世上最全面试题](https://github.com/hawx1993/Front-end-Interview-questions)

  