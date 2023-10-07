import _ from './executable-pseudocode.mjs';
const { Set, Person, Barber, Paradox, expect } = _;

const hairadox = new Barber({ trims: (client) => !client.trimsSelf });

expect(() => hairadox.willTrim(hairadox)).toThrow(new Paradox('...?'));
