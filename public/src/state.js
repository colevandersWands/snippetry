import { url } from './url.js';

import { shuffleArray } from './utils/shuffle-array.js';

import { filterSnipPets } from './procedures/filter-snip-pets.js';

// ===== import data =====

import comments from '../data/comments.json' assert { type: 'json' };
import snips from '../data/snips.json' assert { type: 'json' };
import snippets from '../data/snippets.json' assert { type: 'json' };
import tags from '../data/tags.json' assert { type: 'json' };

// ===== initialize state =====

export const state = { comments, dev: url.searchParams.get('dev') === '' ? true : false };

// --- initialize search ---

const persistedSearchEncoded = url.searchParams.get('search');

state.search = persistedSearchEncoded ? decodeURI(persistedSearchEncoded) : '';

// --- initialize tags ---

const persistedTagsEncoded = url.searchParams.get('tags');
const persistedTags = persistedTagsEncoded
  ? decodeURI(persistedTagsEncoded)
      .split(',')
      .filter((persistedTag) => tags.includes(persistedTag))
  : '';

state.tags = tags.map((tag) => ({
  value: tag,
  selected: persistedTags.includes(tag) ? true : false,
}));

// --- initialize dangerous life ---

state.liveDangerously =
  url.searchParams.has('danger') && url.searchParams.get('danger') === 'yes'
    ? true
    : false;

// --- initialize snips ---

state.snips = snips.map((snip) => ({ text: snip, display: true }));

// --- initialize snippets ---

state.snippets = shuffleArray(
  snippets
    .filter((snippet) => !snippet.title.startsWith('.'))
    .map((snippet) => ((snippet.display = false), snippet)),
);

state.snippets.unshift(
  shuffleArray(snippets.filter((snippet) => snippet.title.startsWith('.')))[0],
);
state.snippets[0].display = false;

const persistedSnippet = url.searchParams.get('snippet') || url.searchParams.get('title');
if (persistedSnippet) {
  const title = decodeURI(persistedSnippet).toLowerCase();
  for (const snippet of state.snippets) {
    if (snippet.title.toLowerCase() === title) {
      snippet.display = true;
    } else {
      snippet.display = false;
    }
  }
  for (const snip of state.snips) snip.display = false;
} else {
  filterSnipPets();
}
