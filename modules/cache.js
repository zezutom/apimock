var url = require("url");
var path = require("path");
var fs = require("fs");
var querystring = require('querystring');
var webutils = require("./utils/web");
var utils = require("./utils/common");

module.exports = function (options) {
    options = utils.conf(options);
    var target = utils.conf(options.target);
    var root = utils.conf(target.root, "/");
    var dest = root + utils.conf(target.dest, "");
    var uri = querystring.escape(url.parse(options.url).path);
    var filename = path.join(dest, uri + utils.conf(target.suffix, ""));
    var web = webutils(options.source);

    return {
        read: function(res) {
            var that = this;
            fs.readFile(filename, function(err, file) {
                if (err) {
                   web.request(res, that);
                } else {
                    web.success(res, file);
                }
            });
        },
        write: function(body) {
            fs.writeFile(filename, body, function(err) {
                if (err) throw err;
                console.log("'%s' saved", filename);
            });
        }
    }
}