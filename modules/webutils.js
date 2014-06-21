var request = require("request");

module.exports = function (options) {
    options = options || {};
    var contentType = options.type || "application/json";

    return {
        success: function(res, body) {
            res.writeHead(200, {"Content-Type": contentType});
            res.write(body);
            res.end();
        },
        error: function(res, err) {
            // TODO
        },
        request: function(res, cacher) {
            var that = this;
            request(options.url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    that.success(res, body);
                    cacher.write(body);
                } else {
                    console.log("error: " + error);
                }
            });
        }
    }
}