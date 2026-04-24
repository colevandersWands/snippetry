import { init, refresh } from '../../lib/let-time-in.js';

const opened = Date.now();
const DRIFT = 0.2 * (24 * 60 * 60); // days per second

const wither = () => {
  const born = new Date(opened - (Date.now() - opened) * DRIFT);
  document.getElementById('root').setAttribute('data-born', born.toISOString());
  refresh();
};

init({ observe: true, lifespanYears: 1 });
wither();
setInterval(wither, 1000);
