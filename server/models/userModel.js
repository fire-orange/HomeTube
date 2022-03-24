const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessions: {
    type: [String],
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
