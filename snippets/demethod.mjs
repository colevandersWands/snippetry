const prefixName = (prefix, name) => `${prefix}${/[^\$\_]/i.test(prefix.at(-1))
      ? `${name[0].toUpperCase()}${name.slice(1, name.length)}`
      : name}`;

export const demethod = (
  toDemethod = {},
  { me = false, statics = false, inherited = true, prefix = '', target = {} } = {},
) => {
  if (Array.isArray(toDemethod)) {
    return toDemethod.map((x) => demethod(x, { target, statics, inherited, prefix }));
  }
  if (me) {
    const name = prefixName(prefix, toDemethod.name);
    return { [name]: (that, ...args) => toDemethod.call(that, ...args) }[name];
  }

  const toWrap = [];
  if (statics) {
    toWrap.push(...Reflect.ownKeys(toDemethod).map((key) => 
      [key, toDemethod[key], false]
    ));
  }
  if (inherited && toDemethod.prototype) {
    toWrap.push(...Reflect.ownKeys(toDemethod.prototype).map((key) => 
      [ key, toDemethod.prototype[key], true]
    ));
  }
  for (const [name, value, isMethod] of toWrap) {
    if (typeof name !== 'string' || name === 'constructor') continue;
    if (typeof value !== 'function') continue;
    
    const pseudonym = prefix ? prefixName(prefix, name) : name;
    target[pseudonym] = isMethod ? (that, ...args) => value.call(that, ...args) : value;
  }

  return target;
};

export default demethod;

// tags: minibrary
