const calloutStack = (msg = '') =>
  eval(msg.split('').reduce((acc, next) => `(${next} = () => ${acc})()`, msg));

calloutStack('jenga');

// tags: useless
