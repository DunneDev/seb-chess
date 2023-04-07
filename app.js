const express = require("express");
const path = require("path");
require("./passport-config");
const http = require("http");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up middleware
require("./middleware")(app);

// Set up routes
require("./routes")(app);

// Set up socket.io
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("a user connected");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
