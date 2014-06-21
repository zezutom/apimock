var url = require("url");
var path = require("path");
var fs = require("fs");
var querystring = require('querystring');
var webutils = require("./webutils");

module.exports = function (req, options) {
    options = options || {};
    var root = options.root || "/";
    var dest = root + options.dest;
    var uri = querystring.escape(url.parse(req.url).path);
    var filename = path.join(dest, uri + options.suffix);

    var web = webutils({
        type: options.type,
        url: options.url
    });

    return {
        read: function(res) {
            //console.log("uri: '%s", JSON.stringify(url.parse(req.url)));
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