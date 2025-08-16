const globalsBackup = { ...globalThis };

const globalize = (target = {}) => {
  // add global get/sets for each property in the target
  // 	these sync any global property changes to the target
};

const deglobalize = (target = {}) => {
  // remove all target props from global, returning backups if necessary
};

const wrap = (method, target) =>
  function (...args) {
    globalize(target);
    const result = method.call(target, ...args);
    deglobalize(target);
    return result;
  };

export const withThis = (target = {}) => {
  // ? proxy target so it wraps any new methods added later on
  for (const key in target) {
    if (typeof target[key] === 'function') {
      const method = target[key];
      target[key] = wrap(target[key], target);
    }
  }
  return target;
};

export default withThis;

const snippet = {
  title: '',
  edit($block) {
    $block();
  },
};

withThis(snippet).edit(() => {
  title = 3;
});

console.log(snippet);
