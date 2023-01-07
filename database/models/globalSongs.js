const mongoose = require("mongoose");

const globalSongsSchema = new mongoose.Schema({
  songname: { type: String, required: true, unique: true },
  songartist: { type: String, required: true },
  category: { type: String },
  songfilepath: { type: String, required: true, unique: true },
  songposterpath: { type: String, required: true, unique: true },
  songportraitposterpath: { type: String, required: true, unique: true },
  likes: {type: Number}
})

const globalSongsModel = mongoose.model('GlobalSongList', globalSongsSchema);

module.exports = globalSongsModel;