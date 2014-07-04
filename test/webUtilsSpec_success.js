var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var webutils = require("../modules/utils/web.js");
var utils = require("./testUtils");

describe("WebUtils", function() {
    describe("#success()", function() {

        var res = utils.res();

        before(function() {
            var req = httpmock.createRequest();
            var web = webutils(utils.cacher(req), req, res, {});
            web.success(res, '{"id":"1","name":"test"}');
        });

        it("Should be a 200 OK", function() {
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
            expect(data.name).equal("test");
        });
    });
});

