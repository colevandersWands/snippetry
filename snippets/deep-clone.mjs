export const deepClone = (src, clonesMap = new Map()) => {
  if (clonesMap.has(src)) return clonesMap.get(src);

  let clone = src;

  if (typeof src === 'function' || Object(src) !== src) {
    clone = src;
  } else if (src instanceof Date) {
    clone = new Date(src.getTime());
  } else if (src instanceof RegExp) {
    clone = new RegExp(src);
  } else if (Array.isArray(src)) {
    clone = src.map((item) => deepClone(item, clonesMap));
  } else if (src instanceof Error) {
    clone = new src.constructor(src.message);
    clone.stack = src.stack;
  } else if (src instanceof Object) {
    clone = Object.create(src.__proto__);
    for (const key in src) clone[key] = deepClone(src[key], clonesMap);
  }

  clonesMap.set(src, clone);

  return clone;
};

export default deepClone;

// tags: useful
