var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var fs = require("fs");
var querystring = require('querystring');
var webutils = require("../modules/utils/web.js");
var cache = require("../modules/cache");

describe("WebUtils", function() {

    describe("#get()", function() {

        var res, cacher, web, filename;

        before(function(done) {

            nock("http://myapp.com")
                .get("/users/1")
                .reply(200, JSON.stringify({id: "1", username: "test", email: "test@gmail.com"}));

            filename = __dirname.replace(/\\/g,"/") +
                "/mocks/api/" + querystring.escape("api/users/1") + ".json";

            cacher = cache({
                source: {
                    type: "application/json",
                    url: "http://myapp.com/users/1"
                },
                target: {
                    root:__dirname.replace(/\\/g,"/"),
                    dest: "/mocks/api",
                    suffix: ".json"
                },
                url: "api/users/1"
            });

            res = httpmock.createResponse({encoding: "utf8"});

            web = webutils(cacher, res,
                {type: "application/json", url: "http://myapp.com/users/1"},
                function(err) {
                    if (err) throw err;
                    done();
                }
            );

            web.get();
        });

        after(function(done) {
            fs.unlink(filename, function(err) {
                if (err) throw err;
                console.log("'%s' deleted", filename);
                done();
            });
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
            fs.exists(filename, function(exists) {
                expect(exists).to.be.true;
            });

            fs.readFile(filename, "utf8", function(err, file) {
                if (err) throw err;
                expect(res._getData()).to.eql(file);
            });
        });
    });
});

