var server = require("config").Server;
var request = require("request");
var utils = require("./common");

module.exports = function (options) {
    options = utils.conf(options);
    var contentType = utils.conf(options.type, "application/json");

    return {
        success: function(res, body) {
            res.writeHead(200, {"Content-Type": contentType});
            res.write(body);
            res.end();
        },
        error: function(res, err) {
            // TODO
            console.log("error: " + error);
        },
        request: function(res, cacher) {
            var that = this;
            request({url: options.url,
                     method: options.method,
                     timeout: server.timeout},
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        that.success(res, body);
                        cacher.write(body);
                    } else {
                        that.error(res, error);
                    }
            });
        }
    }
}