var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var webutils = require("../modules/utils/web.js");

var config = {
    type: "application/json",
    url: "http://myserver.com/person/1",
    method: "GET"
};

var web = webutils(config);
var res;

describe("WebUtils", function() {
    beforeEach(function(done) {
        res = httpmock.createResponse({encoding: "utf8"});
        web.success(res, '{"id":"1","name":"test"}');
        return done();
    });
    describe("#success()", function() {
        it("Should be a 200 OK", function() {
            expect(res.statusCode).equal(200);
        });
        it("Should be of the expected content type", function() {
            expect(res.getHeader("Content-Type")).equal(config.type);
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

