import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---------- file path constants ----------

const SNIPS_LIVE_HERE = join('snips.txt');
const SNIP_HERE = '-snip-';
const PUBLIC_SNIPS = join('public', 'data', 'snips.json');

// ---------- build array of snips ----------

const rawSnips = await readFile(SNIPS_LIVE_HERE, 'utf-8');

const log = (thing) => (console.log(thing), thing);

const snips = rawSnips
  .split(new RegExp(`${SNIP_HERE}.*`,'ig'))
  .map((snip) => {
    const split = snip.split('\n');

    for (const line of [...split]) {
      if (!line.trim()) split.shift();
      else break;
    }

    for (const line of [...split].reverse()) {
      if (!line.trim()) split.pop();
      else break;
    }

    return split.join('\n');
  })
  .filter((snip) => snip);

// ---------- write snip data to public folder ----------

await writeFile(
  PUBLIC_SNIPS,
  JSON.stringify(snips, null),
  (err) => err && console.error(err),
);

console.log('------ done gathering snips ------');
