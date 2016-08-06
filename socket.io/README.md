### 测试 socket.io 小工程

#### 启动：
* 1.进入server目录， 打开cmd（windows）或 终端(mac), 启动服务端(该测试页连接两socket服务器)： 
 ```
node app.js
 ``` 
  ```
node app_2.js
 ```
* 方便调试可以：
```
node-dev app.js
```
* 2.将该 工程放入虚拟服务器（tomcat或apache）中，通过虚拟服务器访问socket.io/index.html；
