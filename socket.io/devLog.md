# sockiet.io.js 使用日志
* 2016-01-20  与后台连接socket成功后立即请求授权“auth”(emit通信)会导致回调不执行，应该延时100毫秒
* 2016-01-26  断开socket重连， 带上参数：{"force new connection": true}
```
socket = io.connect('http://10.10.53.53:8001', {"force new connection": true});
```
* 2016-01-31 问题：IE9以下浏览器， 连接socket成功后 发送信息（emit通信）会自动断开连接；
* 解决: 研究中...
