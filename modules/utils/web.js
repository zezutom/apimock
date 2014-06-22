var server = require("config").Server;
var request = require("request");
var utils = require("./common");

module.exports = function (cacher, res, options, callback) {
    options = utils.conf(options);
    var contentType = utils.conf(options.type, "application/json");

    return {
        success: function(res, body, code) {
            res.writeHead(code || 200, {"Content-Type": contentType});
            res.write(body);
            res.end();
        },
        error: function(res, err) {
            // TODO
            console.log("error: " + err);
        },
        get: function() {
            request({url: options.url, timeout: server.timeout}, this._handleResponse.bind(this));
        },
        post: function() {
            request.post(options.url, {form: options.form}, this._handleResponse.bind(this));
        },
        _handleResponse: function(error, response, body) {
            if (!error && response.statusCode == 200 || response.statusCode == 201) {
                this.success(res, body, response.statusCode);
                cacher.write(body);
                if (callback) callback();
            } else {
                this.error(res, error);
                if (callback) callback(error);
            }
        }
    }
}