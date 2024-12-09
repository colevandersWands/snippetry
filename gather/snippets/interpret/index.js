import { lang } from './utils.js';

// ======= language-specific interpreters =======

import { langs } from './langs/index.js';

// ======= main interpreter =======

export const interpret = (s = { title: '', text: '' }) => ({
  ...s,
  ...(langs[lang(s.title)] || langs.txt)(s),
});

export default interpret;
