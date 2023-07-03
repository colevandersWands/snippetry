import expect from './expect.mjs';
import { describe, it } from './describe-it.mjs';
// import test from './describe-it.mjs';

describe('a suite', () => {
  describe('deep compare', () => {
    it('pass', () => {
      console.log('hoydee');
      expect([1, 2]).toDeepEqual([1, 2]);
    });
    it('fail', () => {
      expect([1, 2]).toDeepEqual([2, 1]);
    });
  });
  describe('strict equality', () => {
    it('pass', () => {
      expect(1).toDeepEqual(1);
    });
    it('fail', () => {
      expect(2).toDeepEqual(1);
    });
  });
});
