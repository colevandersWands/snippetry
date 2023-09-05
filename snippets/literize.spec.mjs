import { describe, test, expect } from './testing.mjs';

import literize from './literize.mjs';

describe('literize wraps a function so it can be called as a tagged string literal with a human-readable description', () => {
  describe('literize can configurably sequence its arguments', () => {
    test('it should pass the arguments in order by default', () => {
      expect(literize((...args) => args)`${1}${2}${3}`).toEqual([1, 2, 3]);
    });
    test('it should shuffle the arguments when initialized with a permutation array', () => {
      const shuffled = literize((...args) => args, [3, 2, 4, 1]);
      expect(shuffled`${1}${2}${3}${4}${5}`).toEqual([4, 2, 1, 3, 5]);
    });
    test('it structures keyed arguments into one object', () => {
      const keyed = literize((arg) => arg, 'keyed');
      expect(keyed`${{ c: 3 }}${{ a: 1 }}${{ b: 2 }}`).toEqual({ a: 1, b: 2, c: 3 });
    });
  });
  describe('literize returns a function with a descriptive name', () => {
    test('it creates a name for anonymous functions', () => {
      expect(literize(() => {}).name).toEqual('literateFunction');
    });
    test('it modifies the name of named functions', () => {
      expect(literize(function empty() {}).name).toEqual('literateEmpty');
    });
  });
});
