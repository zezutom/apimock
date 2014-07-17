var request = require("request");

var apiUrl = 'http://glosbe.com/gapi/translate?from=pol&dest=eng&format=json&phrase=witaj&pretty=true';

function search(phrase, from, to, format) {
    request({url: apiUrl, timeout: 3000}, function(err, res, body) {
        // todo err handling
        console.log('response: %s', res);
    });
}

exports.search = search;