
function sendData(obj) {

  let imgObject = [
    "global/posters/landscape/dandelions.jpg",
    "global/posters/landscape/in_my_head.jpg",
    "global/posters/landscape/star_walkin.jpg",
    "global/posters/landscape/too_good_at_goodbyes.jpg",
    "global/posters/landscape/wasted.jpg",
  ];

  let songList = [
    "Dandelions",
    "In My head",
    "StarWalkin",
    "Too Good At Goodbyes",
    "Wasted",
  ];
  imgObject = obj.playlistsongs.filter((item) => {
    return item.songposterpath;
  })
  songList = obj.playlistsongs.filter((item) => {
    return item.songname
  })


  let mainImg = 0;
  let prevImg = imgObject.length - 1;
  let nextImg = 1;

  function updateImageContainer(parentTag, imgNo, songTitle, songPath) {

    // console.log(imgObject[imgNo]);

    let imgDivContainer = parentTag.children[0];
    imgDivContainer.style['background'] = "url(" + imgObject[imgNo].songposterpath + ")";
    imgDivContainer.style['background-size'] = "contain";
    imgDivContainer.style['background-repeat'] = 'no-repeat';
    imgDivContainer.style['background-position'] = 'center';

    let btn = document.createElement("button");
    btn.type = "submit";
    btn.title = "Listen Now";
    btn.innerHTML = "Listen Now!";
    imgDivContainer.replaceChild(btn, imgDivContainer.childNodes[0]);

    let form = document.createElement("form");
    form.action = "/playSongs";
    form.method = "post";
    form.style.display = "none";

    let inputs = `<input type="hidden" value="${obj.playlistname}" name="songPlaylist">
                <input type="hidden" value="${imgObject[imgNo].songname}" name="songToPlay">`;


    form.insertAdjacentHTML("beforeend", inputs);
    btn.appendChild(form);

    let playBtnTag = imgDivContainer.children[0];
    playBtnTag.addEventListener("click", function() {
      form.submit();
    })
  }

  function loadGallery() {

    let mainView = document.getElementById("mainView");
    updateImageContainer(mainView, mainImg, songList[mainImg], undefined);

  };


  function scrollRight() {

    prevImg = mainImg;
    mainImg = nextImg;
    if (nextImg >= (imgObject.length - 1)) {
      nextImg = 0;
    } else {
      nextImg++;
    };
    loadGallery();
  };

  function scrollLeft() {

    nextImg = mainImg
    mainImg = prevImg;

    if (prevImg === 0) {
      prevImg = imgObject.length - 1;
    } else {
      prevImg--;
    };
    loadGallery();
  };

  document.getElementById("navRight").addEventListener("click", scrollRight);
  document.getElementById("navLeft").addEventListener("click", scrollLeft);


  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 37) {
      scrollLeft();
    } else if (e.keyCode === 39) {
      scrollRight();
    }
  });


  function autoSlides() {
    scrollLeft();
    setTimeout(autoSlides, 4500);
  }

  autoSlides();
  loadGallery();

}


const categories = document.querySelectorAll(".categoryCard");

categories.forEach((item) => {
  item.addEventListener("click", function() {
    let playlistname = item.childNodes[0];
    item.submit();
  })
});

const recentlyPlayedContainer = document.querySelector(".recently-played");

const recentlyPlayedSongs = recentlyPlayedContainer.querySelectorAll("div.card");

const mostPopularContainer = document.querySelector(".mostPopular");

const mostPopularSongs = mostPopularContainer.querySelectorAll("div.card");

const topPlaylists=document.querySelector(".topPlaylist");

const eachPlaylist=topPlaylists.querySelectorAll(".playlistCardMidParent")

recentlyPlayedSongs.forEach((item) => {
  item.addEventListener("click", function() {
    let form = item.querySelector("form");
    form.submit();
    // console.log(form);
  })
});

mostPopularSongs.forEach((item) => {
  item.addEventListener("click", function() {
    let form = item.querySelector("form");
    form.submit();
  })
})


eachPlaylist.forEach((item)=>{
  item.addEventListener("click", function() {
    let form = item.querySelector("form");
    form.submit();
  })
})

