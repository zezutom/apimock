var fs = require("fs");
var resolver = require("./utils/nameresolver");
var webUtils = require("./utils/web");

module.exports = function (route, req) {
    var filename = resolver(route, req).resolve();

    return {
        read: function(res, callback) {
            var web = webUtils(this, req, res, route, callback);
            fs.readFile(filename, function(err, file) {
                if (err) {
                    web.handleReq();
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