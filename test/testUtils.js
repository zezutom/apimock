var expect = require("chai").expect;
var fs = require("fs");
var httpmock = require("node-mocks-http");
var cache = require("../modules/cache");
var common = require("../modules/utils/common");

var TestUtils = {
    cacher: function (req, route) {
        return cache(route || this.route(req), req);
    },
    route: function(req) {
        return {url: "http://myapp.com" + req.url, source: "/test/mocks/api", suffix: ".json"};
    },
    res: function () {
        return httpmock.createResponse({encoding: "utf8"});
    },
    filepath: function (filename) {
        return common.absolutePath(__dirname, "/mocks/api/" + filename + ".json");
    },
    deleteFile: function (file, callback) {
        fs.unlink(this.filepath(file), function (err) {
            if (err) throw err;
            console.log("'%s' deleted", file);
            if (callback) callback();
        });
    },
    assertResponse: function (res, filename, callback) {
        return this.assertContent(res._getData(), filename, callback);
    },
    assertContent: function (content, filename, callback) {
        var filepath = this.filepath(filename);

        fs.exists(filepath, function (exists) {
            expect(exists).to.be.true;
        });

        fs.readFile(filepath, "utf8", function (err, file) {
            if (err) throw err;
            expect(content).to.eql(file);
            if (callback) callback();
        });
    }
}

module.exports = TestUtils;

