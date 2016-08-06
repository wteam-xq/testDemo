/**
**  模拟项目开发中socket.io连接异常；
**/
var io = require('socket.io')(3002);
var fs = require('fs');
var url = require("url");
// 存储用户client_id, 方便日后做私聊、踢人等功能
var clientArray = [];

// 连接成功事件
io.on('connection', function (socket) {
  var clientObj = {
    uid:'',
    uname:'',
    socket: socket
  };
  
  socket.on('chatevent', function (data, cb) {
  	var msg = data.msg;
  	// 将前台信息 发送给所有人
    cb('success!');
    io.emit('chatevent', data);
    // socket.emit('tips', {tips:'这句话只有你自己可见！'});
    // 测试外部发送消息（会发送给前端所有socket）
    // testSocketMessage();
  });

  socket.on('disconnect', function (data) {
    console.log('已断开连接，data:' + data);
  });

  socket.on('auth', function(data, cb){
    var userName = data.nickname,
        uid = data.uid;
    var socketObj = null;
    clientObj['uname'] = userName;
    clientObj['uid'] = uid;
    socketObj = getSocketObjById(uid);
    if (!socketObj) {
      clientArray.push(clientObj);
    } else {}// 在else内做 踢人下线业务逻辑
    // 测试发送全站消息  
    // io.emit  所有客户端可见（包括自己）
    // socket.broadcast.emit 所有客户端可见（不包括自己）
    socket.broadcast.emit('tips', {tips: userName + '成功进入房间！'});
    // data里的参数用不着, 100%返回授权通过
    cb({"code":0, "msg":"xx"});
  });

  socket.on('command', function(data, cb){
  	var _action = "",
  		relData = {"code":0,"msg":"è¯·æ±æåï¼","data":"{\"message\":{\"boomid\":20311,\"num\":1,\"delay\":180,\"ticket\":200,\"players\":[{\"uid\":\"qq-jumyxeyvhr\",\"isBoom\":0,\"isOri\":1,\"avatar\":\"http://004.img.qf.56.itc.cn/group3/M04/26/F5/MTAuMTAuODguODM=/dXBsb2FkRmlsZV8xXzE0NDA1MDY1NzAyODQ=.png\",\"nickname\":\"åå¾ä»\"}]},\"status\":200}"};

  	_action = data.action;
  	// 根据data里参数判断，执行哪一类业务逻辑（本次是主要两中：getTicket  startGame）
  	if (_action == "getTickets"){
  		console.log('请求票成功！');
  		cb({"status":200, "data": '服务器1'});
  	} else if(_action == "join"){
  		console.log('请求开始游戏成功！');
  		cb(relData);
  		io.emit('startGame', data);
  	}
  });

  socket.on('tips', function(data){
    console.log(data.tips);
  });
});

// 外部调用 socket 消息
function testSocketMessage(){
  var obj = null,
      aObj = JSON.parse('{"a": 1}');
  obj = {
    'tips': '这段消息发送给了服务端还是客户端？',
    'aObj': aObj
  };
  io.sockets.emit('tips',obj);
}

// 根据socket id 获取对应的socketObj对象
function getSocketObjById(clientId){
  var i, len, socketObj = null, result = null;
  len = clientArray.length;
  for (i = 0; i < len; i++) {
    socketObj = clientArray[i];
    if (socketObj.uid == clientId) {
      result = socketObj;
      break;
    }
  }
  return result;
}
