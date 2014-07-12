var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var webutils = require("../modules/utils/web.js");
var utils = require("./testUtils");

describe("WebUtils", function() {

    var res = utils.res(), filename = "username_test";

    var web = function(callback) {
        var req = httpmock.createRequest({
            method: "POST",
            url: "/users",
            body: {username: "test", email: "test@gmail.com"}
        });

        var route = {
            url: "http://myapp.com" + req.url,
            source: "/test/mocks/api",
            suffix: ".json",
            postMap: ["username"]
        };

        return webutils(utils.cacher(req, route), req, res, route, callback);
    };

    describe("#_post()", function() {

        before(function(done) {

            nock("http://myapp.com")
                .post("/users", {username: "test", email: "test@gmail.com"})
                .reply(201, {
                    ok: true,
                    id: "1"
                });

            web(function (err) {
                if (err) throw err;
                done();
            })._post();
        });

        after(function(done) {
            utils.deleteFile(filename, done);
        });

        it("Should be a 201 (CREATED)", function() {
            expect(res.statusCode).equal(201);
        });

        it("Should be of the expected content type", function() {
            expect(res.getHeader("Content-Type")).equal("application/json");
        });

        it("Should have the expected encoding", function() {
            expect(res._isUTF8()).to.be.true;
        });

        it("Should return the expected data", function() {
            var data = JSON.parse(res._getData());
            expect(data).to.be.ok;
            expect(data.ok).to.be.true;
            expect(data.id).equal("1");
        });

        it("Should save the response to a file", function() {
            utils.assertResponse(res, filename);
        });
    });
});

