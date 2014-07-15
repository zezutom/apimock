var server = require("config").Server;
var fs = require("fs");

// Configuration directory: either it's provided via an env. variable,
// or it defaults to the project root directory
var root = process.env.NODE_CONFIG_DIR || process.cwd();

var ConfUtils = {
    views: function() {
        return this._path("views");
    },
    routes: function() {
        return this._path("routes/index.js");
    },
    _path: function(file) {
        var path = root + "/" + file;
        return (fs.existsSync(path)) ? path.replace("\.js", "") : undefined;
    },
    port: function() {
        return server.port;
    },
    host: function() {
        return server.host;
    },
    source: function(route) {
        return root + route.source;
    }
};

module.exports = ConfUtils;