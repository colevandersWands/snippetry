// use noises for shepard tone, and comment for turtle

import { _spoken_ } from './executable-comment.mjs';

import { noises } from './noises.mjs';
const { play } = noises();
const shepard = (freq = 440, vol = 0.5, ms = 250) => (
  play().frequency(freq).volume(vol).stop(ms), shepard
);

// good volume, now to cycle pitches and volume
setTimeout(() => {
  // https://github.com/iddan/shepard-tone/blob/master/src/shepard-tone.ts
  // + https://codepen.io/StevenBerliner/pen/rMVBjP?editors=1010
  // ! 40 lines ! see ./t-a-t-w-d.d-2.notes.mjs
  shepard(880, 0.1)(660, 0.5)(440, 1)(330, 0.5)(220, 0.1);
	_spoken_['🐢']
}, 0);

// setTimeout(() => turtle(_2), 500);
// setTimeout(() => turtle(_4), 500);
// setTimeout(() => turtle(_6), 500);
// setTimeout(() => turtle(_8), 500);

// setTimeout(() => turtle(_3), 1000);
// setTimeout(() => turtle(_5), 1000);
// setTimeout(() => turtle(_7), 1000);
// setTimeout(() => turtle(_9), 1000);

// setTimeout(() => turtle(_2), 1500);
// setTimeout(() => turtle(_4), 1500);
// setTimeout(() => turtle(_6), 1500);
// setTimeout(() => turtle(_8), 1500);

// setTimeout(() => turtle(_1), 2000);
// setTimeout(() => turtle(_3), 2000);
// setTimeout(() => turtle(_5), 2000);
// setTimeout(() => turtle(_7), 2000);

// setTimeout(() => turtle(_2), 2500);
// setTimeout(() => turtle(_4), 2500);
// setTimeout(() => turtle(_6), 2500);
// setTimeout(() => turtle(_8), 2500);

// setTimeout(() => turtle(_3), 3000);
// setTimeout(() => turtle(_5), 3000);
// setTimeout(() => turtle(_7), 3000);
// setTimeout(() => turtle(_9), 3000);
