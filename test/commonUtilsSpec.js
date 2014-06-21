var expect = require("chai").expect;
var utils = require("../modules/utils/common.js");

var config = {
    "Server": {
        "host": "localhost",
        "port": 8080,
        "timeout": 2000
    }
}


describe("CommonUtils", function() {
    describe("#conf()", function() {
        it("Should return a config value if it exists", function() {
            expect(utils.conf(config.Server.host)).equal("localhost");
            expect(utils.conf(config.Server.port)).equal(8080);
            expect(utils.conf(config.Server.timeout)).equal(2000);
        });

        it("Should return an empty value " +
            "if there is no config found " +
            "and no fallback is provided", function() {
             expect(utils.conf(config.Routes)).eql({});
        });

        it ("Should return a provided fallback if no config is found", function() {
            expect(utils.conf(config.Test, "Happy Testing!")).equal("Happy Testing!");
        });
    });
});