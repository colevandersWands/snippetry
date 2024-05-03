import { lang } from '../utils/titling.js';

import { n } from '../utils/n.js';

import { langs } from './langs/index.js';

import { editor } from './components/editor.js';
import { header } from './components/header.js';
import { interlinks } from './components/interlinks.js';
import { panel } from './components/panel.js';

export const abstractSnippetTree = (snippet = { title: '', text: '' }) => {
  const { translate } = langs[lang(snippet.title)];

  return translate({
    ast: n('div', { id: snippet.title, className: 'a-snippet' }, [
      n('div', 'snippet-header', [header(snippet), panel(snippet)]),
      n('div', { id: `${snippet.title}-text` }, editor(snippet)),
      interlinks(snippet),
    ]),
    snippet,
  });
};
