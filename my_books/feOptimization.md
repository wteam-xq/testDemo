### 《前端性能优化链路》 学习小笔记

* [极客时间链接](https://time.geekbang.org/course/intro/257)
* [MARKSHOW 演示](https://mark.show/#)
* 该课程大概发布时间： 2019年12月

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

### 29接口服务调用优化
- 接口合并，减少请求数
- 接口上CDN，不实时更新接口缓存优化方案
- 接口域名上CDN
- 接口降级，垫底数据输出
- 接口监控， 钉钉告警、邮箱告警、短信告警等

### 30 接口缓存优化
- Ajax 缓存，请求时带cache参数
- 实时性数据，本地LocalStorage 缓存
- 后端 也能添加 Redis 缓存

### 31 Webview 内核
- IOS UIWebView , 2018年 IOS 12 后不维护， WKWebView 2014年推出， 页面性能和JS解析性能都比 UIWebView提高一倍左右；
- Android Webkit(4.4以下)， Chromium(4.4以上), 微信 X5 内核（现在微信webview内核还是X5， 2016年4月19 内核升级为Blink）

### 32 设置全局 Webview
- 可设置打开 APP 时默认打开 webview, 可省略 70 ~ 800ms 时间

### 33 Webview 导航栏预加载
- 加载Webview时 一起加载导航栏

### 34 打通登录态
- 旧：HTML5每次打开都是无登录状态，需进入 APP 登录页， 登录成功跳转后，写入Cookies，两次跳转；
- 新：APP 将登录Cookies存储，在有效期内，不用重新登录（具体看视频如何改 Webview源码）

### 35 WebView URL 预加载
- 旧：URL 准备好再加载
- 新：准备过程中并行加载， 图片、视频、动画等提前加载

### 36 WebView 提升滚动条体验
- 旧：系统自带滚动条（加载过程中的横向滚动条）
- 新：自定义滚动条

### 37 JS SDK 优化
- 旧：需要JSSDK.js 做桥梁，webview 调用 JS Bridge 实现网页 与 APP 通信等
- 新：无需调用JSSDK.js 实现相同功能，直接修改webview源码实现， 演示调用相册等

### 38 浏览器缓存机制
- Web Storage, LocalStorage, SessionStorage, 使用存储简单键值对 数据
- Web SQL DataBase, 存储复杂数据， 可用SQL语句查询， 建议用Index DB
- Application Cache, 方便创建离线 APP
- Index DB, 结构、关系复杂的数据存储，使用较 Web Storage复杂
- 以上在安卓 Webview中 都需要打开开关， IOS 不用 

### 39 HTML 5 离线化方案
- 全局离线包，所有业务使用功能
- 私有离线包，单个业务使用
- 用户不是 WiFi 网络不会下载， 请求、下载、安装 三步骤；
- 美团：LsLoader, 腾讯：Alloykit,  阿里：极致Hybrid 航旅离线包方案

### 40 混合开发： React Native内核 以及优势
- Learn once, Run anywhere
- 优势：IOS， Android, HTML5 共用一套代码， 与Native几乎无异
- 效率：开发时查看效果不用编译，即时查看更改
- 内核： JS组件层 - C++层，JSCore引擎, JS Bridge等 - UI渲染器， 网络通信，图片库，工具库 - Native层 OC（IOS），JAVA（Android）
- 研发两端不同步， IOS， 安卓应用商店审核机制不同， 苹果审核周期长很多

### 41 混合开发： 小程序内核 及 优势
- 优势：优于H5 不如原生（Native）, 方便： 扫码， 搜索即可，用完即走！
- 内核： View视图层，Service逻辑层 - JSBridge - App能力，离线存储，网络请求， 跳转中心 - Native
- 行业背景： APP侧 流量变现， 打造生态， 类应用分发市场

### 42 混合开发： Flutter内核及优势
- 愿景：一个图形绘制工具包，一次绘制任何终端运行
- 优势：底层使用Skia绘制引擎，图形性能媲美原生，编译速度快；
- 内核： FrameWork(Dart),这里有五层，不展开了 -  Engine(C++) Skia,Dart, Text


### 43 CDN 缓存优化
- 内容分发网络（content-Delivery-NetWork CDN）， 找到离用户最近服务器访问静态文件
- 优点：提速、低成本、高可用度
- CDN 回源， CDN 失效，cookies 过期等直接访问原服务器文件
- CDN 三级缓存， 浏览器缓存、边缘节点缓存、CDN原站缓存
- CDN 灰度发布， 部分地区（边缘节点）先发布，选定城市、运营商解析更新
- CDN 大促备战， 增加运营商流量， 延长缓存更新时间10分钟 to 1小时

### 44 主流DNS优化方案
- 域名系统（Domain-Name-System DNS）- 网站域名与服务器IP映射系统
- 安卓DNS模块（okHttp）, 支持GZIP压缩，HTTP2不可用自动降级，多路复用一对多连接
- IOS DNS模块（自研）， APP启动时缓存域名 IP信息，命中缓存可直接访问IP
- 前端，设置多域名，打破浏览器某域名下 请求限制

### 45 减少HTTP 请求数
- CSS 精灵， 一个大图取代多小图
- 图片使用DataURI, WebFont(小图标)
- JS/CSS 合并文件
- JS/CSS 请求Combo
- 接口合并
- 接口数据存入缓存,eg: LocalStorage
- 静态资源存储LocalStorage

### 46 减小Cookies 大小
- 策略： 主站首页设置白名单， 定期删除非白名单Cookies
- 减少页面传输大小， 对Cookies进行有效管理

### 47 服务器缓存配置和优化
- Expires Cookies 请求头缓存过期时间
- Cache-Control 请求头设置设置缓存时间
- Etag 唯一标识值，类似指纹，资源变化才更新
- Last-Modified 请求头设置上次更新时间
- Date 设置更新时间
- Status 5种类型， 100 ~ 199信息响应， 200~299 成功响应， 300~399 重定向， 400~499客户端错误 ， 500~599服务端错误

### 49 如何开启GZIP压缩
- 对文本压缩， 图片、视频等无法压缩，大概压缩50%~70%
- Nginx配置：config.conf, gzip:on
- Apache配置： AddOutPutFilterByType 和 AddOutPutFilter
- 检测：请求头 content-Encode: gzip 

### 49 如何开启HTTPS
- HTTPS 超文本传输安全协议，安全通信的传输协议
- 步骤： 浏览器发起HTTP请求 - 传输证书 - 浏览器解析证书 - 传送加密信息 - 服务器解密信息 - 传输加密后信息 - 浏览器解密信息
- 优点： SEO， 安全
- 从经销商购买证书： SSLs.com, GoGetSSL.com
- Nginx 配置： ssl_certificate, ssl_certificate_key 配置信息

### 50 HTTP2
- 定义：HTTP 协议的第二个版本
- 优点： 二进制格式传输数据， 多路复用，一个HTTP2链接发起多个链接， 对Header压缩，减小传输体积， 服务端推送 服务端能更快推送给客户端
- 降低服务器压力， 提升网站访问速度， 保护网站安全（HTTP2必须开启HTTPS）
- 升级Open SSL， 重新编译Nginx， 
- 验证， Chrome 查看 NetWork， prottocol 列是否变为 “h2”
- 

### 51 优化前端研发流程
- 技术选型（页面渲染 或 混合开发）， 项目初始化（React，Vue， Angular）, 依赖库引入（私有NPM）， 本地开发， 项目联调（前端项目脚手架等工具）， 效果确认（产品、设计师确认） - 项目上线

### 52 前后端如何高效协作
- 协作模式： 前后端制定数据结构， 前端页面制作， 前端交互实现， 后端开发， 前后端联调， 前端上线， 后端上线（前后端上线顺序根据实际业务情况确定）


### 53 自动化测试 - 有哪些主流方案
- UI 自动化， appium, robotFrameWork, selenium, airtest等工具
- 接口自动化工具， Java-restassured, Python-requests, Jmeter, HttpRuner等
- 单元测试： Junit5, pytest, unittest。

### 54 自动化上线 有哪些方案
- 自动化部署上线， 流程： 拉取代码库代码， 自动化工具在线打包、编译， 代码上线至灰度机器， 代码上线部署至线上全机器， CDN后台更新缓存

### 55 提升整个团队代码质量
- 指定代码规范
- 静态代码扫码, ts-link插件、 IDE插件等实现（上线系统添加流程）
- CodeReview 高工或小组内
- 阅读框架核心代码 - 参考优秀源码

### 56 上线前对H5质量检测
- 页面错误， JS 报错， 接口报错， 线上环境检测， 页面白屏
- 页面性能， 页面加载时间检测， 前端HTML，JS， CSS是否压缩， 体积大小检测， JS、CSS个数上限值（例如最多5个）， GZIP 是否开启， 服务器缓存是否设置
- 页面安全， HTTS检测，静态资源链接等是否包含 HTTP://， XSS检测

### 57 上线后对H5错误、性能监控
- 页面性能：JS 错误监控， API 接口监控， 日志详情， 用户轨迹
- 统计报表： 大盘走势， 地区分布（地域）， 运营商， 浏览器
- 其他： 页面管理， 性能指标， 报警服务


### 58 线上业务如何进行基调监控
- 竞品分析、多点监控（按城市、运营商等细分监控）、告警服务（业务告警）


### 59 APP 性能错误监控
- 监控以下数据， 以下数据保证上报， 后续可在 BI系统图形查看： 
- 网络请求
- 启动监控
- 奔溃监控
- 页面监控
- 网络监控
- WebView监控
- 报警服务（相关监控超过阈值时有相关告警信息输出）

### 60 课程总结 和 后续展望
- 第一章 课程介绍 和 内容综述
- 第二章 静态资源优化， 图片、HTML， CSS， JS 相关优化， 减少回流重绘、DOM编程优化，静态文件相关优化，前端构建工具选型配置等
- 第三章 页面渲染架构设计 和 性能优化， 浏览器渲染过程（最重要）， 前后端分离、单页面应用技术、BigPipe方案等、页面加载策略（重点）
- 第四章 原生APP优化， 如何选择合适的Webview内核（重要）， 如何设置全局Webview,URL如何预加载、滚动条优化、如何对JSSDK优化（重点），混合式开发，react Native, 小程序， Flutter 选型各自优势等（重点）
- 第五章 服务端、网络优化，如何配置CDN缓存（重点）、减少HTTP，减少Cookies, 请求头如何配置缓存， 开启 gzip, https,http2;
- 第六章 研发流程优化， 优化前端研发流程（重点）， 前后端配合、自动化方案、测试后自动化上线，代码质量检测
- 第七章 全链路质量监控体系建设， 上线前H5代码检测， 上线后H5性能和错误监测（重点）， 线上业务基调监控， APP性能和错误监控
- 未来展望： 学习方法分享: 不熟悉内容重复查阅；《Web性能权威指南》《网站性能检测与优化》《高性能网站建设指南》。精通某一门语言： NodeJs。








