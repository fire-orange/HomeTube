const { Router } = require("express");
const router = Router();
const path = require("path");

const User = require("../models/userModel");

const checkIfAuthRequired = function (req, res, next) {
  const { username, session } = req.signedCookies;
  //check if cookies are not present
  if (!username || !session) {
    //cookies not present
    //clear cookies and go to auth
    res.clearCookie("session");
    res.clearCookie("username");
    return next();
  }

  //query for user sessions
  User.findOne({ username: username }, function (err, user) {
    //check if session is found for user
    if (!err && user && user.sessions.includes(session)) {
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
  });
};

const validateSession = function (req, res, next) {
  const { username, session } = req.signedCookies;

  //check if cookies are not present
  if (!username || !session) {
    //cookies not present
    //clear cookies and go to login
    res.clearCookie("session");
    res.clearCookie("username");
    res.redirect("/login");
    return;
  }

  //query for user sessions
  User.findOne({ username: username }, function (err, user) {
    //check if session is found for user
    if (!err && user && user.sessions.includes(session)) {
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
  });
};

router.get("/", validateSession, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

router.get("/login", checkIfAuthRequired, function (req, res) {
  res.sendFile(
    path.resolve(__dirname, "../../hometube-react-frontend/build", "index.html")
  );
});

router.get("/signup", checkIfAuthRequired, function (req, res) {
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
