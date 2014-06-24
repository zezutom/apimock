var expect = require("chai").expect;
var fs = require("fs");
var httpmock = require("node-mocks-http");
var nock = require('nock');
var cache = require("../modules/cache");
var utils = require("../modules/utils/common");

describe("Cacher", function() {

    var cacheConfig = function(url, sourceUrl) {
        return {
            source: {
                type: "application/json",
                url: sourceUrl
            },
            target: {
                root:__dirname.replace(/\\/g,"/"),
                dest: "/mocks/api",
                suffix: ".json"
            },
            url: url
        };
    };

    describe("#read()", function() {

        var res, savedFile;

        beforeEach(function() {
            res = httpmock.createResponse({encoding: "utf8"});
        });

        before(function() {
            nock("http://myapp.com")
                .get("/api/links/1")
                .reply(200, JSON.stringify({
                        "id": "1",
                        "title": "Rails is Omakase",
                        "links": {
                            "author": "12"
                        }
                    }
                ));
            savedFile = utils.absolutePath(__dirname, "/mocks/api/api%2Flinks%2F1.json");
        });

        after(function() {
            fs.unlink(savedFile, function(err) {
                if (err) throw err;
                console.log("'%s' deleted", savedFile);
            });
        });

        it("Should be able to read a response from a file", function() {
            cache(cacheConfig("api/links", "http://myapp.com/api/links"))
                .read(res, function () {
                    fs.readFile(utils.absolutePath(__dirname, "/mocks/api/api%2Flinks.json"), "utf8",
                        function (err, file) {
                            if (err) throw err;
                            expect(res._getData()).to.eql(file);
                        });
                });
        });
        it("Should download the response if it hasn't been saved", function() {
            cache(cacheConfig("api/links/1", "http://myapp.com/api/links/1"))
                .read(res, function() {
                fs.readFile(savedFile, "utf8", function(err, file) {
                    if (err) throw err;
                    expect(res._getData()).to.eql(file);
                });
            });
        });
    });

    describe("#write()", function() {
        var savedFile;

        before(function() {
            savedFile = utils.absolutePath(__dirname, "/mocks/api/api%2Ftest.json");
        });

        it("Should save a response as a file", function() {
            var body = JSON.stringify({key: "greeting", value: "hello world"});
            cache(cacheConfig("api/test", "http://myapp.com/api/test"))
                .write(body, function () {
                    fs.readFile(savedFile, "utf8",
                        function (err, file) {
                            if (err) throw err;
                            expect(body).to.eql(file);
                        });
                });
        });
    });
});
