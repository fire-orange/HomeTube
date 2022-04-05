require("dotenv").config();
const express = require("express");
const path = require("path");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/api");
const appRoutes = require("./routes/app");
const IPv4 = require("./network-ip");

const app = express();

app.use(
  express.static(path.resolve(__dirname, "../hometube-react-frontend/build"), {
    index: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));

mongoose.connect("mongodb://localhost:27017/hometubeDB");

const User = require("./models/userModel");

app.use("/api/v1", apiRoutes);
app.use("/", appRoutes);

//validate login credentials
app.post("/login", function (req, res) {
  let { username, password } = req.body;
  //check if username and password are present
  if (username && password) {
    //username and password are present
    //query user based on username
    User.findOne({ username: username }, function (err, user) {
      //check if error in user query
      if (!err && user) {
        //no error
        //compare password
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            //password match
            const sessionId = uuidv4();
            //push session ID to database
            User.updateOne(
              { username: username },
              { $push: { sessions: sessionId } },
              function (err, result) {
                //check if error in pushing session ID
                if (!err) {
                  //push successful send cookies and response
                  res.cookie("session", sessionId, {
                    signed: true,
                    httpOnly: true,
                  });
                  res.cookie("username", username, {
                    signed: true,
                    httpOnly: true,
                  });
                  res.json({
                    success: true,
                    msg: "Successfully logged in.",
                    redirectUrl: "/",
                    username: user.username,
                    name: user.firstName + " " + user.lastName,
                    avatar: user.avatar,
                  });
                } else {
                  //push failed send response
                  res.json({
                    success: false,
                    msg: "Error creating session.",
                  });
                }
              }
            );
          } else {
            //password not match
            res.json({
              success: false,
              msg: "Username and/or Password is incorrect.",
            });
          }
        });
      } else {
        //user not found
        console.log(err);
        res.json({
          success: false,
          msg: "Username and/or Password is incorrect.",
        });
      }
    }).lean();
  } else {
    //username and password not present
    res.json({
      success: false,
      msg: "Username and/or Password is incorrect.",
    });
  }
});

//register user
app.post("/signup", function (req, res) {
  let { avatar, firstName, lastName, username, password } = req.body;
  //check if data is present
  if (firstName && lastName && username && password) {
    //data is present
    [firstName, lastName] = [
      _.capitalize(firstName).trim(),
      _.capitalize(lastName).trim(),
    ];
    const sessionId = uuidv4();

    //hash password
    bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS),
      function (err, hash) {
        //check if hash is successful
        if (!err && hash) {
          //hash successful
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
              res.cookie("session", sessionId, {
                signed: true,
                httpOnly: true,
              });
              res.cookie("username", username, {
                signed: true,
                httpOnly: true,
              });
              res.json({
                success: true,
                msg: "User saved successfully.",
                redirectUrl: "/",
                username: user.username,
                name: user.firstName + " " + user.lastName,
                avatar: user.avatar,
              });
            } else {
              //save unsuccessful
              console.log(err);
              res.json({
                success: false,
                msg: "Username taken.",
                redirectUrl: "/signup",
              });
            }
          });
        } else {
          //hash fail
          console.log(err);
          res.json({
            success: false,
            msg: "Error occurred.",
            redirectUrl: "/signup",
          });
        }
      }
    );
  } else {
    //data not present
    res.json({
      success: false,
      msg: "Error occurred.",
      redirectUrl: "/signup",
    });
  }
});

app.listen(process.env.PORT, IPv4, function () {
  console.log("Listening on " + IPv4 + " port " + process.env.PORT);
});
