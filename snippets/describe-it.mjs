export const describe = (name = '', testFunction = () => {}) => {
  console.group(`%c${name}`, 'font-weight: bold;');
  try {
    testFunction();
  } catch (err) {
    console.error('%cSUITE ERROR:', 'font-weight: bold;', err);
  }
  console.groupEnd();
};

export const it = (name = '', testFunction = () => {}) => {
  const out = Object.assign({}, console);
  const callOuts = [];
  Object.keys(console).forEach(
    (key) => (console[key] = (...args) => callOuts.push({ key, args })),
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
  out.groupEnd();
  Object.assign(console, out);
};

export default { describe, it };

// tags: testing
