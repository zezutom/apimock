var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var testUtils = require("./testUtils");
var cache = require("../modules/cache");

describe("Cacher", function() {
    var res, filename;

    var deleteFile = function(done) {
        testUtils.deleteFile(filename, done);
    };

    beforeEach(function() {
        res = testUtils.res();
    });

    describe("#read()", function() {

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
            filename = "api%2Flinks%2F1";
        });

        after(deleteFile);

        it("Should be able to read a response from a file", function() {

            testUtils.cacher(httpmock.createRequest({url: "/api/links"}))
                .read(res, function() {
                    testUtils.assertResponse("api%2Flinks");
                });
        });

        it("Should download the response if it hasn't been saved", function(done) {

            testUtils.cacher(httpmock.createRequest({url: "/api/links/1"}))
                .read(res, function() {
                    testUtils.assertResponse(res, filename, done);
                });
        });
    });

    describe("#write()", function() {

        before(function() {
            filename = "api%2Ftest";
        });

        after(deleteFile);

        it("Should save a response to a file", function(done) {
            var body = JSON.stringify({key: "greeting", value: "hello world"});

            testUtils.cacher(httpmock.createRequest({url: "/api/test"}))
                .write(body, function() {
                    testUtils.assertContent(body, filename, done);
                });
        });
    });
});
