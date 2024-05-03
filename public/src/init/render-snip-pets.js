import { state } from '../state.js';

import { n } from '../utils/n.js';
import { nToDom } from '../utils/n-to-dom.js';
import { shuffleArray } from '../utils/shuffle-array.js';

import { abstractSnippetTree as ast } from '../abstract-snippet-tree/index.js';

const snippetsContainer = document.getElementById('snippets');

const postableSnips = shuffleArray(state.snips);

for (const snippet of state.snippets) {
  setTimeout(renderSnippet,0, snippet);

  if (
    postableSnips.length > 0 &&
    Math.random() < state.snips.length / state.snippets.length
  ) {
    setTimeout(renderSnip, 0, postableSnips.pop());
  }
}

// ------------------------

function renderSnippet(snippet) {
  snippet.ast = ast(snippet);

  snippet.dom = nToDom(snippet.ast);

  if (snippet.display) {
    snippet.dom.style.display = 'block';
  } else {
    snippet.dom.style.display = 'none';
  }

  snippetsContainer.appendChild(snippet.dom);
}

function renderSnip(snip) {
  snip.ast = n(
    'pre',
    'snip',
    n('textarea', {
      style: 'border: none; resize: none; overflow: hidden;',
      value: snip.text,
      rows: snip.text.split('\n').length,
      cols: snip.text.split('\n').reduce((a, b) => (a.length < b.length ? b : a), '')
        .length,
    }),
  );

  snip.dom = nToDom(snip.ast);

  if (snip.display) {
    snip.dom.style.display = 'block';
  } else {
    snip.dom.style.display = 'none';
  }

  snippetsContainer.appendChild(snip.dom);
}
