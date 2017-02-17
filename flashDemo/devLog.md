### 开发日志

* [参考教程](http://ch-kexin.iteye.com/blog/1158691)

* 在flash IDE中，编辑fla文件时，点击某一帧(必须是关键帧或空白帧)，然后按F9 可编辑到达该帧时执行的AS3代码；
* fla文件中插入的关键代码为：
```
import flash.external.ExternalInterface;
ExternalInterface.call("hideFlash");
stop();

```

*　html代码需放在虚拟服务器执行，才能让flash与js通信。

* sendStar.html 主要调试 flash调用 js 函数以及 调用flash的方式（object or embed）；
* [object标签跟embed标签的区别](http://blog.csdn.net/zhengbo0/article/details/21087995) `object`标签是IE only， 为了兼容低版本浏览器建议使用`<object>`， 而`embed`则为HTML5的新标签， 为了兼容与优化可以将 `embed`标签嵌入到`object`标签内。
* [flash object的param属性参数详解](http://home.51.com/bizi_2000/diary/item/10048445.html)
* [flash embed 参数详解](http://blog.csdn.net/yijishashou/article/details/5495079)

* flash IDE 加入脚本（as3），一般是新建一个图层， 然后在该图层新建 “空白关键帧”；
* fla 调用 flashVars参数中的变量
```
import flash.external.ExternalInterface;
var starNo:String=stage.loaderInfo.parameters["starNo"];
ExternalInterface.call("hideFlash",starNo);
stop();

```

* 2017-02-16
* flash优化日志： 打开Adobe Flash Professional， 发布设置勾选上 HTML包装器， 然后关闭其他所有软件， win7(or win10)`ctrl + shift + Esc`打开任务管理器-》性能； 浏览器打开发布生成的HTML文件， 观察任务管理器里CPU占有率。
* 后续项目优化方向： 高级浏览器使用 canvas 播放动画， 低级浏览器继续flash创建播放动画；
* [swf2canvas库：Fanvas](https://github.com/TencentOpen/Fanvas)除了Fanvas还有大名鼎鼎的google和adobe的产品——swiffy(已停止服务)和flashcc；
* 谷歌 swiffy 为嘛下线？因为它发布时间已有5年， 国外基本完成 flash动画到 H5动画的过渡， 所以不需要维护、更新该工具了；
* [优化报告文档](https://pan.baidu.com/s/1c2Bsfg0) 后续更新 flash cc生成的HTML5文件研究；
