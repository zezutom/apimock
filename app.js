// #1 Set up API mock, where responses will be loaded
// from the filesystem
var API_DIR = "/test/mocks/api";
var DEFAULT_SERVER = "127.0.0.1";
var DEFAULT_PORT = "8080";
var appRoot = __dirname.replace(/\\/g,"/"),
    ipaddress = DEFAULT_SERVER,
    port = DEFAULT_PORT,
    mockRoot = appRoot + API_DIR,
    suffix = ".json",
    searchPattern = mockRoot + "/**/*" + suffix,
    apiRoot = "/api",
    fs = require("fs"),
    glob = require("glob");
var logger = require("morgan");

// #2 Create express app
var express = require('express');
var app = express();

// #3 Configure logging and error handling
app.use(logger('dev'));

// #4 Search for stored files
var files = glob.sync(searchPattern);

// #5 Map each of the found files
if (files && files.length > 0) {
    files.forEach(function(fileName) {
        var mapping = apiRoot + fileName
                                .replace(mockRoot, "")
                                .replace(suffix, "");
        app.get(mapping, function(req, res) {
            var data = fs.readFileSync(fileName, "utf8");
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(data);
            res.end();
        });
        console.log("Registered mapping: %s -> %s", mapping, fileName);
    });    
} else {
    console.log("No mappings found! Please check the configuration.");
}

// #6 Start the server
console.log("App root dir: [%s]", appRoot);
console.log("Starting server: [http://%s:%s]", ipaddress, port);
app.listen(port, ipaddress);

module.exports = app;
