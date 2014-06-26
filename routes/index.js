module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("home");
    });

    app.get("/login", function(req, res) {
        res.render("login");
    });

    app.post("/loginSubmit", function(req, res) {
        res.redirect("http://localhost/loginSubmitted");
    });
}
