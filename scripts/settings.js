function openSettings() {
    document.querySelector(".settings").classList.add("modal--active");
    showOverlay();
}

function closeSettings() {
    document.querySelector(".settings").classList.remove("modal--active");
    hideOverlay();
}