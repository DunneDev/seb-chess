const express = require("express");
const path = require("path");
require("./passport-config");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up middleware
require("./middleware")(app);

// Set up routes
require("./routes")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
