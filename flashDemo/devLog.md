### 开发日志

* [参考教程](http://www.cnblogs.com/atong/archive/2013/05/15/3080807.html)
* 在flash IDE中， 编辑fla文件时， 点击某一帧，然后按F9 可编辑到达该帧时执行的AS3代码；
* fla文件中插入的关键代码为：
```
import flash.external.ExternalInterface;
ExternalInterface.call("hideFlash");
stop();

```

*　html代码需放在虚拟服务器执行，才能让flash与js通信。