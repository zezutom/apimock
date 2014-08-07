var expect = require("chai").expect;
var fs = require("fs");
var io = require('socket.io-client');
var _ = require('underscore');
var ioserver = require("../modules/utils/ioserver");
var url = 'http://127.0.0.1:5000';
var welcomeJson =  __dirname + "/mocks/api/push/welcome.json";
var loginJson =  __dirname + "/mocks/api/push/login.json";

var options = {
    'transports': ['websocket']
};

var events = [
    {
        "name": "join",
        "target": "welcome",
        "source": welcomeJson
    },
    {
        "name": "login",
        "source": loginJson,
        "private": true
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

                var data = JSON.stringify(file);

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
            expect(JSON.stringify(data)).equal(expectedWelcome);
            counter++;
            client.disconnect();
        };

        var client1 = clients[0];

        client1.on('connect', function() {
            client1.emit('join', 'client1');
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

//    it('Should send a private stored response to the relevant client only', function(done) {
//         // TODO
//    });

});

