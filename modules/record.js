var routes = require("config").Routes;
var _ = require('underscore');
var util = require('util');
var cache = require("./cache");
var common = require('./utils/common');

module.exports = function (app) {

    return {
        init: function() {
            _.each(routes, function(route) {
                this.map(route);
            }, this);
        },
        saveRes: function(route, req, res, post) {
            cache(route, req, post).read(res);
        },
        map: function(route) {
            var me = this;
            if (common.isPost(route.method)) {
                app.post(route.target, function(req, res) {
                    me.saveRes(route, req, res, true);
                });
            } else {
                app.get(route.target, function(req, res) {
                    me.saveRes(route, req, res);
                });
            }
        }
    }
}