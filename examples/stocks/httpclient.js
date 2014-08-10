var http = require("http");

var handleErr = function(e) {
    console.log('Couldn\'t fetch quotes, err: ' + e.message);
};

var format = 'json';
var query = 'select * from yahoo.finance.quotes where symbol = \'';
var env = 'http://datatables.org/alltables.env';

module.exports = function() {

    return {
        quote: function(symbol, callback) {
            console.log('quoting symbol: ' + symbol);
            var req = http.get(this.queryUrl(symbol), function(res) {
                var data = '';

                res.on('data', function(chunk) {
                    data += chunk;
                });

                res.on('end', function(e) {
                    callback(data);
                });

                res.on('error', handleErr);
            });

            req.on('error', handleErr);
            req.end();
        },
        queryUrl: function(symbol) {
            return 'http://query.yahooapis.com/v1/public/yql?q=' + query + symbol + '\'&format=' + format + '&env=' + env;
        }
    }
};