// main imports
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// config imports
var host = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// client content
app.use(express.static("public"));

// server bootstrap
server.listen(port, host, 512, function () {
  console.log("server running at %s:%s", host, port);
});

// reverse connection setup
io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit("welcome","hail from the other side");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});