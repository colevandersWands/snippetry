import deepCompare from './deep-compare.mjs';

export const expect = (received, not = false) => ({
  get not() {
    not = !not;
    return this;
  },
  toEqual(exp) {
    if (not ? deepCompare(received, exp) : !deepCompare(received, exp)) {
      console.log('%cReceived:', 'font-weight: bold;', received);
      console.log('%cExpected:', 'font-weight: bold;', exp);
      throw new Error(`Received does ${not ? '' : 'not '}equal Expected.`);
    }
  },
});

export default expect;

// tags: testing, minibrary
