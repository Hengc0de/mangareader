const STOP = "#b53a3a";
const PLAY = "#6adb72";

// Initialize button with user's preferred color
let playstopElement = document.getElementById("playstop");
let playstopIcon = document.getElementById("playstopicon");
let nextElement = document.getElementById("nextbutton");
let previousElement = document.getElementById("previousbutton");

chrome.storage.sync.get("scrollDelayRef", ({ scrollDelayRef }) => {
  playstopElement.style.backgroundColor = scrollDelayRef != null ? STOP : PLAY;
  playstopIcon.className = scrollDelayRef != null ? "icon-stop" : "icon-play";
});

// When the button is clicked, inject setPageBackgroundColor into current page
playstopElement.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scroll.js"],
  });
});

nextElement.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["next.js"],
  });
});

previousElement.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["previous.js"],
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.scroll != null) {
    playstopElement.style.backgroundColor = request.scroll ? STOP : PLAY;
    playstopIcon.className = request.scroll ? "icon-stop" : "icon-play";
  }
});
