const modal = document.getElementById("js-popup");
const btn = document.getElementById("js-popup-btn");
const span = document.getElementById("js-pop-up-close");

btn.onclick = function () {
    modal.classList.toggle('show');
}

span.onclick = function () {
    modal.classList.toggle('show');
}

window.onclick = function (e) {
    if (e.target == modal) {
        modal.classList.remove('show');
    }
}
