# 《深入浅出Node》 学习小笔记

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

