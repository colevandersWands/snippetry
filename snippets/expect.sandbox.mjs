import { expect } from './expect.mjs';

// expect(true).not.toEqual(true);

// expect().toThrow(); // should fail, did fail
// expect(() => null).toThrow(); // should fail, did fail
// expect(() => null).not.toThrow(); // should pass, did pass
// expect(() => null()).toThrow(); // should pass, did pass
// expect(() => null()).not.toThrow(); // should fail, did fail
// expect(() => null()).toThrow(TypeError); // should pass, did pass
// expect(() => null()).toThrow(Error); // should fail, did fail
// expect(() => null()).toThrow('a function'); // should pass, did pass
// expect(() => null()).toThrow('afunction'); // should fail, did fail
// expect(() => null()).toThrow(TypeError, 'a function'); // should pass, did pass
// expect(() => null()).toThrow(Error, 'a function'); // should fail, did fail
// expect(() => null()).toThrow(TypeError, 'afunction'); // should fail, did fail
