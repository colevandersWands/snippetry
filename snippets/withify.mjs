const gobalBackup = { ...globalThis };

const globalize = (target) => {
  for (const key in target) {
    Object.defineProperty(globalThis, key, {
      get() {
        return typeof target[key] === 'function' ? target[key].bind(target) : target[key]; 
      },
      set(value) { target[key] = value; },
      configurable: true,
    });
  }
};

const deglobalize = (target) => {
  for (const key in target) {
    if (key in gobalBackup) globalThis[key] = gobalBackup[key];
    else delete globalThis[key];
  }
};

const wrap = (method, target) => (...args) => {
    try {
      globalize(target);
      const result = method.call(target, ...args);
      return result === target ? withify.dsl(target) : result
    } finally {
      deglobalize(target);
    }
  };

export const withify = (target) => ($block) => wrap($block, target)()
withify.dsl = (target) => new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop];
      return typeof value === 'function' ? wrap(value, target) : value;
    },
  });

export default withify;

// tags: minibrary, coAIthored
