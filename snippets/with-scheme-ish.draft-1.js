const log = (...things) => {
  console.groupCollapsed(...things);
  console.trace();
  console.groupEnd();
  return things.at(-1);
};

// const write = (key, value) => (scopeStack.at(-1)[key] = value);
// const pushScope = () => scopeStack.push(Object.create(scopeStack.at(-1)));
// const popScope = () => scopeStack.pop();

const run = (program) => {
  debugger;
  log('whaa: ', program);
  if (Array.isArray(program)) {
    if (typeof program[0] === 'function') {
      return program[0](...program.slice(1));
    } else if (Array.isArray(scopeStack.at(-1)[program[0]])) {
      run; // ... see scheme dot json
    } else {
      return program.map(run).at(-1);
    }
  } else {
    return program;
  }
};

const environment = new Proxy(
  [
    {
      run,
      [Symbol.unscopables]: {},
      define: (name, value) => {
        log('in define');
        if (Array.isArray(name)) {
        } else {
          scopeStack.at(-1)[run(name)] = run(value);
        }
      },
      alert: (msg) => alert(run(msg)),
      prompt: (msg) => prompt(run(msg)),
      log: (...msgs) => log(...msgs.map(run)),
      iff: (cond, cons, alt) => (run(cond) ? run(cons) : run(alt)),
      eq: (...args) => args.map(run).every((i, _, arr) => i === arr[0]),
    },
  ],
  {
    // https://stackoverflow.com/a/46082541
    has(scopeStack, key) {
      // log(key);
      if (scopeStack.at(-1)[key] === undefined) {
        log(scopeStack);
        throw new ReferenceError(`${key.toString()} is not defined`);
      }
      return true;
    },
    get(scopeStack, key) {
      console.log('get this: ', this);
      const value = scopeStack.at(-1)[key];
      if (typeof value === 'function') {
        value();
      }
    },
  },
);

with (environment) {
  [
    alert,
    [
      iff,
      [eq, [log, [prompt, 'cat please']], 'cat'],
      'thank you for the cat',
      'not a cat',
    ],
  ];

  [
    [define, 'x', 1],
    [alert, x],
  ];
}
