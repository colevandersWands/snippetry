export const log = (thing) => (
  console.groupCollapsed(thing), console.trace(), console.groupEnd(), thing
);

export const out = Object.entries(console).reduce(
  (all, next) => ({
    ...all,
    [next[0]]: (thing) => (console[next[0]](thing), thing),
  }),
  {},
);

export default Object.assign(log, out);

// tags:  minibrary, useful
