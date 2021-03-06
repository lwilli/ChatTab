var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");
var port = process.env.PORT || 3000;
io.origins('*:*');

var numActiveUsers = 0;

// Serve ../index.html as homepage
app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

// Serve up dependencies
app.use(express.static(path.join(__dirname, '../client/dependencies')));

// Use ../client as middleware (for chrome extension?)
app.use('/client', express.static(path.resolve(__dirname, '..', 'client')));

io.on('connection', function(socket){
  numActiveUsers += 1;
  io.emit('user count', numActiveUsers);
  
  socket.on('chat message', function(data){
    socket.broadcast.emit('chat message', data);
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
