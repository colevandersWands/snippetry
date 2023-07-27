import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---------- file path constants ----------

const SNIPS_LIVE_HERE = join('snips.txt');
const SNIP_HERE = 'snip';
const PUBLIC_SNIPS = join('public', 'snips.json');

// ---------- build array of snips ----------

const rawSnips = await readFile(SNIPS_LIVE_HERE, 'utf-8');

const snips = rawSnips
  .split(SNIP_HERE)
  .map((snip) =>
    snip
      .split('\n')
      .filter((ln) => ln)
      .join('\n'),
  )
  .filter((snip) => snip);

// ---------- write snip data to public folder ----------

await writeFile(
  PUBLIC_SNIPS,
  JSON.stringify(snips, null, '\t'),
  (err) => err && console.error(err),
);

console.log('------ done gathering snips! ------');
