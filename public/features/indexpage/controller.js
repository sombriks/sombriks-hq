var io = require("socket.io-client");
var cfg = require("../cfg");

function Index() {
  
  this.titulo = "Sombriks Headquarters";
  var socket = io.connect(cfg.wsurl);

  socket.on("welcome",function(e){
    console.debug(e);
  });
}

module.exports = Index;
