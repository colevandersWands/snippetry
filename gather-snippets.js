import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---------- file path constants ----------

const SNIPPETS_ROOT = join('snippets');

const PUBLIC_SNIPPETS = join('public', 'data', 'snippets.json');

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

// ---------- build array of snippet objects ----------

const snippetFileNames = (await readdir(SNIPPETS_ROOT))
  .filter((item) => !IGNORE.some((ext) => item.includes(ext)))
  .filter((item) => KEEP.some((ext) => item.endsWith(ext)));

const writingEmptyLanguageFiles = [];
for (const extension of KEEP) {
  if (!snippetFileNames.some((fileName) => fileName === extension)) {
    writingEmptyLanguageFiles.push(
      writeFile(join(SNIPPETS_ROOT, extension), '', 'utf-8'),
    );
  }
}
await Promise.all(writingEmptyLanguageFiles);

const snippetCode = await Promise.all(
  snippetFileNames.map((fileName) => readFile(join(SNIPPETS_ROOT, fileName), 'utf-8')),
);

const snippets = snippetFileNames.map((name, i) => ({
  name,
  code: snippetCode[i],
}));

// ---------- find tags for each snippets ----------

const tagsRegex = /(\(|\/\/|<!\-\-|\/\*|\#)[\s]*tags[\s]*:/gi;
for (const snippet of snippets) {
  const tags = snippet.code
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
    snippet.tags = tags;
  }
}

// ---------- find fore- and backlinks in markdown snippets ----------

// -- separate markdown and non-markdown snippets --
//    store in a data container and prepare basename
const markdownSnippets = snippets
  .filter((snippet) => snippet.name.endsWith('.md') && snippet.name !== '.md')
  .map((snippet) => {
    // convert relative links to anchor tags
    // using remark instead of regex could preserve relative image links
    snippet.code = snippet.code.replaceAll(/\(\.\//gi, '(#');
    return snippet;
  })
  .map((snippet) => ({
    snippet,
    baseName: snippet.name.split('.').shift(),
    backlinks: [],
    forelinks: [],
  }));
const notMarkdownSnippets = snippets
  .filter((snippet) => !snippet.name.endsWith('.md'))
  .map((snippet) => ({ snippet, baseName: snippet.name.split('.').shift() }));

// -- find all outgoing links from markdown files to other markdown files
for (const mdS of markdownSnippets) {
  mdS.forelinks = mdS.snippet.code.match(/(\#)[\w\d\-\_]*.md/gi) || [];
  mdS.forelinks?.map((forelink) => forelink.replace('#', ''));
}

// -- use previous list to find .md backlinks to all .md snippets
const markdownSnippestMap = markdownSnippets.reduce(
  (all, next) => ({ ...all, [next.snippet.name]: next }),
  {},
);
for (const mdS of markdownSnippets) {
  for (const forelink of mdS.forelinks) {
    markdownSnippestMap[forelink.replace('#', '')]?.backlinks.push(mdS.snippet.name);
  }
}

// -- find all non-md backlinks based on file basename
for (const mdS of markdownSnippets) {
  for (const notMd of notMarkdownSnippets) {
    if (notMd.baseName === mdS.baseName) {
      mdS.backlinks.push(notMd.snippet.name);
    }
  }
}

// -- sort backlinks alphabetically
for (const mdS of markdownSnippets) {
  if (mdS.backlinks.length > 0) {
    mdS.backlinks.sort();
    mdS.snippet.backlinks = mdS.backlinks;
  }
}

// ---------- compile meta-data ----------

const tags = Array.from(
  new Set(
    snippets
      .flatMap((snippet) => snippet.tags?.map((tag) => tag.toLowerCase()))
      .filter((tag) => tag),
  ),
).sort();

// ---------- write snippet data to public folder ----------

await writeFile(
  PUBLIC_SNIPPETS,
  JSON.stringify({ tags, snippets }, null),
  (err) => err && console.error(err),
);

console.log('------ done gathering snippets ------');
