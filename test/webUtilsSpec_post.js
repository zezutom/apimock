var expect = require("chai").expect;
var httpmock = require("node-mocks-http");
var nock = require('nock');
var fs = require("fs");
var querystring = require('querystring');
var webutils = require("../modules/utils/web.js");
var cache = require("../modules/cache");

describe("WebUtils", function() {

    describe("#post()", function() {

        var res, cacher, web, filename;

        before(function(done) {

            nock("http://myapp.com")
                .post("/users", {username: "test", email: "test@gmail.com"})
                .reply(201, {
                    ok: true,
                    id: "1"
                });

            filename = __dirname.replace(/\\/g,"/") +
                "/mocks/api/" + querystring.escape("api/users") + ".json";

            cacher = cache({
                source: {
                    type: "application/json",
                    url: "http://myapp.com/users"
                },
                target: {
                    root:__dirname.replace(/\\/g,"/"),
                    dest: "/mocks/api",
                    suffix: ".json"
                },
                url: "api/users"
            });

            res = httpmock.createResponse({encoding: "utf8"});

            web = webutils(cacher, res,
                {
                    type: "application/json",
                    url: "http://myapp.com/users",
                    form: {username: "test", email: "test@gmail.com"}
                },
                function(err) {
                    if (err) throw err;
                    done();
                }
            );

            web.post();
        });

        after(function(done) {
            fs.unlink(filename, function(err) {
                if (err) throw err;
                console.log("'%s' deleted", filename);
                done();
            });
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

