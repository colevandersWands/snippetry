import { describe, it } from './testing.mjs';

const canNotEven = (maybe, strict) =>
  strict && typeof maybe !== 'number'
    ? maybe
    : maybe % 2 === 0
    ? even(maybe)
    : maybe;

describe('canNotEven: can not even', () => {
  describe('sort of', () => {
    it('can odd numbers', () => canNotEven(1));
    it('can odd strings', () => canNotEven('1'));
    it('can odd number objects', () => canNotEven(new Number(1)));

    it('can not even numbers', () => canNotEven(2));
    it('can not even strings', () => canNotEven('2'));
    it('can not even number objects', () => canNotEven(new Number(2)));
  });
  describe('exactly', () => {
    it('can odd numbers', () => canNotEven(1, true));
    it('can odd strings', () => canNotEven('1', true));
    it('can even strings', () => canNotEven('2', true));
    it('can odd number objects', () => canNotEven(new Number(1), true));
    it('can even number objects', () => canNotEven(new Number(2), true));

    it('can not even numbers', () => canNotEven(2, true));
  });
});

function even(number) {
  (function not() {
    (function can() {
      throw new Error(`can not ${number}`);
    })();
  })();
}

// tags: remix
// inspiration: https://github.com/blakek/cannot-even
