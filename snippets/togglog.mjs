export const togglog = ({ write = true, out = console.log, label = null } = {}) => {
  const log = (...things) => {
    if (label !== null) things.unshift(label);
    if (write) out(...things);
    return things.pop();
  };

  Object.defineProperties(log, {
    log: { get: () => log },

    on: { get: () => ((write = true), log) },
    off: { get: () => ((write = false), log) },
    toggle: { get: () => ((write = !write), log) },

    is: { get: () => (write ? 'on' : 'off') },

    out: { set: (newOut) => (out = newOut) },
    label: { set: (newLabel) => (label = newLabel) },
  });

  return log;
};

export default togglog;

// tags: minibrary
