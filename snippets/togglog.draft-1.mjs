export const togglog = ({ write = true, out = console.log, unary = true } = {}) =>
  Object.defineProperties(
    Object.assign(
      function log(...args) {
        if (write) out(...args);
        return unary ? args[0] : args;
      },
      Object.keys(console).reduce(
        (all, next) => ({
          ...all,
          [next]: (...args) => void (write && console[next](...args)),
        }),
        {},
      ),
    ),
    {
      on: { get: () => (write = true), enumerable: false },
      off: { get: () => (write = false), enumerable: false },
      logging: { get: () => write, enumerable: false },
    },
  );

export default togglog;

// tags: minibrary
