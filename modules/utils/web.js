var server = require("config").Server;
var request = require("request");
var common = require("./common");

module.exports = function (cacher, req, res, route, callback) {

    var parsedUrl = req._parsedUrl || {};
    var url = (route.url || "") + (parsedUrl.search || "");
    var contentType = common.conf(route.type, "application/json");

    return {
        success: function(res, body, code) {
            res.writeHead(code || 200, {"Content-Type": contentType});
            res.write(body);
            res.end();
        },
        error: function(res, err) {
            res.writeHead(500, {"Content-Type": contentType});
            res.write(JSON.stringify(err));
            res.end();
        },
        handleReq: function() {
            common.isPost(req.method) ? this._post() : this._get();
        },
        _get: function() {
            request({url: url, timeout: server.timeout}, this._handleResponse.bind(this));
        },
        _post: function() {
            request.post(url, {form: req.body}, this._handleResponse.bind(this));
        },
        _handleResponse: function(error, response, body) {
            if (!error && (response && response.statusCode == 200 || response.statusCode == 201)) {
                this.success(res, body, response.statusCode);
                cacher.write(body, function() {
                    if (callback) callback();
                });
            } else {
                this.error(res, error);
                if (callback) callback(error);
            }
        }
    }
}