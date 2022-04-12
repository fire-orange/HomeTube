const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getVideoDurationInSeconds } = require("get-video-duration");
const upload = require("./MulterSetup");
const { exec } = require("child_process");
const router = Router();

let User = require("../../models/userModel");
let Video = require("../../models/videoModel");

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      } else if (stdout) {
        console.log(stdout);
      } else {
        console.log(stderr);
      }
      resolve(stdout ? true : false);
    });
  });
}

const validateSession = function (req, res, next) {
  const { username, session } = req.signedCookies;

  //check if cookies are not present
  if (!username || !session) {
    //cookies not present
    //clear cookies and go to login
    res.clearCookie("session");
    res.clearCookie("username");
    res.status(401);
    res.json({ redirectUrl: "/login" });
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
      res.status(401);
      res.json({ redirectUrl: "/login" });
    }
  });
};

router.get("/videos", validateSession, function (req, res) {
  //get all videos detail
  Video.find(null, null, null, function (err, videos) {
    if (videos && !err) {
      res.status(200);
      res.json({ videos: videos });
    } else {
      console.log(err);
      res.status(500).end();
    }
  })
    .select({
      _id: 1,
      title: 1,
      author: 1,
      fileName: 1,
      length: 1,
      date: 1,
      thumbnail: 1,
    })
    .lean();
});

router.get("/videos/:video", validateSession, function (req, res) {
  const { video } = req.params;
  Video.findOne({ fileName: video }, function (err, video) {
    if (video && !err) {
      res.status(200);
      res.json({ video: video });
    } else {
      console.log(err);
      res.status(500).end();
    }
  })
    .select({
      _id: 1,
      title: 1,
      author: 1,
      fileName: 1,
      length: 1,
      date: 1,
      thumbnail: 1,
    })
    .lean();
});

router.get("/thumbnails/:thumbnail", function (req, res) {
  const thumbnailPath = path.resolve(
    __dirname,
    "../../uploads/thumbnails/" + req.params.thumbnail
  );

  fs.access(thumbnailPath, function (err) {
    if (!err) {
      res.status(200);
      res.sendFile(thumbnailPath);
    } else {
      console.log(err);
      res.status(404).end();
    }
  });
});

router.get("/watch/:video", validateSession, function (req, res, next) {
  const { video } = req.params;
  const range = req.headers.range;

  if (!range) {
    res.status(400).end();
    return;
  }

  const videoLocation = path.resolve(__dirname, "../../uploads/videos/", video);

  fs.access(videoLocation, function (err) {
    //check if error occured
    if (err) {
      console.log(err);
      res.status(404).end();
      return;
    }

    let start;
    let end;
    const CHUNK_SIZE = 10 ** 6;
    const videoSize = fs.statSync(videoLocation).size;

    if (req.range() != -1) {
      start = req.range()[0].start;
      end = req.range()[0].end;
    } else {
      //-1 range
      start = Number(range.replace(/\D/g, ""));
      end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    }

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoLocation, { start, end });
    videoStream.pipe(res);
  });
});

router.post(
  "/upload",
  validateSession,
  upload.single("video"),
  async function (req, res) {
    let { title, author } = req.body;
    title = title.trim();
    let { file } = req;

    if (!title || !file || !author) {
      res.status(400);
      res.json({ message: "Error Occurred." });
      return;
    }

    getVideoDurationInSeconds(file.path).then((duration) => {
      const thumbnailName = uuidv4() + ".png";
      const thumbnailPath = path.resolve(
        path.join(__dirname, "../../uploads/thumbnails", thumbnailName)
      );

      execShellCommand(
        "ffmpeg -i " +
          req.file.path +
          " -s 640x360 -ss " +
          Math.floor(duration / 4) +
          " -vframes 1 " +
          thumbnailPath
      );

      let video = new Video({
        title: title,
        author: author,
        length: duration,
        date: new Date(),
        fileName: file.filename,
        location: file.path,
        thumbnail: thumbnailName,
        thumbnailPath: thumbnailPath,
      });

      video.save(function (err) {
        //check if save is successful
        if (!err) {
          //save successful send response
          res.status(201);
          res.json({
            message: "Video saved successfully.",
          });
        } else {
          //save unsuccessful
          console.log(err);
          res.status(500);
          res.json({
            message: "Error Occurred.",
          });
        }
      });
    });
  }
);

module.exports = router;
