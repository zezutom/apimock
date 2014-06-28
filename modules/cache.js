var fs = require("fs");
var webutils = require("./utils/web");
var utils = require("./utils/common");

module.exports = function (options) {
    options = utils.conf(options);
    var filename = options.resolver.resolve();
    var isGet = utils.conf(options.method, "GET").toUpperCase() === "GET";

    return {
        read: function(res, callback) {
            var web = webutils(this, res, options.source, callback);
            fs.readFile(filename, function(err, file) {
                if (err) {
                    (isGet) ? web.get() : web.post();
                } else {
                    web.success(res, file);
                }
            });
        },
        write: function(body, callback) {
            fs.writeFile(filename, body, function(err) {
                if (err) throw err;
                console.log("'%s' saved", filename);
                if (callback) callback();
            });
        }
    }
}