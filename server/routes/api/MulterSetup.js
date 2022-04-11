const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "../../uploads/videos/"));
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${uuidv4()}.${ext}`);
    },
  });

  const upload = multer({ storage: multerStorage });

  module.exports = upload;