require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set("view options", { layout: "layout" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const user = { username, email, password };
  const users = require("./users.json");
  users.push(user);
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = require("./users.json");
  const user = users.find(
    (user) => user.username === username || user.email === username
  );
  if (user && user.password === password) {
    const token = jwt.sign(user, process.env.SECRET);
    res.cookie("loged", token, { maxAge: 60 * 60 * 1000, httpOnly: true }); // 1 hour
    res.redirect("/");
  } else {
    res.redirect("/login?error=true");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("loged");
  res.redirect("/");
});

app.get("/", (req, res) => {
  const token = req.cookies.loged;
  let user = false;
  if (token) {
    try {
      user = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      user = false;
    }
  }
  const loged = !!user;
  res.render("index", { title: "Homepage", loged, user });
});

app.get("/about", (req, res) => {
  const token = req.cookies.loged;
  let user = false;
  if (token) {
    try {
      user = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      user = false;
    }
  }
  const loged = !!user;
  res.render("about", { title: "About Us", loged, user });
});

app.get("/articlelist", (req, res) => {
  const token = req.cookies.loged;
  let user = false;
  if (token) {
    try {
      user = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      user = false;
    }
  }
  const loged = !!user;
  res.render("articlelist", { title: "Article", loged, user });
});

app.get("/blog/:id", (req, res) => {
  const token = req.cookies.loged;
  let user = false;
  if (token) {
    try {
      user = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      user = false;
    }
  }
  const loged = !!user;
  let blogid = "blog/article" + req.params.id;
  res.render(blogid, { title: "Article", loged, user });
});

app.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});
