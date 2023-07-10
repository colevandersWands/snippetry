(function waitForIt(wait = 0) {
  console.log(wait);
  wait = setTimeout(() => waitForIt(wait), wait);
})();
