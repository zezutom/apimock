var logger = require("morgan");
var express = require("express");
var bodyParser = require("body-parser");
var xmlParser = require('express-xml-bodyparser');
var record = require("./modules/record");
var conf = require("./modules/utils/conf");

// Instantiate a web server
var app = express();

// Configure the app
app.use(logger("dev"));
app.use(bodyParser.json());                 // to support JSON-encoded bodies
app.use(bodyParser.urlencoded());           // to support URL-encoded bodies
app.use(xmlParser({explicitArray: false})); // to support XML
app.set("views", conf.views() || "views");
app.set("view engine", "jade");

// Attach routes
require("./routes/index")(app);
if (conf.routes())
    require(conf.routes())(app);

// Attach a response recorder
record(app).init();

// Bootstrap
var port = conf.port(), host = conf.host();
console.log("Starting server: [http://%s:%s]", host, port);
app.listen(port, host);

module.exports = app;