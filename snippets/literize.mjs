export const literize = (fn, argsFormat) => {
  const literateFunctionName = fn.name
    ? `literate${fn.name[0].toUpperCase() + fn.name.substr(1)}`
    : 'literateFunction';

  return {
    [literateFunctionName]: (_, ...args) => {
      if (argsFormat === 'keyed') {
        return fn(args.reduce((all, next) => ({ ...all, ...next }), {}));
      } else if (Array.isArray(argsFormat)) {
        const shuffled = [];
        for (let i = 0; i < args.length; i++) {
          if (typeof argsFormat[i] === 'number') {
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
};

export default literize;

// tags: minibrary
