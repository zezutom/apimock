var request = require("request");
var userService = require("config").UserService;

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index')
    });

    app.post('/login', function(req, res) {
        var url = userService.host + ':' + userService.port + '/login';
console.log('url: %s', url);
        request.post(url, {form: req.body}, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.render('profile', {user: JSON.parse(body)})
            } else {
                var contentType = userService.type || 'application/json';
                res.writeHead(500, {"Content-Type": contentType});
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });
}