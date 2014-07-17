var request = require("request");

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', { title: 'Glosbe Dictionary' });
    });

    app.get('/search', function(req, res) {
        var from = req.query['from'];
        var to = req.query['to'];
        var word = req.query['word'];

        var apiUrl = 'http://localhost:8082/api?from=' + from + '&dest=' + to + '&format=json&phrase=' + word + '&pretty=true';

        request({url: apiUrl, timeout: 3000}, function(err, resp, body) {
            console.log(body);
            res.render('index', {title: 'Glosbe Dictionary', phrase: 'witaj', data: JSON.parse(body)});
        });
    });

}