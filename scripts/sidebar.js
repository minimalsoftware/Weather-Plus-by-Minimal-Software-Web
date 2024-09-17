const mainContent = document.querySelector(".main-content");
const sidebar = document.querySelector(".sidebar");

let hasToggled = false;

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;

document.addEventListener("DOMContentLoaded", () => {
    const resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.addEventListener("dblclick", restoreSidebarWidth);
    sidebar.appendChild(resizer);
    sidebar.style.width = `${settings.sidebarWidth}px`;
    mainContent.style.width = `calc(100vw - ${settings.sidebarWidth}px)`;

    let isResizing = false;

    resizer.addEventListener("mousedown", (e) => {
        isResizing = true;
        hasToggled = false;
        resizer.classList.add("resizing");
        document.body.style.cursor = "col-resize";
        document.addEventListener("mousemove", resizeSidebar);
        document.addEventListener("mouseup", stopResizing);
        e.preventDefault();
    });

    function resizeSidebar(e) {
        if (isResizing) {
            let newWidth = e.clientX - sidebar.getBoundingClientRect().left;
            if (newWidth - MIN_SIDEBAR_WIDTH < -100) {
                if (!hasToggled) {
                    toggleSidebar();
                    stopResizing();
                    hasToggled = true;
                    mainContent.style.width = `100vw`;
                }
            } else if (!hasToggled) {
                if (newWidth < MIN_SIDEBAR_WIDTH) newWidth = MIN_SIDEBAR_WIDTH;
                if (newWidth > MAX_SIDEBAR_WIDTH) newWidth = MAX_SIDEBAR_WIDTH;
                mainContent.style.width = `calc(100vw - ${newWidth}px)`;
                sidebar.style.width = `${newWidth}px`;
                hasToggled = false;

                settings.sidebarWidth = newWidth;
                saveSettings();

                locationsMarquee();
            }
        }
    }

    function stopResizing() {
        isResizing = false;
        resizer.classList.remove("resizing");
        document.body.style.cursor = "default";
        document.removeEventListener("mousemove", resizeSidebar);
        document.removeEventListener("mouseup", stopResizing);
        hasToggled = false;
    }
});

function toggleSidebar() {
    settings.sidebarState = sidebar.classList.contains("sidebar--closed");
    sidebar.style.transitionDuration = "300ms";
    sidebar.classList.toggle("sidebar--closed");

    // Remove inline CSS
    sidebar.style.width = sidebar.classList.contains("sidebar--closed") ? "0" : `${settings.sidebarWidth}px`;
    mainContent.style.width = sidebar.classList.contains("sidebar--closed") ? "100vw" : `calc(100vw - ${settings.sidebarWidth}px)`;
    mainContent.style.transitionDuration = "300ms";
    document.querySelector(".top-bar__button").classList.toggle("sidebar__toggle-button--reversed");

    setTimeout(() => {
        sidebar.style.transitionDuration = "";
        mainContent.style.transitionDuration = "";
        updatePath();
    }, 300);

    saveSettings();
}

function closeSidebar() {
    sidebar.classList.add("sidebar--closed");
    sidebar.style.width = "0";
    mainContent.style.width = "100vw";
    document.querySelector(".top-bar__button").classList.add("sidebar__toggle-button--reversed");
}

function restoreSidebarWidth() {
    sidebar.style.width = "";
    mainContent.style.width = "";

    settings.sidebarWidth = 300;
    saveSettings();
}

window.addEventListener("DOMContentLoaded", () => {
    updatePath();
    if (!settings.sidebarState) {
        closeSidebar();
        saveSettings();
    }
});