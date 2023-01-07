const express = require("express");
const port = 3000;
const fs = require("fs");
const cors = require("cors");
const session = require("express-session");
const userService = require("./services/userServices");
const globalSongService = require("./services/globalSongServices");
const globalPlaylistsService = require("./services/globalPlaylistsServices");
const hashService = require("./services/hashCompare");
const mailing = require("./services/mailing");
const app = express();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "songPoster") {
      cb(null, './uploads/global/posters/landscape')
    }
    else if (file.fieldname === "songPosterPortrait") {
      cb(null, './uploads/global/posters/portrait')
    }
    else if (file.fieldname === "songFile") {
      cb(null, './uploads/global/songs');
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "songPoster") {
      let fileExtens = file.originalname.split('.')[file.originalname.split('.').length - 1];
      let currFilename = req.body.songName.replaceAll(' ', '_').toLowerCase() + "." + fileExtens;
      cb(null, currFilename);
    }
    else if (file.fieldname === "songPosterPortrait") {
      let fileExtens = file.originalname.split('.')[file.originalname.split('.').length - 1];
      let currFilename = req.body.songName.replaceAll(' ', '_').toLowerCase() + "_portrait." + fileExtens;
      cb(null, currFilename);
    }
    else if (file.fieldname === "songFile") {
      let fileExtens = file.originalname.split('.')[file.originalname.split('.').length - 1];
      let currFilename = req.body.songName.replaceAll(' ', '_').toLowerCase() + "." + fileExtens;
      cb(null, currFilename);
    }
  }
});

var upload = multer({ storage: storage });

const mongodb = require("./database/init");

var type = upload.fields([{ name: 'songPoster', maxCount: 1 }, { name: 'songPosterPortrait', maxCount: 1 }, { name: 'songFile', maxCount: 1 }]);

app.use(express.json());

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./uploads"));

app.set("view engine", "ejs");

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
}))

const getAuth = require("./middlewares/checkAuth");

app.get("/", function(req, res) {
  if (req.session.isAuthenticated === true) {
    res.render("index.ejs", { username: req.session.userName });
  }
  else {
    res.render("index.ejs", { username: null });
  }
})

app.get("/login-signup", function(req, res) {
  res.render("login-signup", { error: null })
})

app.get("/verify/:username", function(req, res) {
  var userid = req.params.username;
  try {
    var foundData = userService.findUser(userid);
    foundData = foundData[0];

    foundData.verificationStatus = true;
    userService.updateData(userid, foundData);
    res.redirect("/login-signup")
  }
  catch (err) {
    console.log(err);
    res.render("login-signup.ejs", { error: null });
  }
})

app.get("/uploadsong", getAuth, function(req, res) {
  if (req.session.isAuthenticated === true) {
    res.render("uploadForm.ejs", { username: req.session.userName });
  }
  else {
    res.render("uploadForm.ejs", { username: null });
  }
})

app.get("/explore", async (req, res) => {
  var getSongsData = await globalSongService.findAllSongs();
  let featuredList = await globalPlaylistsService.findPlaylist("featured");
  let mostPopular = await globalPlaylistsService.findPlaylist("most_popular");
  let recentlyPlayed = await globalPlaylistsService.findPlaylist("recently_played");
  let topPlaylists = await globalPlaylistsService.findAllPlaylists();

  featuredList = featuredList[0];
  mostPopular = mostPopular[0];
  recentlyPlayed = recentlyPlayed[0];


  if (req.session.isAuthenticated === true) {
    res.render("explore.ejs", { username: req.session.userName, songData: getSongsData, featured: featuredList, mostpopular: mostPopular, recentlyplayed: recentlyPlayed, topplaylists: topPlaylists });
  }
  else {
    res.render("explore.ejs", { username: null, songData: getSongsData, featured: featuredList, mostpopular: mostPopular, recentlyplayed: recentlyPlayed, topplaylists: topPlaylists });
  }
})

app.get("/settings", getAuth, function(req, res) {
  res.render("setting.ejs", { username: req.session.userName });
})

app.get("/mymusic", getAuth, async (req, res) => {
  if (req.session.role === "admin") {
    var getSongsData = await globalSongService.findAllSongs();
    var newplaylists = await globalPlaylistsService.findAllPlaylists();
  }
  else {
    let userData = await userService.findUserByName(req.session.userName);
    var getSongsData = userData[0].favourites;
    var newplaylists = userData[0].playlists;
    let getsongsData = [{
      playlistname: "favourites",
      playlistsongs: getSongsData
    }]
    newplaylists = newplaylists.concat(getsongsData)
    console.log(newplaylists)
  }

  let playlists = [];
  newplaylists.forEach((item) => {
    let newlist = {
      playlistname: item.playlistname.replaceAll("_", " "),
      playlistsongs: item.playlistsongs
    }
    playlists.push(newlist)
  })
  if (req.session.playingSongData) {
    let playSongData = req.session.playingSongData;
    console.log("Data: ", playSongData);
    res.render("mymusic.ejs", { username: req.session.userName, songData: getSongsData, playlist: playlists, playsongdata: playSongData });
  }
  else {
    res.render("mymusic.ejs", { username: req.session.userName, songData: getSongsData, playlist: playlists, playsongdata: null });
  }
})

