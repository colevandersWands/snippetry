const globalBackup = { ...globalThis };

const globalize = (target = {}) => {
  for (const key in target) {
    const value = target[key];
    globalThis[key] =
      typeof value === 'function' && value.bind ? value.bind(target) : value;
  }
};

const deglobalize = (target = {}) => {
  for (const key in target) {
    if (key in globalBackup) {
      globalThis[key] = globalBackup[key];
    } else {
      delete globalThis[key];
    }
  }
};

const wrap = (method, target) =>
  function (...args) {
    try {
      globalize(target);
      return method.call(target, ...args);
    } finally {
      deglobalize(target);
    }
  };

export const withThis = (target) => {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop];
      return typeof value === 'function' ? wrap(value, target) : value;
    },
  });
};

export default withThis;

const snippet = {
  title: 'asdf',
  rename(newTitle = '') {
    this.title = newTitle;
  },
  edit($block) {
    $block(this);
  },
};

withThis(snippet).edit(() => {
  rename(title + '!');
});

console.log(snippet);
