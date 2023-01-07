const allPlaylistContainer = document.getElementById("resetPassword");
const allPlaylistChild = document.querySelector(".resetPasswordChild");
const titleParent = document.getElementById("titleList");
const titleChild = document.querySelector(".verticalDescSection");

allPlaylistContainer.addEventListener("click", function (e) {
    e.preventDefault();
    hideAll();
    allPlaylistContainer.classList.add("active");
    allPlaylistChild.classList.remove("hide");
});

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