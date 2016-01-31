// var app = require('http').createServer(handler)
var io = require('socket.io')(3002);
var fs = require('fs');
var url = require("url");

// app.listen(3002);
// function handler (req, res) {
// 	var pathname = url.parse(request.url).pathname;
//   	console.log('req:' + pathname + 'success');
// }

io.on('connection', function (socket) {
  socket.on('chatevent', function (data) {
  	var msg = data.msg;
  	// 将前台信息 发送给所有人
    console.log(msg);
  });
  socket.on('disconnect', function (data) {
    console.log('已断开连接');
  });
});