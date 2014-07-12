var url = require("url");
var path = require("path");
var querystring = require('querystring');
var common = require("./common");
var _ = require("underscore");
var util = require("util");
var conf = require("./conf");

module.exports = function(route, req) {

    return {
        resolve: function() {
            var name = req.params.filename || null;

            if (!name) {
                name = (common.isPost(req.method)) ? this._post() : this._get();
            }

            var filepath = path.join(conf.source(route), name + (route.suffix || ""));
            console.log("resolved to: '%s'", filepath);
            return filepath;
        },
        _get: function() {
            return this._escape(req.url);
        },
        _post: function() {
            return this._parseBody(req.body);
        },
        _escape: function(name) {
            return querystring.escape(url.parse(name.replace(/^(?:\/)+/, "")).path);
        },
        _parseBody: function(body) {
            var name = "";
            _.each(route.postMap || [], function(item) {
                var val = item.split(".").reduce(function(obj, i) {return (obj) ? obj[i] : undefined}, body);

                console.log("parsing: '%s': '%s'", item, val);
                if (val) {
                    name = (item + "_" + val).replace(/\./g, "_");
                }
            });
            return this._escape(name);
        }
   }
}