// Configuration
var server = require("config").Server;
var logger = require("morgan");
var express = require("express");
var bodyParser = require("body-parser");
var xmlparser = require('express-xml-bodyparser');
var record = require("./modules/record");

// Instantiate a web server
var app = express();

// Basic configuration
app.use(logger("dev"));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
app.use(xmlparser({explicitArray: false}));             // to support XML
app.set("view engine", "jade");

// Custom routes
var routes = require("./routes/index")(app);

// Attach the response recorder
var recorder = record(app, {root: __dirname.replace(/\\/g,"/")});
recorder.init();

// Bootstrap
console.log("Starting server: [http://%s:%s]", server.host, server.port);
app.listen(server.port, server.host);

module.exports = app;
