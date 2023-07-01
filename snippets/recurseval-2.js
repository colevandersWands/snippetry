(function recurseval() {
  eval(`(${recurseval.toString()})()`);
})();

// tags: quine
