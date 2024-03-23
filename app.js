const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./models/users.model");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//session create

// home route
app.get("/", (req, res) => {
  res.status(200).render("home", { title: "Home" });
});

// register route
app.get("/register", (req, res) => {
  res.status(200).render("register", { title: "Register" });
});
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(401).render("error", { error: "Username is already taken!" });
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        await newUser.save();
        res.redirect("/login");
      });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// login route
app.get("/login", (req, res) => {
  res.status(200).render("login", { title: "Login" });
});
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).render("error", { error: "Not Found Username!" });
    } else {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (result) {
          res.redirect("/profile");
        } else {
          res.status(401).render("error", { error: "Incorrect Password!" });
        }
      });
    }
  } catch (error) {
    res.status(500).render("error", { error: error });
  }
});

// profile route
app.get("/profile", (req, res) => {
  res.render("profile", { title: "Profile" });
});

// logout
app.get("/logout", (req, res) => {
  res.redirect("/");
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).render("error", { error: "404 Not Found !" });
});

// server error handler
app.use((err, req, res, next) => {
  res.status(500).render("error", { error: err.message });
});

module.exports = app;
