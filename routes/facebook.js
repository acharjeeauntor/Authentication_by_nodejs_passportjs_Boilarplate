const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
  })
);
module.exports = router;
