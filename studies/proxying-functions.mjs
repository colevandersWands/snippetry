// import tracedLog from '../snippets/log.mjs';
import togglog from '../snippets/togglog.mjs';

import { deepClone } from '../snippets/deep-clone.mjs';
import { deepCompare } from '../snippets/deep-compare.mjs';

// const log = togglog({ out: tracedLog });
const log = togglog();

/* questions:

	how to make a didactic dependency for tracing arbitrary functions?

*/

{
  log.label = 'all the functions: ';
  log.off;

  const wrap = (func) =>
    new Proxy(func, {
      apply(target, thisValue, args) {
        log(target, thisValue, args, target(...args));
      },
    });

  wrap(() => {})(1, 2, 3);
  wrap(function () {})(1, 2, 3);
  wrap(function* () {})(1, 2, 3);
  wrap(async function () {})(1, 2, 3);
  wrap(async function* () {})(1, 2, 3);
  const name = () => {};
  wrap(name)(1, 2, 3);
  wrap(function name() {})(1, 2, 3);
  wrap(function* name() {})(1, 2, 3);
  wrap(async function name() {})(1, 2, 3);
  wrap(async function* name() {})(1, 2, 3);
}

{
  // spun off to snippets/chronicle.mjs
  log.label = 'basic functions: ';
  log.on;

  const trace = (func) => {
    const history = [];
    return new Proxy(func, {
      apply(target, thisVal, args) {
        const args_before = deepClone(args);
        const entry = { args: args_before, this: thisVal };
        try {
          const returned = Reflect.apply(target, thisVal, args);
          entry.returned = returned;
          return returned;
        } catch (error) {
          entry.error = error;
          throw error;
        } finally {
          if (!deepCompare(args, args_before)) {
            entry.side_effects = args;
          }
          history.push(entry);
        }
      },
      get(target, key) {
        if (key === '_trace') return deepClone(history);
        else return target[key];
      },
    });
  };

  const goofy = (arg) => {
    if (Array.isArray(arg)) {
      arg.push('hoy');
    } else if (arg) {
      return arg;
    } else {
      throw arg;
    }
  };
  const goofy_traced = trace(goofy);

  log(goofy === goofy_traced);
  log(goofy.name, goofy_traced.name);

  goofy(true);
  goofy_traced(true);
  log(goofy._trace, goofy_traced._trace);

  try {
    goofy(false);
  } catch (err) {
    console.error(err);
  }
  try {
    goofy_traced(false);
  } catch (err) {
    console.error(err);
  }
  log(goofy._trace, goofy_traced._trace);

  goofy([1, 2, 3]);
  goofy_traced([1, 2, 3]);
  log(goofy._trace, goofy_traced._trace);

  log.label = 'basic functions - recursion:';

  const fib = (n = 0) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
  const fib_traced = trace(fib);
  log(fib_traced.name);
  fib_traced(10);
  log(fib_traced._trace); // only top-level, not recursive calls
}

{
  log.label = 'async functions: ';
  log.off;
}
