var express = require('express');
var path = require("path");

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var poller = require('./quotepoller')();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
    socket.on('subscribe', function(symbol) {
        poller.subscribe(socket, symbol);
    });

    socket.on('unsubscribe', function(symbol) {
        poller.unsubscribe(socket, symbol);
    });

    socket.on('disconnect', function() {
        poller.unsubscribeAll(socket);
    });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

// poll every half a second
setInterval(function() {
    poller.pushQuotes();
}, 500);
