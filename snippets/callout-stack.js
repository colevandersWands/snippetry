const calloutStack = (msg = '') =>
  eval(
    msg
      .split('')
      .reduce((acc, next) => `(function ${next}() { ${acc} })()`, `"${msg}"()`),
  );

calloutStack('jenga');

// tags: useless
