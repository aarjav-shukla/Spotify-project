const express = require("express");
const musiccontroller = require("../controller/music.controller");
const authmiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authmiddleware.authArtist,
  upload.single("music"),
  musiccontroller.createMusic,
);

router.post("/album", authmiddleware.authArtist, musiccontroller.createalbum);

router.get("/getmusic", musiccontroller.getallmusic);

router.get("/mine", authmiddleware.authArtist, musiccontroller.getArtistMusic);

router.put(
  "/:id",
  authmiddleware.authArtist,
  upload.single("music"),
  musiccontroller.updateMusic,
);

router.delete("/:id", authmiddleware.authArtist, musiccontroller.deleteMusic);

router.get("/getalbums",musiccontroller.getalbums)

module.exports = router;
