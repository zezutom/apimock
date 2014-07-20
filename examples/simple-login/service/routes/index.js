var users = {
    'thedude': {
        firstName: 'John',
        lastName: 'Doe',
        email: 'thedude@gmail.com',
        balance: '100$'
    }
};
module.exports = function(app) {
    app.post('/login', function(req, res) {
console.log('yes...');
        var username = req.body.username;
        var details = users[username];
        var response = {
            username: username,
            details: details || {},
            valid: details !== undefined

        };
console.log('response: %s', JSON.stringify(response));
        res.send(response);
    });
}