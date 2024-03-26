// let scrollBonus = 0;

function startScroll() {
  chrome.storage.sync.get("scrollSpeed", ({ scrollSpeed }) => {
    const STEP = 0.5 * (scrollSpeed ?? 3);

    chrome.storage.sync.get("scrollDelayRef", ({ scrollDelayRef }) => {
      if (scrollDelayRef != null) {
        chrome.storage.sync.remove("scrollDelayRef", () => {
          clearInterval(scrollDelayRef);
          chrome.storage.sync.set({ isScrolling: false });
          chrome.runtime.sendMessage({ scroll: false });
        });
      } else {
        chrome.storage.sync.set({ isScrolling: true });
        chrome.runtime.sendMessage({ scroll: true });
        let scrollToHeight = window.pageYOffset;
        const scrollDelay = setInterval(() => {
          // if (scrollBonus > 0) {
          //   scrollToHeight += scrollBonus;
          //   scrollBonus = 0;
          // }
          window.scrollTo(0, scrollToHeight);
          scrollToHeight += STEP;
        }, 5); // scrolls every 10 milliseconds
        chrome.storage.sync.set({ scrollDelayRef: scrollDelay });
        let isCleared = false;
        function checkPageEnd() {
          const pageEndTimeout = setTimeout(checkPageEnd, 100);
          if (
            window.innerHeight + window.pageYOffset + STEP >=
              document.body.offsetHeight &&
            !isCleared
          ) {
            isCleared = true;
            chrome.storage.sync.get("isScrolling", ({ isScrolling }) => {
              if (isScrolling) {
                clearTimeout(pageEndTimeout);
                clearInterval(scrollDelay);
                chrome.storage.sync.remove("scrollDelayRef");
                chrome.runtime.sendMessage({ type: "next" });
              }
            });
          }
        }
        checkPageEnd();
      }
    });
  });
}

window.onkeydown = function (e) {
  // Spacebar
  if (e.keyCode == 32) {
    e.preventDefault();
    e.stopPropagation();
    // scrollBonus = 100;
    return false;
  }
};

startScroll();
