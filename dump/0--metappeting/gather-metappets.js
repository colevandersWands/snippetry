import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import '../../public/lib/marked.min.js';

// ---------- file path constants ----------

const METAPPETS_ROOT = join('metappets');

const PUBLIC_METAPPETS = join('metappets.json');

const KEEP = [
  '.js',
  '.mjs',
  '.html',
  '.css',
  '.txt',
  '.svg',
  '.json',
  '.py',
  '.yaml',
  '.psu',
  '.md',
  '.sh',
];

const IGNORE = ['.draft', '.sandbox', '.notes', '.spec', 'lenses.json'];

// ---------- build array of metappet objects ----------

const metappetFileNames = (await readdir(METAPPETS_ROOT))
  .filter((item) => !IGNORE.some((ext) => item.includes(ext)))
  .filter((item) => KEEP.some((ext) => item.endsWith(ext)));

const metappetCode = await Promise.all(
  metappetFileNames.map((fileName) => readFile(join(METAPPETS_ROOT, fileName), 'utf-8')),
);

const metappets = metappetFileNames.map((name, i) => ({
  name,
  code: metappetCode[i],
}));

// ---------- find tags for each metappets ----------

const tagsRegex = /(\(|\/\/|<!\-\-|\/\*|\#)[\s]*tags[\s]*:/gi;
for (const metappet of metappets) {
  const tags = metappet.code
    .split('\n')
    .filter((line) => line.match(tagsRegex))
    .map((line) =>
      line
        .replaceAll(tagsRegex, '')
        .replaceAll('-->', '')
        .replaceAll('*/', '')
        .replaceAll(')', ''),
    )
    .flatMap((line) => line.split(','))
    .map((tag) => tag.trim().toLowerCase());

  if (tags.length > 0) {
    metappet.tags = tags;
  }
}

// ---------- find fore- and aftlinks ----------

const linkRegex = /(\#)[\w\d\-\_]*.md/gi;
for (const metappet of metappets) {
  // metappet.code = metappet.code.replaceAll('./', '#');
  metappet.code = marked.parse(metappet.code, {
    baseUrl: `#`, // didn't work as expected
    gfm: true,
  });

  const forelinks = metappet.code.match(linkRegex);
  if (forelinks) {
    metappet.forelinks = forelinks.map((forelink) => forelink.replace('#', ''));
  }
}

const metappetMap = metappets
  .map((metappet) => ((metappet.aftlinks = []), metappet))
  .reduce((all, next) => ({ ...all, [next.name]: next }), {});
for (const metappet of metappets) {
  if (metappet.forelinks) {
    for (const forelink of metappet.forelinks) {
      metappetMap[forelink].aftlinks.push(metappet.name);
    }
  }
}
for (const metappet of metappets) {
  if (metappet.aftlinks.length === 0) {
    delete metappet.aftlinks;
  }
}

// ---------- compile meta-data ----------

const tags = Array.from(
  new Set(
    metappets
      .flatMap((metappet) => metappet.tags?.map((tag) => tag.toLowerCase()))
      .filter((tag) => tag),
  ),
).sort();

// ---------- write metappet data to public folder ----------

await writeFile(
  PUBLIC_METAPPETS,
  JSON.stringify({ tags, metappets }, null),
  (err) => err && console.error(err),
);

console.log('------ done gathering metappets ------');
