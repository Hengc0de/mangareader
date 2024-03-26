function getPreviousChapterURLHelper(currentURL) {
  const NUMBER_REGEX = /[0-9]+/g;

  const potentials = [];
  const numbers = currentURL.match(NUMBER_REGEX);
  numbers.forEach((number) => {
    let prefix = "";
    if (number.startsWith("0")) {
      prefix += "0";
    }
    potentials.push(
      currentURL.replace(number, prefix + (parseInt(number) - 1))
    );
  });

  for (let i = 0; i < potentials.length; i++) {
    const potential = potentials[i].split("#")[0];
    const nextButton = document.body.querySelector(
      "a[href='" + potential + "']"
    );
    if (nextButton != null) {
      return potential;
    }
  }
}

function getPreviousChapterURL() {
  let url = getPreviousChapterURLHelper(window.location.href);
  let urlToReturn = null;
  if (url != null) {
    urlToReturn = url;
  } else {
    url = getPreviousChapterURLHelper(window.location.pathname);
    if (url != null) {
      urlToReturn = window.location.hostname + url;
    }
  }
  if (urlToReturn != null && !urlToReturn.startsWith("http")) {
    urlToReturn = "http://" + urlToReturn;
  }
  return urlToReturn;
}

function toPreviousChapter() {
  const previousChapterURL = getPreviousChapterURL();
  if (previousChapterURL != null) {
    chrome.runtime.sendMessage({ url: previousChapterURL });
  }
}

toPreviousChapter();
