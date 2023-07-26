const _console_ = console;

export const describe = (name = '', testFunction = () => {}) => {
  _console_.group(`%c${name}`, 'font-weight: bold;');
  try {
    testFunction();
  } catch (err) {
    _console_.error('%cSUITE ERROR:', 'font-weight: bold;', err);
  }
  _console_.groupEnd();
};

export const it = (name = '', testFunction = () => {}) => {
  const out = Object.assign({}, _console_);
  const callOuts = [];
  Object.keys(_console_).forEach(
    (key) => (_console_[key] = (...args) => callOuts.push({ key, args })),
  );
  let thrown = null;
  try {
    testFunction();
  } catch (err) {
    thrown = err;
  }
  if (thrown)
    out.groupCollapsed(`%c✖ FAIL: ${name}`, 'font-weight: bold; color: red;');
  else
    out.groupCollapsed(`%c√ PASS: ${name}`, 'font-weight: bold; color: green;');
  callOuts.forEach((callOut) => out[callOut.key](...callOut.args));
  thrown && out.error(thrown);
  out.groupEnd(), Object.assign(_console_, out);
};

export default { describe, it };

// tags: testing, minibrary
