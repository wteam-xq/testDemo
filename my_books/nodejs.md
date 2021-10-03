# 《深入浅出Node》 学习小笔记
* [深入浅出Node - 微信读书](https://weread.qq.com/web/reader/d1b32290718ff65fd1befcc)

## 第一章 Node简介
* JavaScript 发展历史，1995年诞生，10天仓促创作出来。
* Node 发展历史 2009年5月，运用场景， Node 基于 libuv 实现跨平台；
* Chrome 和 Node 组成构成区分图：
* ![Chrome 和 Node 组成构成区分图](https://res.weread.qq.com/wrepub/epub_26211935_3)
* Node基于libuv实现跨平台的架构示意图:
* ![Node基于libuv实现跨平台的架构示意图](https://res.weread.qq.com/wrepub/epub_26211935_6)

## 第二章 模块机制
* JavaScript 的变迁 - CommonJS 规范:
* ![JavaScript的变迁](https://res.weread.qq.com/wrepub/epub_26211935_8)
* Node与浏览器以及W3C组织、CommonJS组织、ECMAScript之间的关系：
* ![Node与浏览器以及W3C组织、CommonJS组织、ECMAScript之间的关系](https://res.weread.qq.com/wrepub/epub_26211935_9)

## 第三章 异步I/O
* 3.1 为什么要异步 I/O
```
服务端不再是单台服务器， 考虑1）用户体验 2）资源分配
CPU 通过多进程 分发到多个服务， 而每个服务可开多线程处理I/O、网络套接字等并发逻辑
```

* 3.2 异步I/O 实现现状
```
异步 和 非阻塞 有些不同， 虽然都达到并行I/O目的， 异步/同步， 阻塞/非阻塞 是两回事；
操作系统内核对于I/O 只有阻塞/非阻塞两种方式；
异步I/O 是实现 非阻塞的手段， 不同操作系统不一样， Node通过libuv， 调用操作系统开心线程池实现；
```

* 3.3 Node的异步 I/O
```
Node 完成整个异步I/O 环节有事件循环、观察者和请求对象、执行回调等；
事件循环、观察者、请求对象、I/O线程池四者共同构成了Node异步I/O 模型的基本要素；
Node 中，除了JavaScript是单线程之外，Node自身其实是多线程的，所有I/O（磁盘I/O和网络I/O等）可以并行运行；
```

* 3.4 非 I/O 的异步API
```
SetTimeout(),setInterval(),setImmediate(), process.inextTick()
```
* 3.5 事件驱动与高性能服务器
```
异步I/O 同样用于网络 网络套接字 构建Web服务器；
每线程/请求 方式，大量请求链接不受线程上下文切换开销影响，该高性能方式让知名服务器Nginx也摈弃多线程方式，采用和Node相同的事件驱动；
I/O 操作 与 CPU 操作分离, 事件循环是异步I/O实现的核心；
```

## 第四章 异步编程
* 4.1 函数式编程
```
函数式编程 是 JavaScript异步编程的基础；
高阶函数： 可将函数作为参数 或 返回值；
偏函数用法： 创建一个调用预置参数的函数用法；
```
* 4.2 异步编程的优势和难点
```
优势： 基于事件驱动的非阻塞I/O模型，使CPU使用率更高，资源得到更好的利用；
缺点： 不擅长CPU密集型计算场景；

难点：1、异常处理，try/catch只能捕获档次事件循环的异常；
2、函数嵌套过深；（现不存在，Node 很多API提供了同步语法糖， 底层ES6： async,await）
3、阻塞代码；（同上）
4、多线程编程，Node 有 child_process API；
5、异步转同步；

```
* 4.3 异步编程解决方案
```
1、事件发布/订阅模式
Node 自带模块 events模块；
2、Promise/Deferred模式
该模式最早出现再Dojo库代码中，后再JQ1.5版本引入： $.get('/api').success(onSuccess).error(onError).complete(onComplete);
Promise 只有3中状态：未完成态、完成态 和 失败态；状态一旦转化 将不能更改；
回调地狱 - “恶魔金字塔”
3、流程控制库
尾触发与Next，例如中间件模块，处理完逻辑就得通过next 形成逻辑队列；
EventProxy 和 async库 都是高阶函数实现 统一错误处理；
Step 库， Step(task1, task2, task3)
Wind 库，底层实现： eval() 函数
```
* 4.4 异步并发控制
```
异步I/O需要过载保护，防止服务器崩溃；
1、bagpipe解决方案： 通过队列控制并发量、活跃调用量达到最大值暂存队列、异步调用结束从队列取出新异步调用执行；拒绝模式、超时控制；
2、async 的解决方案：paralleLimit(), parallel();
```

## 第五章 内存控制
* 5.1 V8的垃圾回收机制与内存限制
```
Node 与 V8 历史：V8 作者--Lars Bak曾在Sun公司工作开发过JAVA、Self等语言高性能虚拟机，V8一出就超越当时所有的JavaScript虚拟机；
V8 的内存限制： 64位系统下约为1.4GB，32位系统下约为0.7GB， 原因 - V8的垃圾回收机制；
V8垃圾回收机制： 内存分为新生代空间（小、变化大、运行速度快） 和 老生代空间（大、稳定、运行速度慢）；
新生代内存空间使用 Scavenge 算法（主要采用1970年发表的Cheney算法）：空间换时间，将空间一分为二， From运行空间， To复制空间， 每次运行排除无用对象后两空间进行翻转、对换。
新生代空间对象可晋升到老生代空间两条件： 1）已经历过翻转； 2）To空间已使用超过25%；
老生代空间垃圾回收方式：Mark-Sweep 和 Mark-Compact 相结合方式， Mark-Sweep：标记对象 没标记的将被清理；Mark-Compact 整理对象，将移动存活对象清理碎片空间；
三种垃圾回收算法： Scavenge， Mark-Sweep， Mark-Compact，避免“全停顿”（stop-the-world）使用功能“增量标记”垃圾回收算法与运行逻辑交替运行。
```
* 延伸：V8垃圾回收机制相关博文：
* [2020 - V8 引擎垃圾回收与内存分配](https://segmentfault.com/a/1190000038594837)
* [2020 -  v8垃圾回收机制](https://zhuanlan.zhihu.com/p/113296268)
* [2018 -  聊聊V8引擎的垃圾回收](https://segmentfault.com/a/1190000014383214?utm_source=sf-similar-article)
* [2017 -  V8 中的垃圾收集（GC），图文指南](https://zhuanlan.zhihu.com/p/29276031 )
* 国外V8引擎垃圾回收机制文档：
* [2019 -  Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)
* [2020 - Demystifying memory management in modern programming languages](https://deepu.tech/memory-management-in-programming/)
* [2020 -  Visualizing memory management in V8 Engine (JavaScript, NodeJS, Deno, WebAssembly)](https://deepu.tech/memory-management-in-v8/)
* [V8动态网站](https://v8.dev/)

* 5.2 高效使用内存
```
1、作用域（scope）: 在JavaScript中能形成作用域的有 函数、with、全局作用域；
标识符查找： 即变量名查找；
作用域链：查找变量像走阶梯一样，逐级往上查找；
变量的主动释放： 全局变量常驻内存 - 老生代内存空间；
2、闭包(closure)：实现外部作用域访问内部作用域中变量的方法叫闭包；
闭包是JavaScript的高级特性，一旦有变量引用中间函数（闭包），中间函数不会释放，对应作用域中变量内存占用也不会释放，除非不再由引用。
```

* 5.3 内存指标
```
1、查看内存使用情况；
process.memoryUsage(), os 模块的totalmem() 和 freemem() 方法都可以查看内存使用情况；
2、查看系统的内存占用；
os.totalmem(), os.freemem()
堆外内存： 不是V8分配的内存；例如： Buffer 对象，不经过V8的内存分配机制， 所以没有内存大小限制；
```

* 5.4 内存泄露
```
造成内存泄露的原因：缓存、队列消息不及时、作用域未释放。
1、慎将内存当做缓存： Node端任何试图拿内存当缓存的行为都应当被限制；
可使用外部缓存： Redis 或 Memcached；
2、关注队列状态： 场景：收集日志，数据库写入实现，造成写入操作堆积。
超时模式 和 拒绝模式 都可以防止队列拥塞导致的内存泄漏问题；
```

* 5.5 内存泄漏排查
该章节推荐工具，因为年代久远， 很多被淘汰或不维护， 不展开！
推荐： [Node.js 应用故障排查手册](https://github.com/aliyun-node/Node.js-Troubleshooting-Guide)
```
* v8 - profiler 火焰图
```

* 5.6 大内存应用
因为 V8内存限制，无法通过 `fs.readFile()`, `fs.writeFile()`直接进行大文件的操作，而改用 `fs.createReadStream()` 和 `fs.createWriteStream()` 方法通过流的方式实现大文件的操作。

## 第六章 理解Buffer
网络协议、操作数据库、处理图片、接受上传图片等，在网络流和文件操作中，需处理大量二级制数据， 字符串无法满足，所以需要Buffer对象。
Node 端主要处理 文件 和 网络IO，与 JS前端的区别。
* 6.1 Buffer 结构
```
Buffer 是一类似数组的对象，主要用于操作字节， 二级制数据处理；
模块结构： 类数组类型， 核心模块C++处理， 非核心模块 JavaScript 处理；
Buffer对象内存不是在V8堆内存，而是在Node的C++层申请的内存块；Node采用了slab分配机制给Buffer对象分配内存；

```
* 6.2 Buffer 的转换
```
Buffer 可以和 字符串类型相互转换（ASCII， UTF-8 等六种编码）；
字符串转 Buffer: newBuffer（str, [encoding]）
Buffer 转字符串: buf.toString([encoding],[start],[end]);
```
* 6.3 Buffer 的拼接
```
Buffer 通过 ”+“ 拼接， 英文没问题但类似中文这种会出现乱码；
解决方案： 通过设置编码 或 这使用 Buffer.concat 方法拼接；
```
* 6.4 Buffer 与 性能
```
Http 请求使  Buffer数据类型 传输速度 比字符串 快月一倍左右；
```
* 6.5 总结
```
体验过JavaScript友好的字符串操作后，有些开发者可能会形成思维定势，将Buffer当做字符串来理解。但字符串与Buffer之间有实质上的差异，即Buffer是二进制数据，字符串与Buffer之间存在编码关系。因此，理解Buffer的诸多细节十分必要，对于如何高效处理二进制数据十分有用。
```


## 第七章 网络编程
利用Node可以十分方便地搭建网络服务器。
Node提供了net、dgram、http、https这4个模块，分别用于处理TCP、UDP、HTTP、HTTPS，适用于服务器端和客户端。

* 7.1 构建TCP服务
