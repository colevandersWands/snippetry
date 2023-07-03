import deepCompare from './deep-compare.mjs';

export const expect = (first) => {
  return {
    toDeepEqual(second) {
      if (!deepCompare(first, second)) {
        console.log('%cFirst Thing:', 'font-weight: bold;', first);
        console.log('%cSecond Thing:', 'font-weight: bold;', second);
        throw new Error('the first thing did not deep equal the second thing.');
      }
    },
    toStrictEqual(second) {
      if (first !== second) {
        console.log('%cFirst Thing:', 'font-weight: bold;', first);
        console.log('%cSecond Thing:', 'font-weight: bold;', second);
        throw new Error(
          'the first thing did not strictly equal the second thing',
        );
      }
    },
  };
};

export default expect;

// tags: testing
