window.addEventListener("resize", resizeListener);
window.addEventListener("load", resizeListener);



function resizeListener() {
  if (window.innerWidth <= 850) {
    document.getElementById("h-nav").classList.add("hide");
    document.getElementById("v-nav").classList.remove("hide");
    console.log("MOBILE DEVICE")
  }
  else if (window.innerWidth > 850) {
    document.getElementById("h-nav").classList.remove("hide");
    document.getElementById("v-nav").classList.add("hide");
    console.log("LAPTOP")
  }
}



var verNav = document.getElementById("v-nav");
verNav.addEventListener("mouseup", hideMenuBtn);

function hideMenuBtn() {
  console.log("click")
  // verNav.classList.remove("container")
  verNav.classList.add("animate")
}

var bookmark = document.getElementById("event-container");
var menuList = document.getElementById("menu-list");
var eventInitiate = document.getElementById("event-opener");
var eventTerminate = document.getElementById("event-closer");

bookmark.addEventListener("click", showFullBookmark);


function showFullBookmark() {
  if (menuList.classList.contains("out-long")) {
    menuList.classList.remove("hide-bookmark-long");
    menuList.classList.add("show-bookmark-long");
    menuList.classList.remove("out-long");
    eventInitiate.classList.add("hide");
    eventTerminate.classList.remove("hide");
  }
  else {
    menuList.classList.remove("show-bookmark-long");
    menuList.classList.add("hide-bookmark-long");
    menuList.classList.add("out-long");
    eventInitiate.classList.remove("hide");
    eventTerminate.classList.add("hide");
  }
}

const searchinputbox = document.getElementById("search-input");
const searchicon = document.getElementById("imgSearch");
const searchdiv = document.querySelector(".mainsearch-box");


searchinputbox.addEventListener("keyup", function(e) {
  let songName = e.target.value;
  console.log();
  let form = document.createElement("form");
  form.method = "post";
  form.action = "/playSongs";
  form.style.display = "none";

  let inputs = `<input type="hidden" value="global" name="songPlaylist">
                <input type="hidden" value="${songName}" name="songToPlay">`;


  form.insertAdjacentHTML("beforeend", inputs);

  searchdiv.appendChild(form);
  if (e.key === "Enter") {
    // console.log("ENTER");
    console.log(songName.toLowerCase().replaceAll(" ", "_"));
    let res = getDataFromS("/search", { songname: songName }, function(data) {
      console.log(data);
      console.log(searchdiv)
      form.submit();

      searchicon.addEventListener("click", function() {
        form.submit();
      })
    });
    console.log(res);
  }
});

async function getDataFromS(url = '', data, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(this.responseText);
    }
  };
  xhr.send(JSON.stringify(data));
}