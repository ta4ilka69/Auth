const express = require("express");
const hbs = require("express-handlebars");
const app = express();
const session = require("express-session");

app.set("view engine", "hbs");

app.use(
  session({
    secret: "AWvjaimawdWFvfjapwoVAv392JFWesafWJPQGF",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  }),
);

app.use("/static", express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  if (!req.session.authorized) {
    res.render("mainpage_login", { page: "Главная" });
  } else {
    res.render("mainpage_user", { page: "Главная", login: req.session.login });
  }
});

app.get("/login", (req, res) => {
  err = "";
  if (req.query.err) {
    err = req.query.err;
  }
  res.render("auth", { page: "Авторизация", err: err });
});

app.post("/auth", (req, res) => {
  login = req.body.login;
  password = req.body.password;
  if (
    (login === "admin" && password === "1") ||
    (login === "android" && password === "0")
  ) {
    req.session.authorized = true;
    req.session.login = login;
    res.redirect("/");
  } else {
    res.redirect("/login?err=err");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000);
