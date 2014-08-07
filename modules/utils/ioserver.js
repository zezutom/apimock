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
            var key;

            socket.on(event.name, function(clientId) {

                if (clientId) {
                    key = clientId;
                    clients[key] = socket;
                }

                fs.readFile(event.source, function(err, file) {
                    // emit the 'target' event. If that's undefined, use the original event
                    var target = event.target || event.name;
                    var message = err ? {"error": err} : JSON.parse(file);
                    var recipient = (event.private || false) ? clients[message[event.recipient || "to"]] : io.sockets;

                    recipient.emit(target, JSON.stringify(message));
                });
            });

            socket.on('disconnect', function() {
                delete clients[key];
            });
        }
    }
};