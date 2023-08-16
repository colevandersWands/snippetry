import introducing from './introducing.mjs';

const Robert = introducing('Robert Fletcher');

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
