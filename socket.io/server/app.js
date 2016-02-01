var io = require('socket.io')(3002);
var fs = require('fs');
var url = require("url");

// 连接成功事件
io.on('connection', function (socket) {
  socket.on('chatevent', function (data, cb) {
  	var msg = data.msg;
  	// 将前台信息 发送给所有人
    cb('success!');
    io.emit('chatevent', data);
  });
  socket.on('disconnect', function (data) {
    console.log('已断开连接，data:' + data);
  });
});
