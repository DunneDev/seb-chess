const passport = require("passport");
const db = require("./db");
const bcrypt = require("bcrypt");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

function checkUserNotInGame(req, res, next) {
    checkAuthenticated(req, res, () => {
        db.query(
            "SELECT * FROM games WHERE is_active = TRUE AND (player1_userid = ? OR player2_userid = ?)",
            [req.user.id, req.user.id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    if (result.length > 0) {
                        console.log("User is in a game");
                        res.redirect(`/game`);
                    } else {
                        console.log("User is not in a game");
                        next();
                    }
                }
            }
        );
    });
}

function checkUserInGame(req, res, next) {
    checkAuthenticated(req, res, () => {
        db.query(
            "SELECT * FROM games WHERE is_active = TRUE AND (player1_userid = ? OR player2_userid = ?)",
            [req.user.id, req.user.id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    if (result.length > 0) {
                        console.log("User is in a game");
                        next();
                    } else {
                        console.log("User is not in a game");
                        res.redirect(`/`);
                    }
                }
            }
        );
    });
}

module.exports = (app) => {
    app.get("/", checkUserNotInGame, (req, res) => {
        // Get all games from the database
        db.query(
            `SELECT games.id, lobby_name, u1.username AS host_username FROM games
                LEFT JOIN (SELECT id, username FROM users) u1 ON games.player1_userid = u1.id
                LEFT JOIN (SELECT id, username FROM users) u2 ON games.player2_userid = u2.id
            WHERE is_active = TRUE`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/err");
                } else {
                    // Render the index page with the games
                    const games = result.map((game) => {});
                    res.render("index", { games: result, user: req.user });
                }
            }
        );
    });

    app.get("/login", checkNotAuthenticated, (req, res) => {
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

    app.get("/register", checkNotAuthenticated, (req, res) => {
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

    app.get("/game", checkUserInGame, (req, res) => {
        res.send("Game");
    });

    app.post("/game/new", (req, res) => {
        const { lobbyName } = req.body;
        const player1_userid = req.user.id;

        console.log("lobbyName: " + lobbyName);
        console.log("player1_userid: " + player1_userid);

        // Check if this lobby name already exists in the database
        db.query(
            "SELECT * FROM games WHERE lobby_name = ?",
            [lobbyName],
            (err, result) => {
                console.log("db.query result: " + result);
                if (result.length > 0) {
                    console.log("Lobby name already exists: " + lobbyName);
                    res.redirect("/");
                } else {
                    // Insert the new game into the database
                    db.query(
                        "INSERT INTO games (player1_userid, lobby_name) VALUES (?, ?)",
                        [player1_userid, lobbyName],
                        (err, result) => {
                            console.log("db.query result: " + result);
                            if (err) {
                                console.log(err);
                                res.redirect("/");
                            } else {
                                console.log("Game created: " + lobbyName);
                                res.redirect("/");
                            }
                        }
                    );
                }
            }
        );
    });
};
