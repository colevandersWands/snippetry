// blocked; how to speak multiple

// shepard's turtle

// import { introducing } from './introducing.mjs';
// const Shepard = introducing('Shepard');
// const turtle = (tone = {}) => Shepard('🐢', tone);

import { _spoken_ as Shepard } from './executable-comment.mjs';
const turtle = (tone = {}) => new Shepard(tone)['🐢'];

import { noises } from './noises.mjs';
// const turtle = (tone = {}) =>

const _1 = { pitch: 2, volume: 0.1 };
const _2 = { pitch: 1.75, volume: 0.25 };
const _3 = { pitch: 1.5, volume: 0.5 };
const _4 = { pitch: 1.25, volume: 0.75 };
const _5 = { pitch: 1, volume: 1 };
const _6 = { pitch: 0.75, volume: 0.25 };
const _7 = { pitch: 0.5, volume: 0.5 };
const _8 = { pitch: 0.25, volume: 0.25 };
const _9 = { pitch: 0, volume: 0.1 };

setTimeout(() => noises().play({ frequency: 587.3 }).stop(250));
setTimeout(() => turtle(_1), 0);
setTimeout(() => turtle(_3), 0);
setTimeout(() => turtle(_5), 0);
setTimeout(() => turtle(_7), 0);

setTimeout(() => turtle(_2), 500);
setTimeout(() => turtle(_4), 500);
setTimeout(() => turtle(_6), 500);
setTimeout(() => turtle(_8), 500);

setTimeout(() => turtle(_3), 1000);
setTimeout(() => turtle(_5), 1000);
setTimeout(() => turtle(_7), 1000);
setTimeout(() => turtle(_9), 1000);

setTimeout(() => turtle(_2), 1500);
setTimeout(() => turtle(_4), 1500);
setTimeout(() => turtle(_6), 1500);
setTimeout(() => turtle(_8), 1500);

setTimeout(() => turtle(_1), 2000);
setTimeout(() => turtle(_3), 2000);
setTimeout(() => turtle(_5), 2000);
setTimeout(() => turtle(_7), 2000);

setTimeout(() => turtle(_2), 2500);
setTimeout(() => turtle(_4), 2500);
setTimeout(() => turtle(_6), 2500);
setTimeout(() => turtle(_8), 2500);

setTimeout(() => turtle(_3), 3000);
setTimeout(() => turtle(_5), 3000);
setTimeout(() => turtle(_7), 3000);
setTimeout(() => turtle(_9), 3000);
