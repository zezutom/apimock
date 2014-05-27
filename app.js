// Configuration
var SERVER = require("config").Server;
var ROUTES = require("config").Routes;

// File search wiring
var appRoot = __dirname.replace(/\\/g,"/"),
    mockRoot = appRoot + ROUTES.source,
    searchPattern = mockRoot + "/**/*" + ROUTES.suffix,
    fs = require("fs"),
    glob = require("glob");
var files = glob.sync(searchPattern);

// Web server
var express = require('express');
var app = express();

// Logging
var logger = require("morgan");
app.use(logger('dev'));

// File to API mappings
if (files && files.length > 0) {
    files.forEach(function(fileName) {
        var mapping =  ROUTES.target + fileName
                                .replace(mockRoot, "")
                                .replace(ROUTES.suffix, "")
                                .replace(/_/g, "/");

        app.get(mapping, function(req, res) {
            var data = fs.readFileSync(fileName, "utf8");
            res.writeHead(200, {"Content-Type": ROUTES.type});
            res.write(data);
            res.end();
        });
        console.log("Registered mapping: %s -> %s", mapping, fileName);
    });    
} else {
    console.log("No mappings found! Please check the configuration.");
}

// Bootstrap
console.log("App root dir: [%s]", appRoot);
console.log("Starting server: [http://%s:%s]", SERVER.host, SERVER.port);
app.listen(SERVER.port, SERVER.host);

module.exports = app;
