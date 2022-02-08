const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

module.exports.io = io;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

require("./db/connection");

server.listen(PORT);

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");

app.get("/", (req, res) => res.redirect("/home"));

app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
