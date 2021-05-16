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
* 相关文章







