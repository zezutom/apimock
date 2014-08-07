var routes = require("config").Routes;
var events = require("config").Events;
var _ = require('underscore');
var util = require('util');
var cache = require("./cache");
var common = require('./utils/common');
var ioserver = require('./utils/ioserver');

module.exports = function (app) {

    return {
        init: function() {
            _.each(routes, function(route) {
                this.map(route);
            }, this);
            ioserver().init(events);
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
};