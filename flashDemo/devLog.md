### 开发日志

* [参考教程](http://ch-kexin.iteye.com/blog/1158691)

* 在flash IDE中， 编辑fla文件时， 点击某一帧，然后按F9 可编辑到达该帧时执行的AS3代码；
* fla文件中插入的关键代码为：
```
import flash.external.ExternalInterface;
ExternalInterface.call("hideFlash");
stop();

```

*　html代码需放在虚拟服务器执行，才能让flash与js通信。

* sendStar.html 主要调试 flash调用 js 函数以及 调用flash的方式（object or embed）；
* [object标签跟embed标签的区别](http://blog.csdn.net/zhengbo0/article/details/21087995) embed标签比较旧兼容很低版本的IE浏览器，实际上， 现在（2016）IE6 IE7都很少见，IE8是常见的低版本浏览器所以直接用<object>标签即可。
* [flash object的param属性参数详解](http://home.51.com/bizi_2000/diary/item/10048445.html)
* [flash embed 参数详解](http://blog.csdn.net/yijishashou/article/details/5495079)