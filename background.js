chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.tab.id == null) {
    return;
  }
  if (request.url != null) {
    chrome.storage.sync.set({ urlToScroll: request.url });
    chrome.storage.sync.set({ tabToScroll: sender.tab.id });
    chrome.tabs.update(sender.tab.id, { url: request.url });
  } else if (request.type === "next") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["next.js"],
    });
  } else if (request.type === "previous") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["previous.js"],
    });
  }
});

chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.storage.sync.get(["urlToScroll", "tabToScroll"], (result) => {
    if (details.url === result.urlToScroll && result.tabToScroll != null) {
      chrome.scripting.executeScript(
        {
          target: { tabId: result.tabToScroll },
          files: ["scroll.js"],
        },
        () => chrome.storage.sync.remove(["urlToScroll", "tabToScroll"])
      );
    }
  });
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "start-stop") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["scroll.js"],
      });
    });
  } else if (command === "next") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["next.js"],
      });
    });
  } else if (command === "previous") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["previous.js"],
      });
    });
  }
});
