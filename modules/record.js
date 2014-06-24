var routes = require("config").Routes;
var request = require('request');
var _ = require('underscore');
var cache = require("./cache");

module.exports = function (app, options) {
    options = options || {};

    return {
        init: function() {
            var me = this;
            _.each(routes, function(route) {
                me.map(route);
            });
        },
        initCacher: function(req, res) {
            var cacher = cache({
                source: {
                    type: route.type,
                    url: route.url + (req._parsedUrl.search || ""),
                    method: req.method
                },
                target: {
                    root: options.root,
                    dest: route.source,
                    suffix: route.suffix
                },
                url: req.url
            });
            cacher.read(res);
        },
        map: function(route) {
            app.get(route.target, this.initCacher);
            app.post(route.target, this.initCacher);
        }
    }
}