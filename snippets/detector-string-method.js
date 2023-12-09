String.prototype.detect = function detect(comparison = 'strict') {
  const isNotDetected =
    comparison === 'strict'
      ? (input = '') => input !== this
      : comparison == 'loose'
      ? (input = '') => input != this
      : comparison === 'mixed'
      ? (input = '') => input?.toLowerCase() !== this
      : (input = '') => !new RegExp(this, comparison).test(input);

  while (isNotDetected(prompt(`"${this}" please:`)));

  alert(`Thank you for "${this}"`);
};

// tags: polyfill