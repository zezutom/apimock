// internal views
var viewPath = process.cwd() + "/views/"

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render(viewPath + "home");
    });
}
