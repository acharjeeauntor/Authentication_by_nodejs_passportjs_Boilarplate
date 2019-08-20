const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const configAuth = require("../config/keys");

//load User Model
const User = require("../models/Users");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Local Strategy

  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findOne({ "local.email": email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "This Email not registered!" });
          }
          //Match Password
          bcrypt.compare(password, user.local.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  //Facebook Strategy

  passport.use(
    new FacebookStrategy(
      {
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ["id", "displayName", "email"]
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log("profileinfo", profile);
        User.findOne({ "facebook.id": profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              const newUser = new User({
                "facebook.id": profile.id,
                "facebook.token": accessToken,
                "facebook.name": profile.displayName,
                "facebook.email": profile.emails[0].value
              });
              newUser
                .save()
                .then((newUser) => {
                  return done(null, newUser);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );

  //Google Strategy

  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log("accToken", accessToken);
        // console.log("refToken", refreshToken);
        // console.log("profile", profile);
        User.findOne({ "google.id": profile.id })
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              const newUser = new User({
                "google.id": profile.id,
                "google.token": accessToken,
                "google.name": profile.displayName,
                "google.email": profile.emails[0].value
              });
              newUser
                .save()
                .then((newUser) => {return done(null,newUser)})
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
};
