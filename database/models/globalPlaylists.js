const mongoose = require("mongoose");

const globalPlaylistsSchema = new mongoose.Schema({
  playlistname: { type: String, required: true, unique: true },
  playlistsongs: [{
    songname: String,
    songartist: String,
    songposterportraitpath: String,
    songposterpath: String,
    songfilepath: String
  }]
})

const globalPlaylistsModel = mongoose.model('GlobalPlayList', globalPlaylistsSchema);

module.exports = globalPlaylistsModel;