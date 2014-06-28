var url = require("url");
var path = require("path");
var querystring = require('querystring');
var utils = require("./common");
var _ = require('underscore');
var util = require('util');

module.exports = function(options, req) {
    var root = utils.conf(options.root, "/");
    var dest = root + utils.conf(options.dest, "");
    var postMap = utils.conf(options.postMap, []);

    return {
        resolve: function() {
            var handler = (req.method === "GET") ? this._get : this._post;
            var filepath = path.join(dest, handler() + utils.conf(options.suffix, ""));
            console.log("resolved to: '%s'", filepath);
            return filepath;
        },
        _get: function() {
            return querystring.escape(url.parse(req.url.replace(/^(?:\/)+/, "")).path);
        },
        _post: function() {
            // console.log("http post resolver: '%s'", util.inspect(req));
            var name = "";
            var body = req.body;
            _.each(postMap, function(item) {
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