### 开发日志

* [参考教程](http://ch-kexin.iteye.com/blog/1158691)

* 在flash IDE中，编辑fla文件时，点击某一帧(必须是关键帧或空白帧)，然后按F9 可编辑到达该帧时执行的AS3代码；
* fla文件中插入的关键代码为：
```
import flash.external.ExternalInterface;
ExternalInterface.call("hideFlash");
stop();

```

*　html代码需放在**虚拟服务器**执行，才能让flash与js通信。

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