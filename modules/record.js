var routes = require("config").Routes;
var fs = require("fs");
var glob = require("glob");
var _ = require('underscore');

module.exports = function (app, options) {
    options = options || {};
    var appRoot = options.root || "/";

    return {
        init: function () {
            console.log("App root dir: [%s]", appRoot);
            var me = this;
            _.each(routes, function(route) {
                me.map(route);
            });
        },
        // Maps already saved responses to http requests
        map: function(route) {
            var mockRoot = appRoot + route.source;
            var searchPattern = mockRoot + "/**/*" + route.suffix;
            var files = glob.sync(searchPattern);

            if (files && files.length > 0) {
                files.forEach(function(fileName) {
                    var mapping =  route.target + fileName
                        .replace(mockRoot, "")
                        .replace(route.suffix, "")
                        .replace(/_/g, "/");

                    app.get(mapping, function(req, res) {
                        var data = fs.readFileSync(fileName, "utf8");
                        res.writeHead(200, {"Content-Type": route.type});
                        res.write(data);
                        res.end();
                    });
                    console.log("Registered mapping: %s -> %s", mapping, fileName);
                });
            } else {
                console.log("No mappings found! Please check the configuration.");
            }
        },
        // TODO
        play: function () {
        }
    }
};
