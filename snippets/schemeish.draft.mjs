/* scoping
  execution and environment only
  `only implement `define`, everything else is dev-provided
*/

export const compile = (...args) => [...args];
const run = () => {};

// --- operator signature spering

// at "compile time", args are closed, at "runtime", run is passed.  to be used or ignored
const operator = (run, ...args) => {};

// --- library drafting

export const environment = {};

export const schemeish = ({ env = environment, unary = false } = {}) => {
  return { compile, run };
};

const ID = (x) => x;

export const define = 'define'; // ID;
export const cond = 'cond'; // ID;
export const eq = 'eq'; // ID;
export const plus = 'plus'; // ID;
export const otherwise = 'otherwise'; // ID;
export const not = 'not'; // ID;

Object.assign(schemeish, { define, cond, eq, plus, otherwise, not });

export default schemeish;

// tags: minibrary
