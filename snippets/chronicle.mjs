import { clone, compare, freeze } from './deep.mjs';

export const chronicle = (
  actor,
  { mutation = false, recordThis = false, cloneThis = false } = {},
) => {
  const acts = [];
  return new Proxy(actor, {
    apply(target, thisVal, args) {
      acts.push({ act: 'call', args: clone(args) });
      if (recordThis) entry.this = cloneThis ? clone(thisVal) : thisVal;
      try {
        return (acts.at(-1).return = Reflect.apply(target, thisVal, args));
      } catch (error) {
        throw (acts.at(-1).error = error);
      } finally {
        if (mutation && !compare(args, acts.at(-1).args)) acts.at(-1).mutation = args;
      }
    },
    get(target, key) {
      if (key === '_chronicle') return freeze(clone(acts));
      if (key === '_forget') {
        const echo = clone(acts);
        while (acts.length > 0) acts.pop();
        return echo;
      }
      acts.push({ act: 'get', [key]: target[key] });
      return target[key];
    },
    set(target, key, value, _) {
      if (key === '_chronicle' || key === '_forget') return true;
      target[key] = value;
      acts.push({ act: 'set', [key]: value });
      return true;
    },
  });
};

export default chronicle;

// tags: minibrary
