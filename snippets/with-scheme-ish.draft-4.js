const log = (...things) => {
  console.groupCollapsed(...things);
  console.trace();
  console.groupEnd();
  return things.at(-1);
};

const bootstraps = new Proxy(
  {
    [Symbol.unscopables]: {},
    define(key, value) {
      this[key] = value;
    },
  },
  {
    // https://stackoverflow.com/a/46082541
    has(environment, key) {
      if (environment[key] === undefined) {
        throw new ReferenceError(`${key.toString()} is not defined`);
      }
      return true;
    },
    get(environment, key) {
      return environment[key];
    },
  },
);

with (bootstraps) {
  define('x', 1);
  define('log', []);
}
