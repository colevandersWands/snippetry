export const deepCompare = (actual, expected) =>
  actual === expected ||
  Object.is(actual, expected) ||
  (Object(actual) === actual &&
    Object(expected) === expected &&
    ((Array.isArray(actual) &&
      Array.isArray(expected) &&
      actual.length === expected.length &&
      expected.every((expected, index) => deepCompare(actual[index], expected))) ||
      (Object.keys(actual).length === Object.keys(expected).length &&
        Object.keys(expected).every((key) => deepCompare(actual[key], expected[key])))));

export default deepCompare;

// tags: useful, testing
