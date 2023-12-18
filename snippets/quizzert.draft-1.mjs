import deepCompare from './deep-compare.mjs';

export const quizzert = (received, { not = false } = {s}) => ({
  get not() {
    not = !not;
    return this;
  },
  equals(exp) {
    if (not ? deepCompare(received, exp) : !deepCompare(received, exp)) {
      console.log('%cReceived:', 'font-weight: bold;', received);
      console.log('%cExpected:', 'font-weight: bold;', exp);
      throw new Error(`Received does ${not ? '' : 'not '}equal Expected.`);
    }
  },
  multipleChoice(exp) {},
});

export default quizzert;

// tags: minibrary
