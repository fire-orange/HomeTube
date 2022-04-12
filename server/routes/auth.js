const { Router } = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const router = Router();

const User = require("../models/userModel");

function checkIfCookiesPresent(req, res, next) {
  const { username, session } = req.signedCookies;
  if (username && session) {
    res.status(400);
    res.json({ message: "Already logged in." });
  } else {
    next();
  }
}

//validate login credentials
router.post("/login", checkIfCookiesPresent, function (req, res) {
  let { username, password } = req.body;
  //check if username and password are present
  if (!username || !password) {
    res.status(400);
    res.json({
      message: "Username and/or Password is not present.",
    });
    return;
  }

  //query user based on username
  User.findOne({ username: username }, function (err, user) {
    //check if error in user query
    if (err || !user) {
      console.log(err);
      res.status(401);
      res.json({
        message: "Username and/or Password is incorrect.",
      });
      return;
    }

    //compare password
    bcrypt.compare(password, user.password, function (err, result) {
      //check if password is incorrect
      if (!result) {
        res.status(401);
        res.json({
          message: "Username and/or Password is incorrect.",
        });
        return;
      }

      const sessionId = uuidv4();
      //push session ID to database
      User.updateOne(
        { username: username },
        { $push: { sessions: sessionId } },
        function (err, result) {
          //check if error in pushing session ID
          if (!err) {
            //push successful send cookies and response
            res.status(200);
            res.cookie("session", sessionId, {
              signed: true,
              httpOnly: true,
            });
            res.cookie("username", username, {
              signed: true,
              httpOnly: true,
            });
            res.json({
              message: "Successfully logged in.",
              redirectUrl: "/",
              username: user.username,
              name: user.firstName + " " + user.lastName,
              avatar: user.avatar,
            });
          } else {
            //push failed send response
            res.status(500);
            res.json({
              message: "Error creating session.",
            });
          }
        }
      );
    });
  }).lean();
});

//register user
router.post("/signup", checkIfCookiesPresent, function (req, res) {
  let { avatar, firstName, lastName, username, password } = req.body;

  //check if data is not present
  if (!firstName || !lastName || !username || !password) {
    res.status(400);
    res.json({
      message: "Please fill all the fields.",
      redirectUrl: "/signup",
    });
    return;
  }

  [firstName, lastName] = [
    _.capitalize(firstName).trim(),
    _.capitalize(lastName).trim(),
  ];
  const sessionId = uuidv4();

  //hash password
  bcrypt.hash(password, parseInt(process.env.SALTROUNDS), function (err, hash) {
    //check if hash failed
    if (err || !hash) {
      console.log(err);
      res.status(500);
      res.json({
        message: "Error occurred.",
        redirectUrl: "/signup",
      });
      return;
    }

    //create user object
    const user = new User({
      avatar: JSON.stringify(avatar),
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hash,
      admin: false,
    });
    user.sessions.push(sessionId);

    //save user to database
    user.save(function (err) {
      //check if save is successful
      if (!err) {
        //save successful send cookies and response
        res.status(201);
        res.cookie("session", sessionId, {
          signed: true,
          httpOnly: true,
        });
        res.cookie("username", username, {
          signed: true,
          httpOnly: true,
        });
        res.json({
          message: "User saved successfully.",
          redirectUrl: "/",
          username: user.username,
          name: user.firstName + " " + user.lastName,
          avatar: user.avatar,
        });
      } else {
        //save unsuccessful
        res.status(400);
        console.log(err);
        res.json({
          message: "Username taken.",
          redirectUrl: "/signup",
        });
      }
    });
  });
});

router.post("/logout", function (req, res) {
  const { username, session } = req.signedCookies;
  //check if cookie is not present
  if (!username || !session) {
    res.status(400);
    res.clearCookie("session");
    res.clearCookie("username");
    res.json({ redirectUrl: "/login" });
    return;
  }

  //query user based on username
  User.updateOne(
    { username: username },
    { $pullAll: { sessions: [session] } },
    function (err, result) {
      //check if error occurred during query
      if (err) {
        console.log(err);
        res.status(500);
        res.json({ message: "An error occurred." });
        return;
      }

      //logout successful
      res.status(200);
      res.clearCookie("session");
      res.clearCookie("username");
      res.json({ message: "User logged out.", redirectUrl: "/login" });
    }
  );
});

module.exports = router;
