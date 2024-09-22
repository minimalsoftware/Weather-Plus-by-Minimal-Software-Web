const bottomNotification = document.querySelector(".notification");
const NOTIFICATION_TIMEOUT = 5000;

/**
 * Shows a notification at the bottom of the screen.
 * @param {string} text The text to display in the notification.
 */
function showNotification(text) {
    bottomNotification.textContent = text;
    bottomNotification.classList.add("notification--visible");

    setTimeout(() => {
        bottomNotification.classList.remove("notification--visible");
    }, NOTIFICATION_TIMEOUT);
}