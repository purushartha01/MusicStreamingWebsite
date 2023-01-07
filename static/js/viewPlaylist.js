const playlistSection=document.querySelector(".playlistSection");

const cardEle=playlistSection.querySelectorAll("div.card");

cardEle.forEach((item)=>{
  item.addEventListener("click",function(){
    let form= item.querySelector("form");
    form.submit();
  });
})