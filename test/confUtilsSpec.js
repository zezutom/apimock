var expect = require("chai").expect;
var server = require("config").Server;
var conf = require("../modules/utils/conf.js");

describe("ConfUtils", function() {

    var root = process.cwd();

    describe("#views", function() {
        it("Should return an absolute path to the views directory", function() {
            expect(conf.views()).equal(root + "/views");
        });
    });

    describe("#routes", function() {
        it("Should return an absolute path to the routes file", function() {
            expect(conf.routes()).equal(root + "/routes/index");
        });
    });

    describe("#port", function() {
        it("Should return the server port number", function() {
            expect(conf.port()).equal(server.port);
        });
    });

    describe("#port", function() {
        it("Should return the server hostname", function() {
            expect(conf.host()).equal(server.host);
        });
    });

    describe("#source", function() {
        it("Should return the source value from the provided route", function() {
            var source = "/test/mocks/api";
            expect(conf.source({"source": source})).equal(root + source);
        });
    });

});
