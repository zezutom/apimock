var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var utils = require("./testUtils");

describe("Cacher", function() {
    var res, filename;

    var deleteFile = function(done) {
        utils.deleteFile(filename, done);
    };

    beforeEach(function() {
        res = utils.res();
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
            var req =  httpmock.createRequest({
                method: "GET",
                url: "/api/links"
            });

            utils.cacher(req).read(res, function() {
                utils.assertResponse("api%2Flinks");
            });
        });

        it("Should download the response if it hasn't been saved", function(done) {
            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/links/1"
            });

            utils.cacher(req).read(res, function() {
                utils.assertResponse(res, filename, done);
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

            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/test"
            });

            utils.cacher(req).write(body, function() {
                utils.assertContent(body, filename, done);
            });
        });
    });
});
