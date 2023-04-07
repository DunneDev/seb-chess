const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lap2lapD",
    database: "chess",
});

db.connect((err) => {
    if (err) {
        console.log("Failed to connect to MySQL database: " + err);
    } else {
        console.log("Connected to MySQL database...");
    }
});

module.exports = db;
