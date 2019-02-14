* 安装依赖:
```
npm install
```

* 编译:
```
npm run build_1
```

* 运行：
```
npm run start
```

* 浏览器访问：
```
http://localhost:8000/
```

* index.html 即为入口文件， 所以如果想查看demo_1.html 则将 demo_1/index.html 内容拷贝到index.html即可。
* 注意 index.html 调用脚本路径也需要改： 
```
<script type="text/javascript" src="bundle.js"></script>
```
改成:
```
<script type="text/javascript" src="demo_1/bundle.js"></script>
```
