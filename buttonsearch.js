function getNextChapterURL() {
  const NUMBER_AT_END_REGEX = /[0-9]+$/;
  const currentURL = window.location.href;
  const newURL = [];
  const possibles = currentURL.split("/");

  // Search from the last one first
  for (let i = possibles.length - 1; i >= 0; i--) {
    let possible = possibles[i];
    const numbers = possible.match(NUMBER_AT_END_REGEX);
    if (numbers != null && numbers.length > 0) {
      const number = parseInt(numbers[0]); // There should really only be one
      possible = possible.replace(NUMBER_AT_END_REGEX, number + 1);
    }
    newURL.unshift(possible); // Since this loop is in reverse, insert to beginning
  }
  return newURL.join("/");
}
