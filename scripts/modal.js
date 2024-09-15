function openModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.classList.add("modal--active");

    showOverlay();

    document.querySelector(".overlay").addEventListener("click", () => {
        closeModal(modalId);
    });

    document.addEventListener("keydown", function handler(e) {
        if (e.key === "Escape") closeModal(modalId);
        document.removeEventListener("keydown", handler);
    });
}

function closeModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.classList.remove("modal--active");

    hideOverlay();
}