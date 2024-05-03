import { state } from '../state.js';

let counted = 0;

const counterval = setInterval(function countingSnippets() {
  document.title = 'Snippetry #' + counted;
  if (++counted > state.snippets.length) clearInterval(counterval);
}, 1000);
