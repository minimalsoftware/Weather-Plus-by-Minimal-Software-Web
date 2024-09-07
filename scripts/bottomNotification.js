const bottomNotification = document.querySelector('.notification');
const NOTIFICATION_TIMEOUT = 5000;

function showNotification(text) {
    bottomNotification.textContent = text;
    bottomNotification.classList.add('notification--visible');

    setTimeout(() => {
        bottomNotification.classList.remove('notification--visible');
    }, NOTIFICATION_TIMEOUT);
}