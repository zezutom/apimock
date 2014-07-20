var express = require('express');

var bodyParser = require('body-parser');

// create our app
var app = express();

app.use(bodyParser());
app.set("view engine", "jade");
require("./routes/index")(app);
app.listen(8080);

module.exports = app;