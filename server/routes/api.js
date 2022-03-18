const { Router } = require("express");
const router = Router();

router.get("/", function (req, res) {
  res.send("API");
});

router.get("/video", function (req, res) {
  //get all videos detail
});

router.get("/video/:videoId", function (req, res) {
  //get video from req.params.videoId
  res.send(req.params.videoId);
});

router.get("/video/watch/:videoId", function (req, res) {
  res.send("watch " + req.params.videoId);
});

module.exports = router;
