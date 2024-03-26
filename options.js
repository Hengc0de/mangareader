let rangeSlider = document.getElementById("rs-range-line");
let rangeBullet = document.getElementById("rs-bullet");
let saveButton = document.getElementById("save");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  const bulletPosition =
    (rangeSlider.value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min);
  rangeBullet.style.left = bulletPosition * 578 + 2 + "px";
}

chrome.storage.sync.get("scrollSpeed", ({ scrollSpeed }) => {
  rangeSlider.value = scrollSpeed ?? 3;
  showSliderValue();
});

let changeSaveButtonTextTimeout = null;
saveButton.onclick = () => {
  chrome.storage.sync.set({ scrollSpeed: rangeSlider.value }, () => {
    clearTimeout(changeSaveButtonTextTimeout);
    saveButton.innerHTML = "Saved!";
    changeSaveButtonTextTimeout = setTimeout(function () {
      saveButton.innerHTML = "Save Changes";
    }, 3000);
  });
};
