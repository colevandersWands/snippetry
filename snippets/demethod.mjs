export const demethod = (
  toDemethod = {},
  { target = {}, statics = false, inherited = true, prefix = '' } = {},
) => {
  if (Array.isArray(toDemethod)) {
    return toDemethod.map((x) => demethod(x, { target, statics, inherited, prefix }));
  }

  const toWrap = [];
  if (statics) {
    toWrap.push(...Reflect.ownKeys(toDemethod).map((key) => 
      [key, toDemethod[key], false]
    ));
  }
  if (inherited && toDemethod.prototype) {
    toWrap.push(...Reflect.ownKeys(toDemethod.prototype).map((key) => 
      [key, toDemethod.prototype[key], true ]
    ));
  }

  for (const [name, value, isMethod] of toWrap) {
    if (typeof name !== 'string' || name === 'constructor') continue;
    if (typeof value !== 'function') continue;

    const bundleName = prefix 
      ? `${prefix}${/\w/i.test(prefix.at(-1))
          ? `${name[0].toUpperCase()}${name.slice(1, name.length)}`
          : name}`
      : name;

    target[bundleName] = isMethod 
      ? (that, ...args) => value.apply(that, args) 
      : value;
  }

  return target;
};

export default demethod;

// tags: minibrary