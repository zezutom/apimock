var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var webutils = require("../modules/utils/web.js");
var utils = require("./testUtils");

describe("WebUtils", function() {

    var res;

    var web = function(req, route, callback) {
        route = route || utils.route(req);
        return webutils(utils.cacher(req, route), req, res, route, callback);
    };

    describe("#handleReq()", function() {

        beforeEach(function() {
            res = utils.res();
        });

        it("Should invoke a HTTP GET when a GET request is made", function(done) {
            nock("http://myapp.com")
                .get("/api/test/get")
                .reply(200, {});

            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/test/get"
            });

            web(req, null, function (err) {
                if (err) throw err;
                expect(res.statusCode).equal(200);
                utils.deleteFile("api%2Ftest%2Fget");
                done();
            }).handleReq();
        });

        it("Should invoke a HTTP POST when a POST request is made", function(done) {
            nock("http://myapp.com")
                .post("/test/post", {message: "hello world!"})
                .reply(201, {});


            var req = httpmock.createRequest({
                method: "POST",
                url: "/test/post",
                body: {message: "hello world!"}
            });

            var route = {
                url: "http://myapp.com" + req.url,
                source: "/mocks/api",
                suffix: ".json",
                postMap: ["message"]
            };

            web(req, route, function (err) {
                if (err) throw err;
                expect(res.statusCode).equal(201);
                utils.deleteFile("message_hello%2520world!");
                done();
            }).handleReq();
        });
    });
});

