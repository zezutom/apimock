var client = require("./httpclient")();

var isUndefined = function(prop) {
    return (typeof prop === 'undefined');
}

var add = function(arr, val) {
    if (arr && arr.indexOf(val) === -1) {
        arr.push(val);
    }
};

var remove = function(arr, val) {
    if (!arr) return;
    var i = arr.indexOf(val);
    if (i !== -1) {
        arr.splice(i, 1);
    }
};

// A percentage of price / quantity fluctuation. This is to fake a price change. Set to false
// if you don't want to affect real-time data.
var FAKE_FLUCTUATION = true;

var getPrice = function(value) {
    var price = parseFloat(value);

    // add up to 0.999.. to the original price
    if (FAKE_FLUCTUATION) price += Math.random();

    return price;
};

var getVolume = function(value) {
    var volume = parseInt(value);

    // add up to 100 items to the original quantity
    if (FAKE_FLUCTUATION) volume += Math.floor((Math.random() * 100) + 1);

    return volume;
};

var stockSubscribers = {};

module.exports = function() {

    return {
        subscribe: function(socket, symbol) {
            console.log('you\'ve been subscribed for ' + symbol);

            if (isUndefined(socket.symbols)) {
                socket.symbols = [];
            }
            add(socket.symbols, symbol);

            var subscribers = stockSubscribers[symbol];
            if (isUndefined(subscribers)) {
                subscribers = [];
                stockSubscribers[symbol] = subscribers;
            }
            add(subscribers, socket);
        },
        unsubscribe: function(socket, symbol) {
            console.log('unsubscribing from '  + symbol);
            if (isUndefined(socket.symbols)) {
                return;
            }
            console.log('removing ' + symbol + ' from the client\'s subscription list');
            remove(socket.symbols, symbol);
            remove(stockSubscribers[symbol], socket);
        },
        unsubscribeAll: function(socket) {
            if (isUndefined(socket.symbols)) {
                return;
            }
            console.log('removing all of the client\'s subscriptions: ' + socket.symbols.join());
            socket.symbols.forEach(function(symbol) {
                remove(stockSubscribers[symbol], socket);
            });
            socket.symbols = [];
        },
        pushQuotes: function() {
            for (var symbol in stockSubscribers) {
                var sockets = stockSubscribers[symbol];

                if (sockets.length === 0) continue;

                client.quote(symbol, function(data) {
                    // console.log('recieved quote: ' + data);
                    var result = JSON.parse(data).query.results.quote;
                    var quote = {
                        symbol: result.symbol,
                        bid: getPrice(result.Bid),
                        ask: getPrice(result.Ask),
                        volume: getVolume(result.AverageDailyVolume)};

                    sockets.forEach(function(socket) {
                        // console.log('updating clients with: ' + JSON.stringify(quote));
                        socket.volatile.emit('receive-quote', quote);
                    });
                });
            }
        }
    };
};