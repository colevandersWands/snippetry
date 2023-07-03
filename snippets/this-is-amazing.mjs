import { describe, it as _this, expect } from './testing.mjs';

const amazing = function wow() {
  return this;
}.bind('amazing');

describe("this: it's amazing", () => {
  _this('is a string', () => {
    const beAmazed = amazing();
    expect(typeof beAmazed).toStrictEqual('string');
  });
  _this('is "amazing"', () => {
    const beAmazed = amazing();
    expect(beAmazed).toStrictEqual('amazing');
  });
});
