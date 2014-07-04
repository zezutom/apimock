var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var webutils = require("../modules/utils/web.js");
var utils = require("./testUtils");

describe("WebUtils", function() {

    var res = utils.res(), filename = "api%2Fusers%2F1";

    var web = function(callback) {
        var req = httpmock.createRequest({
            method: "GET",
            url: "/api/users/1"
        });

        return webutils(utils.cacher(req), req, res, utils.route(req), callback);
    };

    describe("#_get()", function() {

        before(function(done) {

            nock("http://myapp.com")
                .get("/api/users/1")
                .reply(200, JSON.stringify({id: "1", username: "test", email: "test@gmail.com"}));

            web(function (err) {
                if (err) throw err;
                done();
            })._get();
        });

        after(function(done) {
            utils.deleteFile(filename, done);
        });

        it("Should be a 200 (OK)", function() {
            expect(res.statusCode).equal(200);
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
            expect(data.id).equal("1");
            expect(data.username).equal("test");
            expect(data.email).equal("test@gmail.com");
        });

        it("Should save the response to a file", function() {
            utils.assertResponse(res, filename);
        });
    });
});

