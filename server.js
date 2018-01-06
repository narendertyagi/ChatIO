const express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
var usernames = [];






var port = process.env.Port || 8080;
//setting port
server.listen(port,function(err){
  if(err)
  console.log(err);
  console.log('Server Started Successfully...');
});


app.get('/',function(req,res){
  res.sendFile(__dirname +'/index.html');
});



io.sockets.on('connection',function(socket){
  console.log('Socket Connected..');

  socket.on('new user',function(data,callback){
    if(usernames.indexOf(data) != -1){
      callback(false);
    }else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });
  //update updateUsernames
  function updateUsernames(){
    io.sockets.emit('usernames',usernames);
  }

  socket.on('send message',function(data){
    io.sockets.emit('new message', {msg: data , user: socket.username});
  });
  //disconnect
  socket.on('disconnect',function(data){
    if(!socket.username){
      return;
    }
    usernames.splice(usernames.indexOf(socket.username),1);
    updateUsernames();
  });
});
