const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    index: true,
  },
  playlist: mongoose.Types.ObjectId,
  length: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  location: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: true,
  }
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
