fetch('./recurseval.3.js')
  .then((res) => res.text())
  .then((code) => (console.log(code), eval(code)))
  .catch(console.error);
