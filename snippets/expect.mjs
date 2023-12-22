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
  toThrow(expect1, expect2 = '') {
    if (typeof received !== 'function') throw new Error('Did not receive a function');
    let threw = false, error;
    try {
      received();
    } catch (err) {
      (threw = true), (error = err);
    }
    if (not) {
      if (threw) {
        throw new Error(`Received threw an error -> ${error.name}: ${error.message}`);
      }
    } else if (threw) {
      if (expect1?.name?.includes('Error') && error?.name !== expect1?.name)
        throw new Error(`Threw ${error.name}, expected ${expect1.prototype.name}`);
      const messageMatcher = typeof expect1 === 'string' ? expect1 : expect2;
      if (messageMatcher && !new RegExp(messageMatcher, 'i').test(error.message))
        throw new Error(`Message "${error.message}" should include "${messageMatcher}"`);
    } else {
      throw new Error('Received did not throw an error.');
    }
  },
});

export default expect;

// tags: testing, minibrary
