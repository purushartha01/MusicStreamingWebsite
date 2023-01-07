const body=document.getElementById("body");
const navbar=document.getElementById("navbar");
const mainbody=document.getElementById("main-body");

navbar.addEventListener("mouseover",increaseNavDimensions);
navbar.addEventListener("mouseleave",decreaseNavDimensions);



function increaseNavDimensions(){
    navbar.classList.remove("navbar-v");
    navbar.classList.add("navbar-v-hover");
    mainbody.classList.add("container-body-hover","container-body-2")
}


function decreaseNavDimensions(){
    navbar.classList.remove("navbar-v-hover");
    navbar.classList.add("navbar-v");
    mainbody.classList.remove("container-body-hover","container-body-2")
}