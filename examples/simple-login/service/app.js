var express = require('express');

var bodyParser = require('body-parser');

// create our app
var app = express();

app.use(bodyParser());
require("./routes/index")(app);
app.listen(8081);

module.exports = app;