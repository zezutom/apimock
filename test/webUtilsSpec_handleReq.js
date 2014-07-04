var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var webutils = require("../modules/utils/web.js");
var utils = require("./testUtils");

describe("WebUtils", function() {

    var res = utils.res(), filename = "api%2Ftest%2Fget";

    var web = function(req, callback) {
        return webutils(utils.cacher(req), req, res, utils.route(req), callback);
    };

    describe("#handleReq()", function() {

        after(function(done) {
            utils.deleteFile(filename, done);
        });

        it("Should invoke a HTTP GET when a GET request is made", function(done) {
            nock("http://myapp.com")
                .get("/api/test/get")
                .reply(200, {});

            var req = httpmock.createRequest({
                method: "GET",
                url: "/api/test/get"
            });

            web(req, function (err) {
                if (err) throw err;
                expect(res.statusCode).equal(200);
                done();
            }).handleReq();
        });
    });
});

