require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/api/api");
const appRoutes = require("./routes/app");
const authRoutes = require("./routes/auth");
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
app.use("/", authRoutes);

app.listen(process.env.PORT, IPv4, function () {
  console.log("Listening on " + IPv4 + " port " + process.env.PORT);
});
