import { introducing, theArrivalOf } from './introducing.mjs';

const Robert = introducing('Robert Fletcher');

console.log(Robert.recite);

console.log(Robert.name);

Robert('one');

Robert('two', { rate: 2 });

Robert.pitch = 2;

Robert('three');

Robert('four', { pitch: 1 });

alert(await Robert('awaited five'));

setTimeout(() => {
  Robert.voice = 'Fiona';
  Robert('as Fiona', { pitch: 1, rate: 1 });
}, 50);

await Robert.recite('./be.nl.txt');

theArrivalOf('Pierre', { voice: 'Organ' }, 1000).then((Pierre) => Pierre('hello'));

console.log('done');
