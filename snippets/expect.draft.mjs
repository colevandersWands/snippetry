import deepCompare from './deep-compare.mjs';

export const expect = (exp, not = false) => ({
  get not() {
    not = !not;
    return this;
  },
  toEqual(receive) {
    if (not ? deepCompare(exp, receive) : !deepCompare(exp, receive)) {
      console.log('%cExpected:', 'font-weight: bold;', exp);
      console.log('%cReceived:', 'font-weight: bold;', receive);
      throw new Error(`Expected does ${not ? '' : 'not '}equal Received.`);
    }
  },
  toThrow(typeOrMessage) {
    // what's the simplest usefulest?
    let threw, error;
    try {
      exp();
    } catch (err) {
      (threw = true), (error = err);
    }
    if (not ? threw : !threw) {
      if (typeOrMessage) {
        /* https://jestjs.io/docs/expect#tothrowerror
          You can provide an optional argument to test that a specific error is thrown:
            regular expression: error message matches the pattern
            string: error message includes the substring
            error object: error message is equal to the message property of the object
            error class: error object is instance of class
        */
      } else {
      }
    }
  },
});

export default expect;

// tags: testing, minibrary
