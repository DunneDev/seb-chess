const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, "public")));

    app.use(
        session({
            secret: "your-secret-key-here",
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(flash());

    // Use Passport.js for authentication
    app.use(passport.initialize());
    app.use(passport.session());
};
