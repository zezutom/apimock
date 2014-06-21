// Configuration
var server = require("config").Server;
var logger = require("morgan");
var express = require("express");
var record = require("./modules/record2");

// Instantiate a web server
var app = express();
app.use(logger('dev'));

// Attach the response recorder
var recorder = record(app, {root: __dirname.replace(/\\/g,"/")});
recorder.init();

// Bootstrap
console.log("Starting server: [http://%s:%s]", server.host, server.port);
app.listen(server.port, server.host);

module.exports = app;
