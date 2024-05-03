import { HREF } from './CONSTANTS.js';

import { shuffleArray } from './utils/shuffle-array.js';

import { filterSnipPets } from './filter-snip-pets/index.js';

// ===== fetch data =====

const [comments, snips, snippets, tags] = await Promise.all([
  fetch('../public/data/comments.json').then((res) => res.json()),
  fetch('../public/data/snips.json').then((res) => res.json()),
  fetch('../public/data/snippets.json').then((res) => res.json()),
  fetch('../public/data/tags.json').then((res) => res.json()),
]);

// ===== initialize state =====

export const state = { comments };

// --- initialize search ---

const persistedSearchEncoded = HREF.searchParams.get('search');

state.search = persistedSearchEncoded ? decodeURI(persistedSearchEncoded) : '';

// --- initialize tags ---

const persistedTagsEncoded = HREF.searchParams.get('tags');
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
  HREF.searchParams.has('danger') && HREF.searchParams.get('danger') === 'yes'
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

const persistedSnippet =
  HREF.searchParams.get('snippet') || HREF.searchParams.get('title');
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
