var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
io.origins('*:*');

var numActiveUsers = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

io.on('connection', function(socket){
  numActiveUsers += 1;
  io.emit('user count', numActiveUsers);
  
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('get user count', function(fn) {
    fn(numActiveUsers);
  })

  socket.on('disconnect', function(){
    numActiveUsers -= 1;
    io.emit('user count', numActiveUsers);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
