const { Router } = require("express");
const router = Router();
const path = require("path");

const User = require("../models/userModel");

const checkAuthRequired = function (req, res, next) {
  //check if cookies are present
  if (req.signedCookies.session && req.signedCookies.username) {
    //cookies are present
    //query for user sessions
    User.findOne(
      { username: req.signedCookies.username },
      function (err, user) {
        //check if session is found for user
        if (!err && user && user.sessions.includes(req.signedCookies.session)) {
          //session is found
          //go to home
          res.redirect("/");
        } else {
          //session not found
          //clear cookies and go to auth
          res.clearCookie("session");
          res.clearCookie("username");
          next();
        }
      }
    );
  } else {
    //cookies not present
    //clear cookies and go to auth
    res.clearCookie("session");
    res.clearCookie("username");
    next();
  }
};

const validateSession = function (req, res, next) {
  //check if cookies are present
  if (req.signedCookies.session && req.signedCookies.username) {
    //cookies are present
    //query for user sessions
    User.findOne(
      { username: req.signedCookies.username },
      function (err, user) {
        //check if session is found for user
        if (!err && user && user.sessions.includes(req.signedCookies.session)) {
          //session is found
          //go to current route
          next();
        } else {
          //session not found
          //clear cookies and go to login
          res.clearCookie("session");
          res.clearCookie("username");
          res.redirect("/login");
        }
      }
    );
  } else {
    //cookies not present
    //clear cookies and go to login
    res.clearCookie("session");
    res.clearCookie("username");
    res.redirect("/login");
  }
};

router.get("/", validateSession, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

router.get("/login", checkAuthRequired, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

router.get("/signup", checkAuthRequired, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

router.get("/watch/:video", validateSession, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

module.exports = router;
