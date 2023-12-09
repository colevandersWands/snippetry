export const deMethod = (
  toDeMethod = {},
  { target = {}, statics = false, inherited = true, prefix = '' } = {},
) => {
  if (Array.isArray(toDeMethod)) {
    return toDeMethod.map((x) => deMethod(x, { target, statics, inherited, prefix }));
  }

  const toBundle = [];
  if (statics) {
    toBundle.push(...Reflect.ownKeys(toDeMethod).map((key) => 
      [key, toDeMethod[key], false]
    ));
  }
  if (inherited && toDeMethod.prototype) {
    toBundle.push(...Reflect.ownKeys(toDeMethod.prototype).map((key) => 
      [key, toDeMethod.prototype[key], true ]
    ));
  }

  for (const [name, value, isMethod] of toBundle) {
    if (typeof name !== 'string' || name === 'constructor') continue;
    if (typeof value !== 'function') continue;

    const bundleName = prefix 
      ? `${prefix}${/\w/i.test(prefix.at(-1))
          ? `${name[0].toUpperCase()}${name.slice(1, name.length)}`
          : name}`
      : name;

    target[bundleName] = isMethod 
      ? (that, ...args) => value.call(that, ...args) 
      : value;
  }

  return target;
};

export default deMethod;
