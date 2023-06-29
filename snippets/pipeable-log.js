const log = (thing) => (
  console.groupCollapsed(thing), console.trace(), console.groupEnd(), thing
);

log('l' + log('o' + log('g')));

// tags: useful
