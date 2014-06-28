var expect = require("chai").expect;
var fs = require("fs");
var httpmock = require("node-mocks-http");
var nock = require('nock');
var cache = require("../modules/cache");
var utils = require("../modules/utils/common");
var resolver = require("../modules/utils/nameresolver");

describe("Cacher", function() {

    var cacheConfig = function(req) {
        var nameresolver = resolver({
                root:__dirname.replace(/\\/g,"/"),
                dest: "/mocks/api",
                suffix: ".json"
            }, req);

        return {
            source: {
                type: "application/json",
                url: "http://myapp.com" + req.url
            },
            url: req.url,
            resolver: nameresolver
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

        after(function(done) {
            fs.unlink(savedFile, function(err) {
                if (err) throw err;
                console.log("'%s' deleted", savedFile);
                done();
            });
        });

        it("Should be able to read a response from a file", function() {
            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/links"
            });
            cache(cacheConfig(req))
                .read(res, function () {
                    fs.readFile(utils.absolutePath(__dirname, "/mocks/api/api%2Flinks.json"), "utf8",
                        function (err, file) {
                            if (err) throw err;
                            expect(res._getData()).to.eql(file);
                        });
                });
        });
        it("Should download the response if it hasn't been saved", function() {
            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/links/1"
            });
            cache(cacheConfig(req))
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

        after(function(done) {
            fs.unlink(savedFile, function(err) {
                if (err) throw err;
                console.log("'%s' deleted", savedFile);
                done();
            });
        });

        it("Should save a response as a file", function(done) {
            var body = JSON.stringify({key: "greeting", value: "hello world"});
            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/test"
            });
            cache(cacheConfig(req))
                .write(body, function () {
                    fs.readFile(savedFile, "utf8",
                        function (err, file) {
                            if (err) throw err;
                            expect(body).to.eql(file);
                            done();
                        });
                });
        });
    });
});
