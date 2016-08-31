/**
**  模拟项目开发中socket.io连接异常；
**/
var io = require('socket.io')(3002);
var fs = require('fs');
var url = require("url");
// 存储用户client_id, 方便日后做私聊、踢人等功能（师兄CRM系统代码迁移）
var clientArray = [];

// 连接成功事件
io.on('connection', function (socket) {
  var clientObj = {
    uid:'',
    uname:'',
    socketList: []
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
    socket['offline'] = true;
  });

  socket.on('auth', function(data, cb){
    var userName = data.nickname,
        uid = data.uid;
    var socketObj = null;
    clientObj['uname'] = userName;
    clientObj['uid'] = uid;

    // 如果客服已上线，则会更新对应socketList队列
    hasAuth = clientHasAuth(uid, socket);
    if (!hasAuth){
      console.log('客服上线了：' + clientId);
      // 不存在列表中
      clientObj.socketList.push(socket);
      clientArray.push(clientObj);
    } else {
      console.log('该客服在其他设备已上线，已更新socket队列，通知其他客服...');
    }
    // 在else内做 踢人下线业务逻辑
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

// 根据 clientId 获取socket 队列
function getSocketListById(clientId){
  var i, len, clientObj, result = [];
  len = clientArray.length;
  console.log('开始寻找对应 客服socket,id:' + clientId);
  console.log('当前客服队列:' + clientArray );
  for (i = 0; i < len; i++) {
    clientObj = clientArray[i];
    console.log('clientObj.clientId:' + clientObj.clientId);
    console.log('clientId:' + clientId);
    console.log('clientObj.socketList:' + clientObj.socketList);
    if (clientObj.clientId == clientId) {
      result = clientObj.socketList;
      break;
    }
  }
  return result;
}

// 判断客服是否已在线, 如在线，更新队列(先清除掉线socket)
function clientHasAuth(clientId, socket){
  var clientObj, i, len,
      socketList = [],
      newSocketList = [],
      socketObj = null,
      listLen, j;
  var result = false;

  len = clientArray.length;
  for (i = 0; i < len; i++) {
    clientObj = clientArray[i];
    if (clientObj.clientId == clientId) {
      socketList = clientObj.socketList;
      listLen = socketList.length;
      // 清除掉线socket
      for (j = 0; j < listLen; j++) {
        socketObj = socketList[j];
        if (socketObj && !socketObj['offline']) {
          newSocketList.push(socketObj);
        }
      }
      if (newSocketList.length > 0) {
        // 通知其他客服，账号重复登录
        msgToOtherSocket(newSocketList);
        newSocketList.push(socket);
        result = true;
        clientObj.socketList = newSocketList;
      } else {
        // 清除该clietnObj
        clientArray.splice(i, 1);
        console.log('clientObj已无socketObj清除之，编号:' + i);
      }
      break;
    }
  }
  return result;
}

// 通知其他客服账号
function msgToOtherSocket(newSocketList){
  var len = newSocketList.length,
      socketObj = null,
      i;
  console.log('通知其他客服，账号重复登录，通知人数：' + len);
  for (i = 0; i < len; i++){
    socketObj = newSocketList[i];
    socketObj.emit('reLogin', {"len": len});
  }
}

// 将消息推送给指定用户（DC 单播）
function messageDc(customid, obj){
  var socketList = [], socketObj = null;
  var i, len, offlineList = [];
  
  socketList = getSocketListById(customid);
  len = socketList.length;
  
  if (len > 0) {
    for (i = 0; i < len; i++) {
      socketObj = socketList[i];
      if (!socketObj || socketObj['offline']) {
        // 记录已掉线socket
        offlineList.push(i);
        continue;
      }
      socketObj.emit('message',obj);
    }
  } else {
    // 该客服不在线
    console.log('该clientId客服已离线');
  }
}
