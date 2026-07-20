const musicmodel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const albummodel = require("../models/album.model");
const { upload } = require("../services/storage.service");

function createAccentColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 72 + Math.floor(Math.random() * 10);
  const lightness = 48 + Math.floor(Math.random() * 8);

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  const result = await upload(file.buffer.toString("base64"));
  console.log(result);
  const music = await musicmodel.create({
    uri: result.url,
    title: title,
    artist: req.user.id,
    accentColor: createAccentColor(),
  });

  res.status(201).json({
    message: "Your Music has been uploaded successfully",
    music: {
      id: music.id,
      artist: music.artist,
      uri: music.uri,
      title: music.title,
      accentColor: music.accentColor,
    },
  });
}

async function createalbum(req, res) {
  const { title, musics } = req.body;
  const album = await albummodel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}

async function getallmusic(req, res) {
  const musics = await musicmodel.find().populate("artist", "username email");
  res.status(200).json({
    musics,
  });
}
async function getalbums(req,res){
  const albums = await albummodel.find().populate("artist", "username email");
  res.status(200).json({
    albums,
  });
}

async function getArtistMusic(req, res) {
  const musics = await musicmodel
    .find({ artist: req.user.id })
    .populate("artist", "username email role");

  res.status(200).json({
    musics,
  });
}

async function updateMusic(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const file = req.file;

  const music = await musicmodel.findById(id);

  if (!music) {
    return res.status(404).json({
      message: "Music not found",
    });
  }

  if (String(music.artist) !== String(req.user.id)) {
    return res.status(403).json({
      message: "You can only edit your own music",
    });
  }

  if (typeof title === "string" && title.trim()) {
    music.title = title.trim();
  }

  if (file) {
    const result = await upload(file.buffer.toString("base64"));
    music.uri = result.url;
  }

  await music.save();

  const populatedMusic = await musicmodel
    .findById(music._id)
    .populate("artist", "username email role");

  res.status(200).json({
    message: "Music updated successfully",
    music: populatedMusic,
  });
}

async function deleteMusic(req, res) {
  const { id } = req.params;
  const music = await musicmodel.findById(id);

  if (!music) {
    return res.status(404).json({
      message: "Music not found",
    });
  }

  if (String(music.artist) !== String(req.user.id)) {
    return res.status(403).json({
      message: "You can only delete your own music",
    });
  }

  await music.deleteOne();

  res.status(200).json({
    message: "Music deleted successfully",
  });
}

module.exports = {
  createMusic,
  createalbum,
  getallmusic,
  getArtistMusic,
  updateMusic,
  deleteMusic,
  getalbums
};
