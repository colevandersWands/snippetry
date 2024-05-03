import { describe, it, expect } from './testing.mjs';

const thisIs = function amazing() { return this }.bind('amazing');

describe("this: it's amazing", () => {
  it('is "amazing"', () => expect(thisIs()).toEqual('amazing'));
});
