/**
 * Initialises the segmented buttons.
 */
function loadSegmentedButtons() {
    document.querySelectorAll(".segmented-button").forEach(segmentedButton => {
        const buttons = segmentedButton.querySelectorAll(".segmented-button__item");

        const selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

        if (selectedButton) {
            segmentedButton.style.setProperty("--selected-width", `${selectedButton.offsetWidth}px`);
            segmentedButton.style.setProperty("--selected-left", `${selectedButton.offsetLeft - 5}px`);
        }

        requestAnimationFrame(() => {
            buttons.forEach((button, index) => {
                button.addEventListener("click", () => {
                    buttons.forEach(btn => btn.classList.remove("segmented-button__item--selected"));

                    button.classList.add("segmented-button__item--selected");
                    button.closest(".segmented-button").style.overflowX = "hidden";

                    const buttonRect = button.getBoundingClientRect();
                    const containerRect = segmentedButton.getBoundingClientRect();
                    const offsetLeft = buttonRect.left - containerRect.left;

                    segmentedButton.style.setProperty("--selected-index", index);
                    segmentedButton.style.setProperty("--selected-width", `${buttonRect.width}px`);
                    segmentedButton.style.setProperty("--selected-left", `${offsetLeft - 5}px`);

                    setTimeout(() => {
                        button.closest(".segmented-button").style.overflowX = "auto";
                    }, 300);
                });
            });
        });
    });
}

/**
 * Sets the active button in a segmented button.
 * @param segmentedButton The segmented button.
 * @param index The index of the button to set active.
 */
function setActiveButton(segmentedButton, index) {
    setTimeout(() => {
        const buttons = segmentedButton.querySelectorAll(".segmented-button__item");
        buttons.forEach(btn => btn.classList.remove("segmented-button__item--selected"));

        buttons[index].classList.add("segmented-button__item--selected");
        let selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

        const buttonRect = selectedButton.getBoundingClientRect();
        const containerRect = segmentedButton.getBoundingClientRect();
        const offsetLeft = buttonRect.left - containerRect.left;

        segmentedButton.style.setProperty("--selected-index", index);
        segmentedButton.style.setProperty("--selected-width", `${buttonRect.width}px`);
        segmentedButton.style.setProperty("--selected-left", `${offsetLeft - 5}px`);
    }, 500);
}

/**
 * Refreshes the segmented button.
 * @param segmentedButton The segmented button to refresh.
 */
function refreshSegmentedButton(segmentedButton) {
    const selectedButton = segmentedButton.querySelector(".segmented-button__item--selected");

    segmentedButton.style.setProperty("--selected-width", `${selectedButton.offsetWidth}px`);
    segmentedButton.style.setProperty("--selected-left", `${selectedButton.offsetLeft - 5}px`);
}