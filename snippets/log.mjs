export const out = console;

export const log = (...things) => (
  out.groupCollapsed(...things), out.trace(), out.groupEnd(), things[0]
);

export const levels = Object.keys(out).reduce(
  (all, key) => ({
    ...all,
    [key]: (...things) => (out[key](...things), things[0]),
  }),
  {},
);

export const tag = Object.keys(out).reduce(
  (all, key) => ({
    ...all,
    [key]: (tag) => (...things) => (out[key](tag, ...things), things[0]),
  }),
  {},
);

export default Object.assign(log, levels);

// tags:  minibrary, useful
