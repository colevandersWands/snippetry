(function waitForIt(wait = 0) {
  console.log('wait for it ...');
  wait = setTimeout(() => waitForIt(wait), wait);
})();
