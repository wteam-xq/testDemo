### 《前端性能优化链路》 学习小笔记

* [极客时间链接](https://time.geekbang.org/course/intro/257)
* [MARKSHOW 演示](https://mark.show/#)

---
### 01课程介绍
- 讲师10年前端开发经验， 系统学习前端优化；
- 根据讲师内容 + 个人理解，系统整理前端优化链路；

---
### 02课程综述， 六大部分；
- 静态资源优化
- 页面渲染架构设计
- 原生APP优化
- 服务端和网络优化
- 研发开发流程优化
- 全链路质量监控

---
## 静态资源优化

---
### 03图片优化： 图片格式
- 图片格式场景； jpg,png,gif,webp；
- 最新格式图片 下一代图片格式 AVIF（AV1 Image File Format）已经来了，此格式比 JPEG 小 50% 左右、比 WebP 小 20% 左右，相关性能跑分见此，目前 Chrome 85、Firefox 77 已支持；

---

### 04图片优化：加速图片加载
- 压缩图片, [tinypng](https://tinypng.com/), [imagemin-webpack-plugin](https://www.npmjs.com/package/imagemin-webpack-plugin)
- 图片占位符（默认图片）
- 低质图片占位符，[LQIP](https://www.npmjs.com/package/lqip), [SQIP](https://www.npmjs.com/package/sqip)

---

### 05图片优化：服务器端图片优化
- 图片裁剪：按长边、短边、填充、拉伸等缩放
- 图片格式转换： 支持 jpg,png,gif,webp 相互转换，不同图片压缩率等
- 图片处理：添加图片水印、高斯模糊、重心处理、裁剪边框等
- AI能力：智能排版、智能鉴黄、智能配色、智能合成、智能抠图等
- 业界低成本 - 使用 阿里云图片服务；
- 不同业务，使用不同域名

---
### 06HTML优化
- 骨架屏：页面渲染前呈现用户内容
- 压缩合并HTML
- 减少HTML嵌套、使用语义化标签 等
- CSS样式内容放页面头部、JS放HTML底部

---
### 07CSS 优化
- 减少嵌套样式、text-content:-9999px; CSS3动画 等属性少用；
- 避免使用通配选择符：body li { font-size: 14px; }
- 压缩CSS代码
- 体积小于5KB图标使用base64图，大型站点使用字体图标

---
### 08JS 执行优化
- requestAnimationFrame 取代 setTimeout, setInterval,考虑兼容性，该API支持情况：(IE 10+)
- 压缩JS代码
- [节流、防抖函数](https://zhuanlan.zhihu.com/p/38313717)
- 使用CSS动画替代JS动画、数量庞大的表格等使用Canvas画板

---
### 09JS 缓存优化
- Cookies 存储体积较小，不同浏览器：3Kb ~ 5Kb
- LocalStorage
- SessionStorage
- IndexedDB(google doc, 石墨文档等);

---
### 10JS模块化
- Command JS Node.js 模块化方案
- AMD 前端异步模块定义，实现库：Require.js
- CMD 前端通用模块定义，实现库：Sea.js
- ES6 import, 未来主流方式

---
### 11减少回流、重绘： 
- 谷歌浏览器，开发调试工具： 查看回流、重绘 选项；[你不知道的Chrome调试技巧](https://juejin.cn/book/6844733783166418958/section/6844733783187390477)
- CSS 使用绝对定位(fixed, absolute),让更新频繁节点脱离文档流
- JS 避免频繁操作DOM，多次DOM节点操作可合并成一个
- [避免回流和重绘的必要性](https://juejin.cn/post/6953029989306466317#heading-0)

---
### 12DOM 编程优化
- 简化DOM操作, 多次操作合并成一个；
- 控制DOM节点数量，参考React，Vue等前端框架虚拟DOM；

---
### 13压缩工具
- HTML:[html-minifier](https://www.npmjs.com/package/html-minifier)， CSS:[clean-css](https://www.npmjs.com/package/clean-css)， JS:[uglify](https://www.npmjs.com/package/uglify) 压缩工具；
- 在线工具 1：[345tool在线工具](https://www.345tool.com/zh-hans)
- 在线工具 2: [FeHelper](https://www.baidufe.com/fehelper/index/index.html)

---
### 14静态打包工具： 
- 压缩、合并 CSS， JS；Combo 方案： domain/xxxx?a.js,b.js
- webpack 代码切割配置, [webpack4 optimization总结](https://segmentfault.com/a/1190000017066322)

---
### 15版本号更新策略；
- eg: 大版本 v1，小版本 v1.2.0, 时间节点（例如年底）收拢版本， 旧版本302重定向到最新版本

- 现有较成熟的版本管理机制当属语义化版本号[2]，表现形式为 {主版本}.{次版本}.{补丁版本} - [如何打造一款标准的 JS SDK ？](https://mp.weixin.qq.com/s/zxXod2FyRqg93TkvP_2Bdw)

---
### 16常用构建工具：
- grunt, gulp, webpack， FIS， 以及 讲师着重介绍的 JDF（小众构建工具）
- ES, Vite JS, Rome等; 详细参见 - [2020年GitHub 明星项目-构建工具](https://risingstars.js.org/2020/zh#section-build);

---
### 17webpack打包优化： 
- 优化4个小技巧：
- 定位大模块、删除无用模块、生产模式公共模块抽离、开发模式DLL & DllReference优化；
- [webpack-打包优化](https://segmentfault.com/a/1190000019404454)


---
## 页面渲染架构设计

---
### 18浏览器渲染过程
- 浏览器渲染过程， 缺少了CDN解析、HTTP握手相关；[浏览器渲染原理和过程](https://blog.csdn.net/weixin_42069147/article/details/105599327)
- 浏览器解析HTML，生成DOM树；
- 浏览器解析CSS，生成CSSOM（CSS Object Model）树；
- JS 会通过DOM API（DOM）和 CSSOM API 操作 DOM 树和 CSS Rule 树， 浏览器将DOM树和 CSSOM树 合成渲染树（Render Tree）；
- 布局（Layout）: 根据生成的Render Tree进行回流 计算每个节点的几何信息；（位置、大小、字体样式等）
- 绘制（painting）: 根据渲染树和回流得到几何信息，得到每个节点绝对像素；
- 展示（display）: 将像素发给图形处理器GPU， 展示在页面上；

---
### 19页面渲染技术架构
- 服务端渲染： 后端同步渲染、同构直出、BigPipe
- 客户端渲染：
  - 1）JavaScript渲染，静态化，前后端分离、单页面应用；
  - 2）Web APP: Angular, React, Vue 等 PWA
  - 3）原生APP： Android, IOS
  - 4）Hybrid APP: phoneGap, AppCan 等
  - 5）跨平台应用: Weex, React Native, Flutter, 小程序等

---
### 20后端同步渲染
- JSP，PHP， ASP 步骤差不多，以JSP为例
- 步骤1：JSP Servlet映射以.jsp结尾URL，JSP 文件请求时， Servlet容器知道调用哪个Servlet
- 步骤2：Servlet 容器检查 Servlet 是否已被编译
- 步骤3：如未编译， 容器将JSP代码转换成Servlet代码，进行编译
- 步骤4：Servlet容器将 JSP 请求转发到编译完成的 JSP Servlet类
- 步骤5：JSP Servlet类 返回并发送给客户端浏览器对应HTML
- 优点：快速实现业务开发、上线（协作模板引擎：JSmart, Velocity.js）； 缺点：用户需等待HTML完全加载才看到页面（白屏问题），代码耦合严重，前端页面复杂时不方便更新、迭代；

---
### 21动态页做页面静态化
- 静态化是指动态化网站生成静态HTML页面供用户、搜索引擎更好访问的技术，分成纯静态化和伪静态化两种
- 优势：
  - 1）提高访问速度
  - 2）有利于SEO，搜索引擎更容易收录
  - 3）更稳定，后端出问题后，因为静态页有缓存不影响用户访问
- 劣势：
  - 占用服务器硬盘空间
  - 静态页更新可能产生死链

---
### 22实现前后端分离
- 定义：前后端人员分离，技术栈分离； 后端负责业务功能、提供数据接口，前端负责页面UI、交互逻辑等；
- 优势：团队更加专注、提升开发效率、增加代码可维护性
- 后端架构：JAVA 、PHP + nginx,使用微服务（dubbo）, 使用某种协议例如JSF 提供不同服务； 前端架构： Angular,React,Vue等前端框架编译后部署 CDN 或 Node Server；
- 劣势：前端工作量较多，重前端，需要前端人员较多； 不利于SEO；

--- 
### 23单页面应用场景
- 定义： SPA（single-page-Application）, 页面切换浏览器不重新加载，而是通过动态重写当前页；
- 优点：
  - 1）页面切换、交互加载速度快；
  - 2）良好交互体验；
  - 3）前后端职责分离；
  - 4）减轻服务器负载；
- 缺点：
  - 1）开发成本高
  - 2）首次加载时间长
  - 3）对SEO不友好 

---
### 24BigPipe
- 定义：页面加载到 pagelet, 加快页面渲染速度。将整个页面拆解成N个 pagelet，各自渲染优化用户体验；
- 技术实现：
  - 浏览器向服务器请求页面
  - Server 快速返回 pagelet 容器（空DIV）， 与浏览器HTTP保持连接状态
  - 浏览器分别下载 pageliet，渲染页面
  - 所有 pageliet 下发完成， 发送 已完成标识位
  - 浏览器注入HTML，小部分CSS
  - 接收完所有页面后加载外部 JavaScript
  - 浏览器执行所有内联 JavaScript

---

### 25同构直出选择
- 同构定义：一套代码既可以在服务端运行，又可以在客户端运行；
- 优势：
  - 降低首屏渲染时间
  - 有理于SEO，爬虫喜欢DOM结构页面
  - 规避白屏
  - 代码同构： 上线两版本，利于灾备
- 实现： next.js, gatsbjs, nuxt.js; express, koa2, egg等；


---
### 26PWA
- 定义： Progressive Web App 简称 PWA， 使用特定技术和标准模式开发的Web应用；
- 优势：
  - 消除Web对网络的依赖，媲美设备原生APP，优化用户体验
  - 缓存资源，秒开页面
  - 内容可被搜索引擎收录
  - 可给用户发送离线消息
- 实现， 全站改成Https,Service Worker, App Manifest. 浏览器核心API： ServiceWorkerGlobalScope（浏览器支持率：88%）， Web App Manifest(浏览器支持率：83%)

---
### 27页面渲染：技术方案选择
- 1）存在即合理， 旧项目有历史原因，不可大改； 
- 2）依赖业务形式； 
- 3）依赖团队规模； 
- 4）依赖技术水平； 
- 5）没有银弹。

---
### 28页面加载：加载策略
- 懒加载：延迟加载特定元素：图片、JS/CSS、JS特定函数； 实现思路： 监听滚动条，如懒加载元素(有data-lazy属性) 且可见，其 src 由空变成真实值。
- 预加载：让浏览器预先加载某些资源，如图片、JS/CSS/模板，这些资源将来才使用； 例如： 一级页面预先加载二级页面资源，加快二级页面打开速度；实现：preload, prefetch, preconnect。
- 预渲染：大型项目，提前加载后续组件；
- 按需加载：常规按需加载（原生JS，JQuery），不同APP按需加载（判断是否在微信APP觉得是否加载对应JS-SDK脚本）， 不同设备按需加载（PC端和H5端样式文件），不同分辨率按需加载（[CSS Media Query](https://www.runoob.com/cssref/css3-pr-mediaquery.html)）
- 楼层式加载： 楼层页加载、缓存对应数据；








