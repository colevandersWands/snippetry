import { chronicle } from './chronicle.mjs';

const sequitur = chronicle((non = '') => (non ? { [non]: sequitur } : { non: sequitur }));

sequitur('hi').hi('bye').bye().non('sequitur');

console.log(sequitur._chronicle);

// tags: useless, wuzzle
