const allPlaylistContainer = document.getElementById("myPlaylist");
const createPlaylist = document.getElementById("createPlaylist");
const addSong = document.getElementById("addSong");
const player = document.getElementById("player");
const allPlaylistChild = document.querySelector(".myPlaylistChild");
const createPlaylistChild = document.querySelector(".createPlaylistChild");
const addSongChild = document.querySelector(".addSongChild");
const playerChild = document.querySelector(".playerchild");

const titleParent = document.getElementById("titleList");
const titleChild = document.querySelector(".verticalDescSection");

const addPlaylistPage = document.getElementById("addPlaylistPage");
const bgBlur = document.getElementById("bgBlur");
const modalMesssage = document.getElementById("modalMessage");
const playlistName = document.getElementById("playlistName");
const closeBtn = document.getElementById("closeBtn");
const addPlaylistBtn = document.getElementById("addPlaylistBtn");

const createPlaylistSubmitBtn = document.querySelector(".createPlaylistSubmitBtn");
const newPlaylistHeading = document.querySelector(".playlistHeading");
const newPlaylistContent = document.getElementById("playlistContent");
const playlistData = document.querySelector(".playlistData");

allPlaylistContainer.addEventListener("click", function(e) {
  e.preventDefault();
  hideAll();
  allPlaylistContainer.classList.add("active");
  allPlaylistChild.classList.remove("hide");
});

createPlaylist.addEventListener("click", function(e) {
  e.preventDefault();
  hideAll();
  createPlaylist.classList.add("active");
  createPlaylistChild.classList.remove("hide");
});

addSong.addEventListener("click", function(e) {
  e.preventDefault();
  hideAll();
  addSong.classList.add("active");
  addSongChild.classList.remove("hide");
});

player.addEventListener("click", function(e) {
  e.preventDefault();
  hideAll();
  player.classList.add("active");
  playerChild.classList.remove("hide");
})

addPlaylistPage.addEventListener("click", function(e) {
  e.preventDefault();
  displayModal();
  bgBlur.addEventListener("click", function(e) {
    e.preventDefault();
    hideModal();
    playlistName.value = '';
  })
  closeBtn.addEventListener("click", function(e) {
    e.preventDefault();
    hideModal();
    playlistName.value = '';
  })
})

addPlaylistBtn.addEventListener("click", function(e) {
  e.preventDefault();
  let listName = playlistName.value;
  if (listName.length === 0) {
    return false;
  }
  console.log(listName);
  let newPlaylistObj = {
    newPlaylistName: listName,
    newPlaylistSongs: []
  }
  getDataFromServer("/getAllSongs").then((data) => {
    data.forEach((ele) => {
      let data = showPlaylistSongs(ele);
      playlistData.insertAdjacentHTML("beforeend", data);
    })
    const checkBoxes = document.querySelectorAll(".songChoice");
    checkBoxes.forEach((v) => {
      v.addEventListener("change", function() {
        let currSongName = v.parentElement.parentElement.children[1].children[0].innerHTML;
        let currSongArtist = v.parentElement.parentElement.children[1].children[1].innerHTML;
        let songData = {
          song: currSongName,
          artist: currSongArtist
        }
        if (v.checked === true) {
          newPlaylistObj.newPlaylistSongs.push(songData);
        }
        else if (v.checked === false) {
          let newPlaylistSongs = newPlaylistObj.newPlaylistSongs.filter((i) => {
            return i.song !== currSongName;
          })
          console.log("FILTERED: ", newPlaylistSongs)
          newPlaylistObj.newPlaylistSongs = newPlaylistSongs;
        }
      })
    })
  });
  createPlaylistSubmitBtn.addEventListener("click", function() {
    console.log(newPlaylistObj);
    sendDataToServer("/addPlaylist", newPlaylistObj);
    location.reload();
  })
  hideModal();
  addPlaylistPage.classList.add("hide");
  newPlaylistContent.classList.remove("hide");
  newPlaylistHeading.innerHTML = newPlaylistObj.newPlaylistName;
  playlistName.value = '';
})

function hideModal() {
  bgBlur.classList.add("hide");
  modalMesssage.classList.add("hide");
}

function displayModal() {
  bgBlur.classList.remove("hide");
  modalMesssage.classList.remove("hide");
}

function hideAll() {
  var arr = [].slice.call(titleParent.children);
  var childArr = [].slice.call(titleChild.children);
  arr.forEach(element => {
    element.classList.remove("active");
  })
  childArr.forEach(element => {
    element.classList.add("hide");
  })
}

async function getDataFromServer(url = '') {
  let res = fetch(url, {
    method: "get"
  });
  return (await res).json();
}

async function sendDataToServer(url, data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(data));
}

function showPlaylistSongs(data) {
  let structure = `<div class="playlistSongData">
                        <div class="songChoiceContainer">
                            <input type="checkbox" name="songChoice" class="songChoice">
                        </div>
                        <div class="listSongData">
                            <p class="songTitleData">${data.songname}</p>
                            <p class="songArtistData">${data.songartist}</p>
                        </div>
                    </div>`;
  return structure;
}

