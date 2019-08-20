const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all the fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation email
    User.findOne({ "local.email": email }).then((user) => {
      if (user) {
        //user exist
        errors.push({ msg: "Email Already Registered" });
        return res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          "local.name": name,
          "local.email": email,
          "local.password": password
        });
        bcrypt
          .hash(password, 12)
          .then((password) => {
            newUser.local.password = password;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                return res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

//login...

router.post("/login", (req, res, next) => {
  // console.log('posting...')
  passport.authenticate("local", {
    session: true,
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//logout...
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
