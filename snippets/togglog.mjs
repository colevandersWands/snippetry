export const togglog = ({ write = true, out = console.log, unary = true } = {}) => {
  const log = (...things) => {
    if (write) out(...things);
    return unary ? things[0] : things;
  };

  const togglesole = Object.keys(console).reduce((allMethods, nextKey) => {
    allMethods[nextKey] = (...things) => {
      if (write) console[nextKey](...things);
      return unary ? things[0] : things;
    };
    return allMethods;
  }, {});
  Object.assign(log, togglesole);

  const toggles = {
    toggle: { get: () => (write = !write), enumerable: false },
    on: { get: () => (write = true), enumerable: false },
    off: { get: () => (write = false), enumerable: false },
    is: { get: () => write, enumerable: false },
  };
  Object.defineProperties(log, toggles);

  return log;
};

export default togglog;

// tags: minibrary