app.get("/allPlaylists", async (req, res) => {
  let allPlaylist = await globalPlaylistsService.findAllPlaylists();
  let allPlaylists = {
    playlistname: "all_playlists",
    playlistsongs: allPlaylist
  }
  console.log(allPlaylists);
  res.render("allPlaylists.ejs", { username: null, playlistdata: allPlaylists });
})

app.post("/search", async (req, res) => {
  let findsong = req.body.songname;
  console.log(findsong);
  let foundSong = await globalSongService.findSong(findsong);
  console.log(foundSong[0])
  res.send(foundSong[0]);
})

app.get("/getAllSongs", cors(), async (req, res) => {
  var getSongsData = await globalSongService.findAllSongs();

  if (req.session.role === "user") {
    var userObj = await userService.findUserByName(req.session.userName);

    let userSongs = userObj[0].favourites;
    getSongsData = getSongsData.concat(userSongs);
    // console.log(getSongsData, userSongs);

    // console.log(userObj[0], "FAV: ", userObj[0].favourites)
  }

  res.send(getSongsData);
  // res.send({ abc: 'hg' });
})

app.get("/logout", function(req, res) {
  req.session.isAuthenticated = false;
  req.session.userName = null;
  req.session.role = null;
  res.redirect("/");
})

app.post("/login", async (req, res) => {
  var userid = req.body.userId;
  var password = req.body.passWord;

  try {
    var foundData = await userService.findUser(userid);
    foundData = foundData[0];
    if (!foundData) {
      throw new Error("No user found.Please proceed to Signup!")
    }
    else {
      var matchPassword = await hashService.comparePassword(password, foundData.password);
      // console.log(matchPassword);
      if (matchPassword !== true) {
        throw new Error("Incorrect Password");
      }
      req.session.isAuthenticated = true;
      req.session.userName = foundData.username;
      if (req.session.userName === "admin") {
        req.session.role = "admin";
      } else {
        req.session.role = "user";
      }
      // console.log(foundData)
      res.redirect("/");
    }
  }
  catch (err) {
    console.log(err);
    res.render("login-signup.ejs", { error: err })
  }
})

app.post("/signup", async (req, res) => {
  var uname = req.body.userName;
  var emailid = req.body.eMail;
  var password = req.body.passWord;
  try {

    let foundData = await userService.findUser(emailid);
    if (foundData.length !== 0) {
      throw new Error("Email Id Already in use!");
    }
    const hashedPassword = await hashService.hashPassword(password);

    var userData = {
      username: uname,
      Email: emailid,
      password: hashedPassword,
      profilePicture: null,
      verificationStatus: false
    }

    await userService.createNewUser(userData);
    // await mailing.verifyAccount(userData.Email, userData.Email, "Verify your Account");
    res.render("login-signup.ejs", { error: "Please Verify your Email" });
  }
  catch (err) {
    console.log(err);
    res.render("login-signup", { error: err });
  }
})

app.post("/allPlaylists/:playlistname", async (req, res) => {

  let findplaylist = req.params.playlistname;
  console.log(findplaylist)
  let foundPlaylist = await globalPlaylistsService.findPlaylist(findplaylist.replaceAll("-", "_").toLowerCase());
  foundPlaylist = foundPlaylist[0];
  console.log(foundPlaylist);
  res.render("viewPlaylist.ejs", { username: null, playlistdata: foundPlaylist });
})

app.post("/explore/:playlistname", async (req, res) => {
  let findplaylist = req.params.playlistname;
  let foundPlaylist = await globalPlaylistsService.findPlaylist(findplaylist.replaceAll("-", "_").toLowerCase());
  if (findplaylist === "Song-of-the-Day") {
    foundPlaylist = await globalPlaylistsService.findAllPlaylists();
    foundPlaylist = foundPlaylist[Math.floor(Math.random() * foundPlaylist.length)];
    let songlist = foundPlaylist.playlistsongs;
    songlist = songlist[Math.floor(Math.random() * songlist.length)]
    foundPlaylist.playlistsongs = [songlist];
    console.log(foundPlaylist);
  }
  else {
    foundPlaylist = foundPlaylist[0];
  }
  res.render("viewPlaylist.ejs", { username: null, playlistdata: foundPlaylist });
})

