var server = require("config").Server;

// Configuration directory: either it's provided via an env. variable,
// or it defaults to the project root directory
var root = process.env.NODE_CONFIG_DIR || process.cwd();

var ConfUtil = {
    views: function() {
        return root + (server.views || "views");
    },
    routes: function() {
        return root + (server.routes || "routes/index");
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

module.exports = ConfUtil;