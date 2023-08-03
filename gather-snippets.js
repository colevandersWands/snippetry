import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---------- file path constants ----------

const SNIPPETS_ROOT = join('snippets');

const PUBLIC_SNIPPETS = join('public', 'snippets.json');

const KEEP = ['.js', '.mjs', '.html', '.css', '.txt', '.svg', '.json'];

const IGNORE = ['.draft', '.sandbox', 'lenses.json'];

// ---------- build array of snippet objects ----------

const snippetFileNames = (await readdir(SNIPPETS_ROOT))
  .filter((item) => !IGNORE.some((ext) => item.includes(ext)))
  .filter((item) => KEEP.some((ext) => item.endsWith(ext)));

const snippetCode = await Promise.all(
  snippetFileNames.map((fileName) =>
    readFile(join(SNIPPETS_ROOT, fileName), 'utf-8'),
  ),
);

const snippets = snippetFileNames.map((name, i) => ({
  name,
  code: snippetCode[i],
}));

// ---------- find tags for each snippets ----------

const tagsRegex = /(\(|\/\/|<!\-\-|\/\*)[\s]*tags[\s]*:/gi;
for (const snippet of snippets) {
  snippet.tags = snippet.code
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
}

// ---------- compile meta-data ----------

const tags = Array.from(
  new Set(
    snippets.flatMap((snippet) => snippet.tags.map((tag) => tag.toLowerCase())),
  ),
).sort();

// ---------- write snippet data to public folder ----------

await writeFile(
  PUBLIC_SNIPPETS,
  JSON.stringify({ tags, snippets }, null, '\t'),
  (err) => err && console.error(err),
);

console.log('------ done gathering snippets! ------');
