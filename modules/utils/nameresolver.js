var url = require("url");
var path = require("path");
var querystring = require('querystring');
var common = require("./common");
var _ = require('underscore');
var util = require('util');

module.exports = function(root, route, req) {

    return {
        resolve: function() {
            var name = (common.isPost(req.method)) ? this._post() : this._get();
            var filepath = path.join((root || "/") + (route.source || ""), name + (route.suffix || ""));
            console.log("resolved to: '%s'", filepath);
            return filepath;
        },
        _get: function() {
            return querystring.escape(url.parse(req.url.replace(/^(?:\/)+/, "")).path);
        },
        _post: function() {
            return this._parseBody(req.body);
        },
        _parseBody: function(body) {
            var name = "";
            _.each(route.postMap || [], function(item) {
                var keys = item.split(".");
                if (keys.length == 0) return;

                var root = keys[0];

                if (_.has(body, root)) {
                    var iter = function(key, head, tail) {
                        if (_.isObject(head)) {
                            name += key + "_";
                            return iter(_.first(tail), head[key], _.without(tail, key) || []);
                        } else {
                            name += head;
                        }
                        return name;
                    };
                    return iter(root, _.pick(body,root), _.without(keys, root));
                }
            });
            return name;
        }
    }
}