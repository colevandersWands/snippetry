export const deepFreeze = (thing) => {
  if (Array.isArray(thing)) {
    thing.forEach(deepFreeze);
    return Object.freeze(thing);
  }

  if (typeof thing === 'object' && thing !== null) {
    Object.values(thing).forEach(deepFreeze);
    return Object.freeze(thing);
  }

  return thing;
};

export default deepFreeze;

// tags: useful
