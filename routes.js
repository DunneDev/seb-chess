const passport = require("passport");
const db = require("./db");

module.exports = (app) => {
    app.get("/", (req, res) => {
        // Check if user is authenticated
        if (req.isAuthenticated()) {
            res.render("index", { username: req.user.username });
        } else {
            res.redirect("/login");
        }
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.post(
        "/login",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true,
        })
    );

    app.get("/register", (req, res) => {
        res.render("register");
    });

    app.post("/register", (req, res) => {
        const { username, password } = req.body;

        // Check if this username already exists in the database
        db.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, result) => {
                if (result.length > 0) {
                    console.log("Username already exists: " + username);
                    res.redirect("/register");
                } else {
                    // Hash the password using bcrypt
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                            res.redirect("/register");
                        } else {
                            // Insert the new user into the database
                            db.query(
                                "INSERT INTO users (username, password) VALUES (?, ?)",
                                [username, hash],
                                (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.redirect("/register");
                                    } else {
                                        console.log(
                                            "User registered: " + username
                                        );
                                        res.redirect("/");
                                    }
                                }
                            );
                        }
                    });
                }
            }
        );
    });
};