app.post("/upload", [getAuth, type], async (req, res) => {
  let data = JSON.parse(JSON.stringify(req.files));
  let bodyData = JSON.parse(JSON.stringify(req.body));

  let songObj = {
    songname: bodyData.songName,
    songartist: bodyData.songArtist,
    category: bodyData.category,
    songfilepath: data.songFile[0].path.replace("uploads/", ""),
    songposterpath: data.songPoster[0].path.replace("uploads/", ""),
    songportraitposterpath: data.songPosterPortrait[0].path.replace("uploads/", ""),
    likes: 0
  }
  console.log("SONGOBJ: ", songObj);
  if (req.session.role === "admin") {

    console.log("admin");
    await globalSongService.addNewSong(songObj);
  }
  else if (req.session.role === "user") {

    console.log("user");
    let userObj = await userService.findUserByName(req.session.userName);
    userObj[0].favourites.push(songObj);
    await userService.updateDataByName(req.session.userName, { favourites: userObj[0].favourites });
    userObj = await userService.findUserByName(req.session.userName);
    console.log("Song Upload: ", userObj, userObj[0].favourites);
  }
  res.redirect("/mymusic");
})

app.post("/addPlaylist", getAuth, async (req, res) => {
  let playlistData = req.body;
  let playlistSongs = playlistData.newPlaylistSongs;

  let allSongList = await globalSongService.findAllSongs();

  let playlist = [];
  playlistSongs.forEach((item) => {
    allSongList.forEach((mem) => {
      if (item.song === mem.songname) {
        let newObj = {
          songname: item.song,
          songartist: item.artist,
          songposterportraitpath: mem.songportraitposterpath,
          songposterpath: mem.songposterpath,
          songfilepath: mem.songfilepath
        }
        playlist.push(newObj);
      }
    })
  })
  let playlistObj = {
    playlistname: playlistData.newPlaylistName.replaceAll(" ", "_").toLowerCase(),
    playlistsongs: playlist
  }
  // console.log(playlistObj)
  if (req.session.role === "admin") {
    console.log("ADMIN")
    await globalPlaylistsService.addNewPlaylist(playlistObj);
  }
  else if (req.session.role === "user") {
    console.log("USER")

    let userObj = await userService.findUserByName(req.session.userName);
    let userSongsList = userObj[0].favourites;

    playlistSongs.forEach((item) => {
      userSongsList.forEach((mem) => {
        if (item.song === mem.songname) {
          let newObj = {
            songname: item.song,
            songartist: item.artist,
            songposterportraitpath: mem.songportraitposterpath,
            songposterpath: mem.songposterpath,
            songfilepath: mem.songfilepath
          }
          playlistObj.playlistsongs.push(newObj);
          console.log(newObj, playlistObj.playlistsongs)
        }
      })
    })

    userObj[0].playlists.push(playlistObj);
    // console.log("userplaylists: ", userObj[0].playlists);
    await userService.updateDataByName(req.session.userName, { playlists: userObj[0].playlists });
    userObj = await userService.findUserByName(req.session.userName);
    // console.log("userobj: ", userObj);
  }
  res.redirect("/mymusic")
})

app.post("/playSongs", getAuth, async (req, res) => {
  let songData = req.body;
  var songPlaylist = []
  console.log(req.headers['referer']);
  songPlaylist = await globalPlaylistsService.findPlaylist(songData.songPlaylist);
  // if (req.session.role === "admin") {
  //   songPlaylist = await globalPlaylistsService.findPlaylist(songData.songPlaylist);
  // }
  // else {
  //   songPlaylist = await userService.findUserByName(req.session.userName)
  //   console.log(songPlaylist)
  // }

  let songDetails = songPlaylist[0].playlistsongs.filter((i) => {
    // console.log(i.songname.replace(" ","_").toLowerCase()," : ",(songData.songToPlay).replace(" ","_").toLowerCase());
    return i.songname.replaceAll(" ", "_").toLowerCase() === (songData.songToPlay).replaceAll(" ", "_").toLowerCase();
  })

  songData = {
    songPlaylist: songPlaylist,
    songToPlay: songDetails[0]
  }
  console.log(songData);
  req.session.playingSongData = songData;
  res.redirect("/mymusic");
})

app.post("/resetPassword", getAuth, async (req, res) => {
  let newPswd = req.body.password;

  const newhashedPassword = await hashService.hashPassword(newPswd);

  await userService.updateDataByName(req.session.userName, { password: newhashedPassword });
  res.render("setting.ejs", { username: req.session.userName })
})

app.post("/removeSong", getAuth, async (req, res) => {
  let obj = req.body;
  console.log(obj);

  let playlist = await globalPlaylistsService.findPlaylist(obj.playlist.toLowerCase().replaceAll(" ", "_"));
  playlist = playlist[0];
  playlist.playlistsongs = playlist.playlistsongs.filter((song) => {
    return song.songname !== obj.songname;
  })
  console.log(playlist)

  await globalPlaylistsService.updateData(playlist.playlistname, playlist);
  res.send("Received!")
})

mongodb().then(function() {
  console.log("Connected to Database Successfully!")
  app.listen(port, function() {
    console.log("Server Online!");
  })
})
