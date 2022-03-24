const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { getVideoDurationInSeconds } = require("get-video-duration");
const router = Router();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads/videos/"));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });

let User = require("../models/userModel");
let Video = require("../models/videoModel");
const { exec } = require("child_process");


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

router.get("/videos", validateSession, function (req, res) {
  //get all videos detail
  Video.find(null, null, null, function (err, videos) {
    if (videos && !err) {
      res.json({ success: true, videos: videos });
    } else {
      console.log(err);
      res.json({ success: false });
    }
  })
    .select({ _id: 1, title: 1, author: 1, length: 1, date: 1, thumbnail: 1 })
    .lean();
});

router.get("/thumbnails/:thumbnail", function (req, res) {
  const thumbnailPath = path.resolve(__dirname, "../uploads/thumbnails/" + req.params.thumbnail);
  fs.access(thumbnailPath, function (err) {
    if (!err) {
      res.sendFile(thumbnailPath);
    } else {
      console.log(err);
      res.status(404).end();
    }
  });
});

router.post("/upload", validateSession, upload.single("video"), async function (req, res) {
  if (!req.body.title && !req.file && !req.body.author) {
    res.json({ success: false, msg: "Error Occurred." });
    return;
  }
  let { title, author } = req.body;
  title = title.trim();

  getVideoDurationInSeconds(req.file.path).then((duration) => {
    const thumbnailName = uuidv4() + ".png";
    const thumbnailPath =
      "C:\\dev\\HomeTube\\server\\uploads\\thumbnails\\" + thumbnailName;
    exec(
      "ffmpeg -i " +
        req.file.path +
        " -s 640x360 -ss " +
        duration / 4 +
        " -vframes 1 " +
        thumbnailPath
    );
    let video = new Video({
      title: title,
      author: author,
      length: duration,
      date: new Date(),
      location: req.file.path,
      thumbnail: thumbnailName,
      thumbnailPath: thumbnailPath,
    });

    video.save(function (err) {
      //check if save is successful
      if (!err) {
        //save successful send response
        res.json({
          success: true,
          msg: "Video saved successfully.",
        });
      } else {
        //save unsuccessful
        console.log(err);
        res.json({
          success: false,
          msg: "Error Occurred.",
        });
      }
    });
  });
});

module.exports = router;
