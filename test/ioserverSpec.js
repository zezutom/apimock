var expect = require("chai").expect;
var fs = require("fs");
var io = require('socket.io-client');
var _ = require('underscore');
var ioserver = require("../modules/utils/ioserver");
var url = 'http://127.0.0.1:5000';
var welcomeJson =  __dirname + "/mocks/api/push/welcome.json";
var loginJson =  __dirname + "/mocks/api/push/login.json";

var options = {
    'transports': ['websocket'],
    'force new connection': true
};

var events = [
    {
        "name": "anonymous",
        "target": "welcome",
        "source": welcomeJson
    },
    {
        "name": "login",
        "source": loginJson,
        "private": true,
        "recipient": "user"
    }
];

var expectedWelcome;
var expectedLogin;

describe('I/O Server', function() {

    var addClient = function() {
        return io.connect(url, options);
    };

    // Load the configuration
    before(function(done) {
        ioserver().init(events);

        var counter = 0;

        var attemptDone = function() {
            if (++counter === 2) {
                done();
            }
        };

        var loadResponse = function(path) {
            fs.readFile(path, function(err, file) {
                if (err) {
                    throw err();
                }

                // parse + stringify guarantee the json will be compact
                var data = JSON.stringify(JSON.parse(file));

                if (path === welcomeJson) {
                    expectedWelcome = data;
                } else {
                    expectedLogin = data;
                }

                attemptDone();
            });
        };

        loadResponse(welcomeJson);
        loadResponse(loginJson);
    });

    it('Should broadcast a public stored response to all clients', function(done) {

        var clients = [addClient(), addClient(), addClient()];
        var counter = 0;

        var assertData = function(data, client) {
            expect(data).equal(expectedWelcome);
            counter++;
            client.disconnect();
        };

        var client1 = clients[0];

        client1.on('connect', function() {
            client1.emit('anonymous', 'client1');
        });

        _.each(clients, function(client) {
            client.on('welcome', function(data) {
                assertData(data, client);
                if (counter === clients.length) {
                    done();
                }
            });
        });
    });

    it('Should send a private stored response to a single client only', function(done) {

        var clients = [addClient(), addClient(), addClient()];
        var client1 = clients[0];

        client1.on('connect', function() {
            client1.emit('login', 'client1');
        });

        _.each(clients, function(client) {
            client.on('login', function(data) {
                // only the authorized client should receive the private message
                expect(client).to.eql(client1);
                expect(data).equal(expectedLogin);
                done();
            });
        });
    });
});

