var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var webutils = require("../modules/utils/web.js");
var cache = require("../modules/cache");

describe("WebUtils", function() {
    describe("#success()", function() {

        var web, res;

        before(function() {
            web = webutils({type: "application/json"});
            res = httpmock.createResponse({encoding: "utf8"});
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

