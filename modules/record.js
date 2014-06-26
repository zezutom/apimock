var routes = require("config").Routes;
var redirects = require("config").Redirects;
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
            _.each(redirects, function(cond) {
                me.redirect(cond);
            });

        },
        initCacher: function(route, req, res) {
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
            var me = this;
            app.get(route.target, function(req, res) {
                me.initCacher(route, req, res);
            });
            app.post(route.target, function(req, res) {
                me.initCacher(route, req, res);
            });
        },
        redirect: function(cond) {
            app.get(cond.when, function(req, res) {
                res.redirect(cond.then);
            });
        }
    }
}