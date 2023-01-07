const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: [{
    playlistname: { type: String, required: true },
    playlistsongs: [{
      songname: String,
      songartist: String,
      songposterportraitpath: String,
      songposterpath: String,
      songfilepath: String
    }]
  }],
  profilePicture: {
    data: Buffer,
    contentType: String
  },
  verificationStatus: Boolean,
  favourites: [{
    songname: String,
    songartist: String,
    category: String,
    songfilepath: String,
    songposterpath: String,
    songportraitposterpath: String,
    likes: Number
  }]
})

const userModel = mongoose.model('Userlists', userSchema);

module.exports = userModel;