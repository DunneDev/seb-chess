const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");
const passport = require("passport");

// Set up Passport.js local strategy for authentication
passport.use(
    new LocalStrategy((username, password, done) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], (err, result) => {
            if (err) {
                console.log("Error retrieving user from database: " + err);
                return done(err);
            } else {
                if (result.length === 0) {
                    console.log("User not found");
                    return done(null, false, { message: "User not found" });
                } else {
                    const user = result[0];
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log("Error comparing passwords: " + err);
                            return done(err);
                        } else {
                            if (isMatch) {
                                // Passwords match, user is authenticated
                                console.log("User authenticated");
                                return done(null, user);
                            } else {
                                console.log("Invalid password");
                                return done(null, false, {
                                    message: "Invalid password",
                                });
                            }
                        }
                    });
                }
            }
        });
    })
);

// Serialize user object for session storage
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user object from session storage
passport.deserializeUser((id, done) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log("Error retrieving user from database: " + err);
            return done(err);
        } else {
            const user = result[0];
            return done(null, user);
        }
    });
});
