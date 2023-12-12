import { HREF } from './CONSTANTS.js';

const [state, snips, comments] = await Promise.all([
  fetch('./public/data/snippets.json').then((res) => res.json()),
  fetch('./public/data/snips.json').then((res) => res.json()),
  fetch('./public/data/comments.json').then((res) => res.json()),
]);

state.comments = comments;
state.snips = snips;

// initialize snippets
for (const snippet of state.snippets) {
  if (!snippet.tags) snippet.tags = [];
}

// initialize tags
const persistedTagsEncoded = HREF.searchParams.get('tags');
const persistedTags = persistedTagsEncoded
  ? decodeURI(persistedTagsEncoded)
      .split(',')
      .filter((persistedTag) => state.tags.includes(persistedTag))
  : '';
state.tags = state.tags.map((tag) => ({
  value: tag,
  selected: persistedTags.includes(tag) ? true : false,
}));

// initialize query
const persistedQueryEncoded = HREF.searchParams.get('query');
state.query = persistedQueryEncoded ? decodeURI(persistedQueryEncoded) : '';

// initialize snippet
const persistedSnippetEncoded = HREF.searchParams.get('snippet');
state.snippet = persistedSnippetEncoded ? decodeURI(persistedSnippetEncoded) : '';

// initialize dangerous life
state.liveDangerously =
  !HREF.searchParams.has('danger') || HREF.searchParams.get('danger') !== 'yes'
    ? false
    : true;

export { state };
