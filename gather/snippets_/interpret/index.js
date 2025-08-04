import { lang } from './utils.js';

// ======= language-specific interpreters =======

import { langs } from './langs/index.js';

// ======= main interpreter =======

export const interpret = (snippet = { title: '', text: '' }, snippets = []) => ({
  ...snippet,
  ...(langs[lang(snippet.title)] || langs.txt)(snippet, snippets),
});

export default interpret;
