import { fromJs } from 'esast-util-from-js';

import { lang } from '../../utils.js';

export const jsast = ({ text = '', title = '' }) => {
  const type = lang(title) === 'mjs' ? 'module' : 'script';

  try {
    return type === 'module' ? fromJs(text, { module: true }) : fromJs(text);
  } catch (_) {
    // can ignore syntactically incorrect snippets
    return null;
  }
};
