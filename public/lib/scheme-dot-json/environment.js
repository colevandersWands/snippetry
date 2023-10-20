export const environment = {
  ';': () => undefined,

  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => (args.length === 1 ? -args[0] : args.reduce((a, b) => a - b)),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => a / b),

  '=': (...args) =>
    args
      .slice(1)
      .map((next, i) => args[i] === next)
      .every((x) => x),
  '>': (...args) =>
    args
      .slice(1)
      .map((next, i) => args[i] > next)
      .every((x) => x),
  '<': (...args) =>
    args
      .slice(1)
      .map((next, i) => args[i] < next)
      .every((x) => x),
  '>=': (...args) =>
    args
      .slice(1)
      .map((next, i) => args[i] >= next)
      .every((x) => x),
  '<=': (...args) =>
    args
      .slice(1)
      .map((next, i) => args[i] <= next)
      .every((x) => x),

  and: (...args) => Boolean(args.reduce((a, b) => a && b)),
  or: (...args) => Boolean(args.reduce((a, b) => a || b)),
  not: (...args) => Boolean(!args[0]),

  log: (...args) => (console.log(...args), args.pop()),
  prompt: (message) => prompt(message),
  alert: (message) => alert(message),
  confirm: (message) => confirm(message),

  assert: (assertion, message) => {
    if (assertion) return undefined;
    else throw new Error(message || `Assertion Error: ${assertion}`);
  },
};
