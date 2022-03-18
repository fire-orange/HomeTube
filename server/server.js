require("dotenv").config();
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));

mongoose.connect("mongodb://localhost:27017/hometubeDB");

const userSchema = new mongoose.Schema({
  avatar: String,
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  sessions: [String],
  admin: {
    type: Boolean,
    required: [true, "Account type is required"],
  },
});

const User = mongoose.model("User", userSchema);

app.use("/api/v1", apiRoutes);

//validate login credentials
app.post("/login", function (req, res) {
  let { username, password } = req.body;

  //find user based on username
  User.findOne({ username: username }, function (err, user) {
    //user is found
    if (!err) {
      //compare password
      bcrypt.compare(password, user.password, function (err, result) {
        //password match create session ID, push session ID to database and send cookie
        if (result) {
          const sessionId = uuidv4();
          //push session ID to database
          User.updateOne(
            { username: username },
            { $push: { sessions: sessionId } },
            function (err, result) {
              //push successful send cookie and response
              if (!err) {
                res.cookie("session", sessionId, { signed: true });
                res.json({
                  success: true,
                  msg: "Successfully logged in",
                  redirect: true,
                  redirectUrl: "/",
                });
              } else {
                //push failed send response
                res.json({
                  success: false,
                  msg: "Error creating session",
                  redirect: false,
                });
              }
            }
          );
        } else {
          //password not match
          res.json({
            success: false,
            msg: "Username and/or Password is incorrect",
            redirect: false,
          });
        }
      });
    } else {
      //user not found
      console.log(err);
      res.json({
        success: false,
        msg: "Username and/or Password is incorrect",
        redirect: false,
      });
    }
  });
});

//register user
app.post("/signup", function (req, res) {
  let { avatar, firstName, lastName, username, password } = req.body;
  [firstName, lastName, username] = [
    _.capitalize(firstName).trim(),
    _.capitalize(lastName).trim(),
    username.trim(),
  ];
  const sessionId = uuidv4();

  //hash password
  bcrypt.hash(password, parseInt(process.env.SALTROUNDS), function (err, hash) {
    //hash successful
    if (!err) {
      //create user object
      const user = new User({
        avatar: avatar,
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hash,
        admin: false,
      });
      user.sessions.push(sessionId);

      //save user credential to database
      user.save(function (err, user) {
        //save successful send cookie and response
        if (!err) {
          res.cookie("session", sessionId, { signed: true });
          res.json({
            success: true,
            msg: "User saved successfully",
            redirect: true,
            redirectUrl: "/",
          });
        } else {
          //save unsuccessful
          console.log(err);
          res.json({
            success: false,
            msg: "Error occurred",
            redirect: true,
            redirectUrl: "/signup",
          });
        }
      });
    } else {
      //hash fail
      console.log(err);
      res.json({
        success: false,
        msg: "Error occurred",
        redirect: true,
        redirectUrl: "/signup",
      });
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log("Listening on port " + process.env.PORT);
});
