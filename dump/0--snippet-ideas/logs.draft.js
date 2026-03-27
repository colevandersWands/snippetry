console.log();

let { log } = console;

// --- chainable// ---

log = (thing) => (console.log(thing), thing);

log = function (key = "") {
  console.log(this[key]);
  return this;
};

// --- with labels ---

log = (label) => (thing) => (console.log(label, thing), thing);

log = function (key = "") {
  console.log(`${key}:`, this[key]);
};

// monad? https://stackoverflow.com/questions/11871065/monads-in-javascript
// log = (m) => (typeof m !== "function" ? (console.log(m), m) : err());
