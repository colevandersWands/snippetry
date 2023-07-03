export const deepCompare = (actual, expect) => {
  return (
    actual === expect ||
    Object.is(actual, expect) ||
    (Object(actual) === actual &&
      Object(expect) === expect &&
      ((Array.isArray(actual) &&
        Array.isArray(expect) &&
        actual.length === expect.length &&
        expect.every((expect, index) => deepCompare(actual[index], expect))) ||
        (Object.keys(actual).length === Object.keys(expect).length &&
          Object.keys(expect).every((key) =>
            deepCompare(actual[key], expect[key]),
          ))))
  );
};

export default deepCompare;

// tags: useful, testing
