export const literize = (fn, argsFormat) => {
  const literateFunctionName = fn.name
    ? `literate${fn.name[0].toUpperCase() + fn.name.substr(1)}`
    : 'literateFunction';

  const literateFunction = {
    [literateFunctionName]: (_, ...args) => {
      if (Array.isArray(argsFormat) && argsFormat.every((i) => typeof i === 'string')) {
        const keyed = {};
        for (let i = 0; i < argsFormat.length; i++) {
          keyed[argsFormat[i]] = args[i];
        }
        return fn(keyed);
      } else if (
        Array.isArray(argsFormat) &&
        argsFormat.every((i) => typeof i === 'number')
      ) {
        const shuffled = [];
        for (let i = 0; i < args.length; i++) {
          if (argsFormat[i] !== undefined) {
            shuffled[argsFormat[i] - 1] = args[i];
          } else {
            shuffled[i] = args[i];
          }
        }
        return fn(...shuffled);
      } else {
        return fn(...args);
      }
      ß;
    },
  }[literateFunctionName];

  return literateFunction;
};

export default literize;

// tags: minibrary
