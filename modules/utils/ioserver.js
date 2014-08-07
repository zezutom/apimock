var fs = require("fs");
var _ = require('underscore');
var io = require('socket.io').listen(5000); // TODO should the port be configurable?
var clients = {};

module.exports = function() {

    return {
        init: function(events) {
            var me = this;
            io.sockets.on('connection', function(socket) {
                _.each(events, function(event) {
                    me.map(event, socket);
                });
            });
        },
        map: function(event, socket) {
            socket.on(event.name, function(clientId) {
                clients[clientId] = socket;
                fs.readFile(event.source, function(err, file) {
                    // emit the 'target' event. If that's undefined, use the original event
                    var target = event.target || event.name;
                    var message = err ? {"error": err} : file;
                    var recipient = (event.private) ? clients[clientId] : io.sockets;

                    recipient.emit(target, message);
                });
            });

            socket.on('disconnect', function() {
                // TODO any cleanup?
            });
        }
    }
};