function showPlaylist(data) {
  hideAll();
  const myPlaylistChildContainer = document.querySelector(".myPlaylistChildContainer");
  const myPlaylistContent = document.querySelector(".myplaylistContent");
  const myPlaylistHeading = document.querySelector(".myplaylistHeading");
  const myPlaylistHeader = document.querySelector(".myplaylistHeader")
  const myPlaylistData = document.querySelector(".myplaylistData")

  allPlaylistContainer.classList.add("active");
  allPlaylistChild.classList.remove("hide");
  myPlaylistChildContainer.classList.add("hide");
  myPlaylistContent.classList.remove("hide");

  myPlaylistData.replaceChildren();

  myPlaylistHeader.children[0].addEventListener("click", function() {
    myPlaylistContent.classList.add("hide");
    myPlaylistChildContainer.classList.remove("hide");
  });

  myPlaylistHeading.innerHTML = data.playlistname;
  let songs = data.playlistsongs.forEach((item) => {
    console.log("DATA: ", data)
    let frag = showPlaylistSongsToPlay(item);
    myPlaylistData.insertAdjacentHTML("beforeend", frag);
  });

  let toPlaySongsList = myPlaylistData.querySelectorAll(".myplaylistSongData");
  // console.log("PLAYLIST: ",toPlaySongsList)
  toPlaySongsList.forEach((song) => {
    song=song.children[1];
    song.addEventListener("click", function() {
      let currSongname = song.querySelector(".mysongTitleData").innerHTML;

      // console.log(currSongname)
      let getCurrSongList = []


      data.playlistsongs.forEach((e) => {
        let songname = e.songname
        getCurrSongList.push(songname);
      })

      let getCurrSong = getCurrSongList.indexOf(currSongname);
      // console.log("CURR SONG: ",data.playlistsongs[getCurrSong],"DATA: ",data," index: ",getCurrSong)

      sendPlaylist({ songPlaylist: [data], songToPlay: data.playlistsongs[getCurrSong] });
    })
  });

  const submenuArr = document.querySelectorAll(".submenu");
  submenuArr.forEach((sm) => {
    sm.addEventListener("click", function() {
      let nodeObjSongName=sm.parentElement.parentElement.children[1].children[0].innerHTML;
      // console.log(nodeObjSongName,data.playlistname);
      let newNodeObj={
        playlist: data.playlistname,
        songname: nodeObjSongName
      }
      sendDataToServer("/removeSong",newNodeObj);
      
    })
  })
}

function showPlaylistSongsToPlay(data) {
  let structure = `<div class="myplaylistSongData">
                        <div class="songLikeContainer">
                        </div>
                        <div class="mylistSongData">
                            <p class="mysongTitleData">${data.songname}</p>
                            <p class="mysongArtistData">${data.songartist}</p>
                        </div>
                        <div class="mymenu">
                          <img src="images/remove.svg" alt="Submenu" class="submenu">
                        </div>
                    </div>`;
  return structure;
}


let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

var track_index = 0;
var isPlaying = false;
var updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
var track_list = [
  {
    name: "Night Owl",
    artist: "Broke For Free",
    image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
    path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
  },
];

let globalMainplaylistObj = {};

function sendPlaylist(obj) {
  console.log(obj)
  let songList = obj.songPlaylist[0].playlistsongs;
  globalMainplaylistObj = obj;
  // console.log(songList);
  track_list = []

  songList.forEach((song) => {
    var songObj={}
    if (song.songposterportraitpath) {
      songObj = {
        name: song.songname,
        artist: song.songartist,
        image: song.songposterportraitpath,
        path: song.songfilepath
      }
    }
    else {
      songObj = {
        name: song.songname,
        artist: song.songartist,
        image: song.songportraitposterpath,
        path: song.songfilepath
      }
    }
    track_list.push(songObj);
  });

  // console.log(track_list)
  let thisList = []
  songList.forEach((e) => {
    let songname = e.songname
    thisList.push(songname);
  })
  // console.log(obj.songToPlay)
  // console.log(obj.songToPlay.songname);


  track_index = thisList.indexOf(obj.songToPlay.songname)
  // console.log("this: ",thisList)
  // console.log(track_index)
  // console.log("LIST: ", track_list);
  loadTrack(track_index);
  playTrack();
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();

  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  // Update details of the track
  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;

  // Set an interval of 1000 milliseconds for updating the seek slider
  updateTimer = setInterval(seekUpdate, 1000);

  // Move to the next track if the current one finishes playing
  curr_track.addEventListener("ended", nextTrack);
  console.log(globalMainplaylistObj)

  if (globalMainplaylistObj) {

    sendDataToServer("/playSongs", { songPlaylist: globalMainplaylistObj.songPlaylist[0].playlistname, songToPlay: track_list[track_index].name })
  }
}

// Reset Values
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();



}

function playTrack() {
  console.log("NOW PLAYING/PAUSING")

  curr_track.play();
  isPlaying = true;

  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;

  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    // Adding a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// Load the first track in the tracklist
// loadTrack(track_index);