var routes = require("config").Routes;
var redirects = require("config").Redirects;
var request = require('request');
var _ = require('underscore');
var cache = require("./cache");
var resolver = require("./utils/nameresolver");

module.exports = function (app, options) {
    options = options || {};

    return {
        init: function() {
            var me = this;
            _.each(routes, function(route) {
                me.map(route);
            });
            _.each(redirects, function(cond) {
                me.redirect(cond);
            });

        },
        initCacher: function(route, req, res) {
            var nameresolver = resolver({
                    root: options.root,
                    dest: route.source,
                    suffix: route.suffix
                }, req);

            var cacher = cache({
                source: {
                    type: route.type,
                    url: route.url + (req._parsedUrl.search || ""),
                    method: req.method
                },
                url: req.url,
                resolver: nameresolver
            });
            cacher.read(res);
        },
        map: function(route) {
            var me = this;
            app.get(route.target, function(req, res) {
                me.initCacher(route, req, res);
            });
            app.post(route.target, function(req, res) {
                me.initCacher(route, req, res);
            });
        }
    }
}