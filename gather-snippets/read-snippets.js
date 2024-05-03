import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { SNIPPETS_ROOT, IGNORE } from './constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const readSnippets = async (snippetsPath = __dirname) => {
  const snippetFileNames = (await readdir(snippetsPath)).filter(
    (item) => !IGNORE.some((ext) => item.includes(ext)),
  );

  const langs = Array.from(
    new Set(snippetFileNames.map((name) => name.split('.').pop())),
  );

  const langSnippets = langs.map((lang) => ({
    title: `.${lang}`,
    text: '',
    figment: true,
  }));

  const texts = await Promise.all(
    snippetFileNames.map((fileName) => readFile(join(SNIPPETS_ROOT, fileName), 'utf-8')),
  );

  return {
    snippets: snippetFileNames
      .map((title, thisOne) => ({
        title,
        text: texts[thisOne],
      }))
      .concat(langSnippets),
    langs,
  };
};
